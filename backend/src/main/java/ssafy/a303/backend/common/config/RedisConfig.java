package ssafy.a303.backend.common.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import ssafy.a303.backend.chat.service.ChatRedisPubSubService;
import ssafy.a303.backend.livestream.service.LiveRedisPubSubService;

/**
 * RedisConfig
 * =========================================================================================
 * 목적
 *  - Redis Pub/Sub 기반의 실시간 처리(채팅/라이브)를 안전하게 분리하고, 스프링이 기대하는
 *    기본 RedisTemplate 빈도 함께 제공하여 자동 설정/타 외부 라이브러리 요구사항을 충족한다.
 *
 * 전체 구조 개요
 *  1) "기본 RedisTemplate"(DB0)
 *     - @Primary 로 지정해서 "redisTemplate" 이름/타입을 기본 주입 대상으로 만든다.
 *     - 스프링 부트/외부 라이브러리에서 'redisTemplate' 빈을 기대할 때 충돌을 방지해준다.
 *
 *  2) 채팅 전용 Redis (DB1)
 *     - ConnectionFactory(=물리 연결)와 StringRedisTemplate(=문자열 직렬화 템플릿)을 분리 구성.
 *     - Pub/Sub 구독은 RedisMessageListenerContainer + MessageListenerAdapter 로 구현.
 *       - 컨테이너: "chat:*" 토픽을 감시 → 메시지 도착 시 어댑터에게 위임
 *       - 어댑터: ChatRedisPubSubService.onMessage(...) 메서드를 호출
 *     - 발행(PUBLISH)은 ChatRedisPubSubService 내부에서 chatRedisTemplate.convertAndSend(...) 사용.
 *
 *  3) 라이브 전용 Redis (DB2)
 *     - 채팅과 동일한 구조를 별도 DB/별도 템플릿로 구성("live:*" 채널 구독/발행).
 *
 * 설계 포인트
 *  - "DB 분리"를 통해 key-space와 Pub/Sub 트래픽을 논리적으로 격리 → 상호 간섭 감소.
 *  - Bean 명(@Qualifier)으로 의존성 주입을 명확히 분리 → 중복 Bean 충돌 방지.
 *  - 리스너/컨테이너는 "구독자" 역할, 서비스 내부 publish(...)는 "발행자" 역할.
 *  - 샤딩/클러스터로 확장 시에도 연결 팩토리만 분리 구성하면 손쉽게 대응 가능.
 *
 * 운영 팁
 *  - 토픽 네이밍: chat:{roomSeq}, live:{liveSeq} 처럼 계층형 키를 권장(모니터링/ACL 유리).
 *  - 보안/네트워크: 운영환경에서는 Redis AUTH/SSL, 보안 그룹/방화벽 설정 필수.
 *  - 직렬화: 여기선 문자열(JSON) 전송을 가정(프론트/백엔드 일관성). 바이너리가 필요하면 Serializer 교체.
 * =========================================================================================
 */
@Configuration
public class RedisConfig {

    // -- 공통 연결 정보: 단일 Redis 인스턴스(호스트/포트)를 쓰되, DB 인덱스로 논리 분리 --
    @Value("${spring.data.redis.host}")
    private String host;

    @Value("${spring.data.redis.port}")
    private int port;

    // ======================================================================================
    // [0] 기본 RedisTemplate (DB0) - @Primary
    //   - 스프링/외부 라이브러리가 'redisTemplate' 빈을 기대할 때 충족시키기 위한 기본 템플릿
    //   - 채팅/라이브와 완전히 분리하기 위해 DB0 사용
    //   - 별도의 @Qualifier 없이 타입/이름으로 주입되는 디폴트 템플릿
    // ======================================================================================
    @Bean
    @Primary
    public RedisTemplate<Object, Object> redisTemplate() {
        // (1) 단일 서버 구성 (host/port). 운영에서는 password/SSL 등 추가.
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(host, port);
        config.setDatabase(0); // 기본용 DB 인덱스(0)

        // (2) Lettuce 커넥션 팩토리: 비동기/논블로킹, 풀 내장. 성능/운영성 우수.
        LettuceConnectionFactory factory = new LettuceConnectionFactory(config);

        // (3) RedisTemplate 생성 및 커넥션 팩토리 연결
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // (선택) Serializer 지정 가능: template.setKeySerializer(...), setValueSerializer(...)
        // 여기서는 부하 최소/유연성 위해 기본 설정 유지 (필요시 String/JSON 지정)
        return template;
    }

    // ======================================================================================
    // [1] 채팅 전용 Redis (DB1)
    //   - 핵심 요소:
    //     a) chatRedisFactory  : DB1에 연결되는 커넥션 팩토리
    //     b) chatRedisTemplate : 문자열 기반 발행/저장용 템플릿
    //     c) chatMessageListenerContainer : "chat:*" 토픽을 구독하는 컨테이너
    //     d) chatMessageListenerAdapter   : 수신 메시지를 서비스 메서드로 위임
    // ======================================================================================

