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
 * ======================================================================
 * Redis를 다음과 같이 분리하여 사용한다.
 *
 *  DB0 → 공용 RedisTemplate (기본 Spring 사용 / 세션 등)
 *  DB1 → 1:1 채팅용 Redis (Pub/Sub + 채팅 메시지 저장)
 *  DB2 → 라이브 방송용 Redis (시청자/좋아요/채팅 실시간 이벤트)
 *
 * 분리 이유:
 *  - 채팅과 라이브 방송은 트래픽이 크고 실시간 특성이 강함
 *  - 서로 간섭되지 않도록 Redis DB를 논리적으로 분리
 *  - 대규모 트래픽에서도 안전하게 확장 가능
 * ======================================================================
 */
@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.host}")
    private String host;
    @Value("${spring.data.redis.port}")
    private int port;

    /* =====================================================================
       DB0 : 기본 RedisTemplate (Spring이 기대하는 기본 템플릿)
       - @Primary 로 지정 → redisTemplate 이 필요할 때 기본적으로 이 Bean 사용
     ===================================================================== */
    @Bean
    @Primary
    public RedisTemplate<Object, Object> redisTemplate() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(host, port);
        config.setDatabase(0); // DB0

        LettuceConnectionFactory factory = new LettuceConnectionFactory(config);
        factory.afterPropertiesSet(); // 초기화

        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        return template;
    }

    /* =====================================================================
       DB1 : 1:1 채팅용 Redis
       pub/sub + 채팅 메시지를 저장/조회하는 영역
     ===================================================================== */

    @Bean
    @Qualifier("chatRedisFactory")
    public RedisConnectionFactory chatRedisFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(host, port);
        config.setDatabase(1); // DB1

        LettuceConnectionFactory factory = new LettuceConnectionFactory(config);
        factory.afterPropertiesSet(); // 초기화
        return factory;
    }

    // 문자열 기반 전송 템플릿 (Pub/Sub 메시지 용)
    @Bean
    @Qualifier("chatRedisTemplate")
    public StringRedisTemplate chatRedisTemplate(
            @Qualifier("chatRedisFactory") RedisConnectionFactory factory) {
        return new StringRedisTemplate(factory);
    }

    // chat:* 채널을 구독하여 메시지를 수신하는 Listener 컨테이너
    @Bean
    @Qualifier("chatMessageListenerContainer")
    public RedisMessageListenerContainer chatMessageListenerContainer(
            @Qualifier("chatRedisFactory") RedisConnectionFactory factory,
            @Qualifier("chatMessageListenerAdapter") MessageListenerAdapter adapter) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(factory);
        container.addMessageListener(adapter, new PatternTopic("chat:*")); // 모든 채팅방 수신
        return container;
    }

    // Redis → ChatRedisPubSubService.onMessage() 로 연결
    @Bean
    @Qualifier("chatMessageListenerAdapter")
    public MessageListenerAdapter chatMessageListenerAdapter(ChatRedisPubSubService service) {
        return new MessageListenerAdapter(service, "onMessage");
    }

    /* =====================================================================
       DB2 : 라이브 방송용 Redis
       실시간 이벤트: 시청자 수 / 좋아요 / 채팅 / 방송 종료 신호 등
     ===================================================================== */

    @Bean
    @Qualifier("liveRedisFactory")
    public RedisConnectionFactory liveRedisFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(host, port);
        config.setDatabase(2); // DB2

        LettuceConnectionFactory factory = new LettuceConnectionFactory(config);
        factory.afterPropertiesSet(); // 초기화
        return factory;
    }

    // 문자열 기반 Pub/Sub 템플릿 (실시간 이벤트 송신)
    @Bean
    @Qualifier("liveRedisTemplate")
    public StringRedisTemplate liveRedisTemplate(
            @Qualifier("liveRedisFactory") RedisConnectionFactory factory) {
        return new StringRedisTemplate(factory);
    }

    // live:* 채널 구독 → onMessage() 실행 → STOMP 로 브로드캐스트
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

    @Bean
    @Qualifier("liveMessageListenerAdapter")
    public MessageListenerAdapter liveMessageListenerAdapter(LiveRedisPubSubService service) {
        return new MessageListenerAdapter(service, "onMessage");
    }

    /* =====================================================================
       라이브 채팅 메시지 저장용 RedisTemplate (Object → JSON 직렬화 저장)
       - Pub/Sub 은 문자열 템플릿(liveRedisTemplate)
       - 채팅 기록 저장/조회는 JSON RedisTemplate(liveRedisObjectTemplate)
     ===================================================================== */
    @Bean
    @Qualifier("liveRedisObjectTemplate")
    public RedisTemplate<String, Object> liveRedisObjectTemplate(
            @Qualifier("liveRedisFactory") RedisConnectionFactory factory) {

        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        template.setKeySerializer(new org.springframework.data.redis.serializer.StringRedisSerializer());
        template.setValueSerializer(new org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer(new org.springframework.data.redis.serializer.StringRedisSerializer());
        template.setHashValueSerializer(new org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer());

        template.afterPropertiesSet();
        return template;
    }
}
