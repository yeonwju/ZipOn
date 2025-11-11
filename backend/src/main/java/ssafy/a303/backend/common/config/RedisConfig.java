package ssafy.a303.backend.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import ssafy.a303.backend.chat.service.ChatRedisPubSubService;
import ssafy.a303.backend.chat.service.ChatNotificationPubSubService;
import ssafy.a303.backend.livestream.service.LiveRedisPubSubService;
import ssafy.a303.backend.livestream.service.LiveStatsUpdatePubSubService;

/**
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

    // 채팅 메시지를 Publish 하는 RedisTemplate (문자열 기반)
    @Bean
    @Qualifier("chatRedisTemplate")
    public StringRedisTemplate chatRedisTemplate(
            @Qualifier("chatRedisFactory") RedisConnectionFactory factory) {
        return new StringRedisTemplate(factory);
    }

    // chat:* 채널을 구독하며 들어온 채팅 메시지를 듣는 Listener
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

    // Redis 수신 메시지를 보기좋게 변환하며 → ChatRedisPubSubService.onMessage() 로 전달하는 어댑터
    @Bean
    @Qualifier("chatMessageListenerAdapter")
    public MessageListenerAdapter chatMessageListenerAdapter(ChatRedisPubSubService service) {
        return new MessageListenerAdapter(service, "onMessage");
    }

    // user:notifications:* 채널 구독 (사용자별 알림 이벤트 수신)
    // 1:1 채팅 메시지 목록 전체 구독
    @Bean
    @Qualifier("chatNotificationListenerContainer")
    public RedisMessageListenerContainer chatNotificationListenerContainer(
            @Qualifier("chatRedisFactory") RedisConnectionFactory factory,
            @Qualifier("chatNotificationListenerAdapter") MessageListenerAdapter adapter) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(factory);
        // user:notifications:* 패턴으로 모든 사용자의 알림 채널 구독
        container.addMessageListener(adapter, new PatternTopic("user:notifications:*"));
        return container;
    }

    // Redis 알림 메시지를 → ChatNotificationPubSubService.onMessage() 로 전달하는 어댑터
    @Bean
    @Qualifier("chatNotificationListenerAdapter")
    public MessageListenerAdapter chatNotificationListenerAdapter(ChatNotificationPubSubService service) {
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

    // 라이브 방송 실시간 이벤트 Publish 용 RedisTemplate (문자열 기반)
    @Bean
    @Qualifier("liveRedisTemplate")
    public StringRedisTemplate liveRedisTemplate(
            @Qualifier("liveRedisFactory") RedisConnectionFactory factory) {
        return new StringRedisTemplate(factory);
    }

    // live:* 채널 수신 → STOMP 로 시청자들 화면 갱신
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

    // 라이브 실시간 메시지를 → LiveRedisPubSubService.onMessage() 로 전달하는 어댑터
    @Bean
    @Qualifier("liveMessageListenerAdapter")
    public MessageListenerAdapter liveMessageListenerAdapter(LiveRedisPubSubService service) {
        return new MessageListenerAdapter(service, "onMessage");
    }

    // 실시간 방송 통계(시청자 수/좋아요 수/댓글 수) 업데이트 구독
    @Bean
    @Qualifier("liveStatsUpdateListenerContainer")
    public RedisMessageListenerContainer liveStatsUpdateListenerContainer(
            @Qualifier("liveRedisFactory") RedisConnectionFactory factory,
            @Qualifier("liveStatsUpdateListenerAdapter") MessageListenerAdapter adapter) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(factory);
        // live:stats:updates 채널 구독
        container.addMessageListener(adapter, new PatternTopic("live:stats:updates"));
        return container;
    }

    // 방송 통계 메시지를 → LiveStatsUpdatePubSubService.onMessage() 로 전달하는 어댑터
    @Bean
    @Qualifier("liveStatsUpdateListenerAdapter")
    public MessageListenerAdapter liveStatsUpdateListenerAdapter(LiveStatsUpdatePubSubService service) {
        return new MessageListenerAdapter(service, "onMessage");
    }

    // 라이브 채팅 로그/이벤트를 Redis에JSON 형식으로 저장하는 RedisTemplate
    @Bean
    @Qualifier("liveRedisObjectTemplate")
    public RedisTemplate<String, Object> liveRedisObjectTemplate(
            @Qualifier("liveRedisFactory") RedisConnectionFactory factory) {

        // ObjectMapper 설정 (LocalDateTime 직렬화 지원)
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // LocalDateTime 같은 날짜 필드도 JSON으로 변환 가능
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); // ISO-8601 형식으로 저장

        // JSON Serializer 생성
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer(objectMapper);

        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(jsonSerializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }
}