    /** a) 채팅용 ConnectionFactory (DB1) */
    @Bean
    @Qualifier("chatRedisFactory")
    public RedisConnectionFactory chatRedisFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(host, port);
        config.setDatabase(1); // DB1 = 채팅
        // (선택) config.setPassword(...), TLS 설정 등
        return new LettuceConnectionFactory(config);
    }

    /** b) 채팅용 StringRedisTemplate
     *  - 문자열(JSON) 기반 직렬화를 위한 템플릿
     *  - ChatRedisPubSubService.publish(...) 에서 convertAndSend(...) 로 사용
     */
    @Bean
    @Qualifier("chatRedisTemplate")
    public StringRedisTemplate chatRedisTemplate(
            @Qualifier("chatRedisFactory") RedisConnectionFactory factory) {
        return new StringRedisTemplate(factory);
    }

    /** c) 채팅용 구독 컨테이너
     *  - Redis 서버와의 Pub/Sub 구독 연결을 유지
     *  - PatternTopic("chat:*") → "chat:" 접두사로 시작하는 모든 채널 수신
     *  - 메시지 도착 시 아래 어댑터(chatMessageListenerAdapter)에게 전달
     */
    @Bean
    @Qualifier("chatMessageListenerContainer")
    public RedisMessageListenerContainer chatMessageListenerContainer(
            @Qualifier("chatRedisFactory") RedisConnectionFactory factory,
            @Qualifier("chatMessageListenerAdapter") MessageListenerAdapter adapter) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(factory);

        // 토픽 등록: chat:1, chat:123 등 모든 채널
        container.addMessageListener(adapter, new PatternTopic("chat:*"));

        // (선택) 스레드 풀/에러 핸들러 지정 가능: container.setTaskExecutor(...), setErrorHandler(...)
        return container;
    }

    /** d) 채팅용 메시지 리스너 어댑터
     *  - Redis에서 수신한 메시지를 ChatRedisPubSubService.onMessage(...) 로 위임
     *  - 주의: onMessage 시그니처는 (org.springframework.data.redis.connection.Message, byte[]) 이어야 함
     *    → Service 에서는 Jackson으로 payload(JSON) → DTO 변환 후, /sub/chat/{roomSeq} 로 브로드캐스트
     */
    @Bean
    @Qualifier("chatMessageListenerAdapter")
    public MessageListenerAdapter chatMessageListenerAdapter(ChatRedisPubSubService chatRedisPubSubService) {
        // 두 번째 인자 "onMessage" = 수신 시 호출될 메서드명
        return new MessageListenerAdapter(chatRedisPubSubService, "onMessage");
    }

    // ======================================================================================
    // [2] 라이브 전용 Redis (DB2)
    //   - 채팅과 동일한 패턴으로 완전 분리 (연결/템플릿/컨테이너/어댑터)
    //   - 토픽 접두사: "live:*"
    // ======================================================================================

    /** a) 라이브용 ConnectionFactory (DB2) */
    @Bean
    @Qualifier("liveRedisFactory")
    public RedisConnectionFactory liveRedisFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(host, port);
        config.setDatabase(2); // DB2 = 라이브
        return new LettuceConnectionFactory(config);
    }

    /** b) 라이브용 StringRedisTemplate
     *  - 라이브 채팅/좋아요/입장/퇴장 등 이벤트 전송에 사용
     */
    @Bean
    @Qualifier("liveRedisTemplate")
    public StringRedisTemplate liveRedisTemplate(
            @Qualifier("liveRedisFactory") RedisConnectionFactory factory) {
        return new StringRedisTemplate(factory);
    }

    /** c) 라이브용 구독 컨테이너
     *  - "live:*" 토픽을 수신하여 어댑터로 메시지 전달
     */
    @Bean
    @Qualifier("liveMessageListenerContainer")
    public RedisMessageListenerContainer liveMessageListenerContainer(
            @Qualifier("liveRedisFactory") RedisConnectionFactory factory,
            @Qualifier("liveMessageListenerAdapter") MessageListenerAdapter adapter) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(factory);
        container.addMessageListener(adapter, new PatternTopic("live:*"));
        return container;
    }

    /** d) 라이브용 메시지 리스너 어댑터
     *  - LiveRedisPubSubService.onMessage(...) 호출
     *  - 서비스에서 payload(JSON) → DTO 역직렬화 후, /sub/live/{liveSeq} 로 브로드캐스트
     */
    @Bean
    @Qualifier("liveMessageListenerAdapter")
    public MessageListenerAdapter liveMessageListenerAdapter(LiveRedisPubSubService liveRedisPubSubService) {
        return new MessageListenerAdapter(liveRedisPubSubService, "onMessage");
    }

    // ================================================================
    // [3] SMS 전용 Redis DB3
    // ================================================================
    @Bean
    @Qualifier("smsRedisTemplate")
    public StringRedisTemplate smsRedisTempate(
        @Qualifier("smsRedisFactory") RedisConnectionFactory factory
    ){
        return new StringRedisTemplate(factory);
    }
    @Bean
    @Qualifier("smsRedisFactory")
    public RedisConnectionFactory smsRedisFactory(){
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(host, port);
        config.setDatabase(3);
        return new LettuceConnectionFactory(config);
    }
}
