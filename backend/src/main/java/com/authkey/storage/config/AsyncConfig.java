package com.authkey.storage.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Async Configuration
 * Configures asynchronous task execution for operations like email sending
 */
@Slf4j
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Value("${async.core-pool-size:5}")
    private int corePoolSize;

    @Value("${async.max-pool-size:10}")
    private int maxPoolSize;

    @Value("${async.queue-capacity:100}")
    private int queueCapacity;

    @Value("${async.thread-name-prefix:AsyncTask-}")
    private String threadNamePrefix;

    /**
     * Configure async task executor
     *
     * @return configured Executor
     */
    @Bean(name = "taskExecutor")
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // Core pool size - minimum number of threads
        executor.setCorePoolSize(corePoolSize);

        // Max pool size - maximum number of threads
        executor.setMaxPoolSize(maxPoolSize);

        // Queue capacity - size of the queue before creating new threads
        executor.setQueueCapacity(queueCapacity);

        // Thread name prefix for easier debugging
        executor.setThreadNamePrefix(threadNamePrefix);

        // Wait for tasks to complete on shutdown
        executor.setWaitForTasksToCompleteOnShutdown(true);

        // Maximum time to wait for tasks to complete
        executor.setAwaitTerminationSeconds(60);

        // Rejection policy - what to do when queue is full
        // CallerRunsPolicy - run task in calling thread if pool is saturated
        executor.setRejectedExecutionHandler(
                new java.util.concurrent.ThreadPoolExecutor.CallerRunsPolicy()
        );

        executor.initialize();

        log.info("Async task executor configured with core pool size: {}, max pool size: {}, queue capacity: {}",
                corePoolSize, maxPoolSize, queueCapacity);

        return executor;
    }

    /**
     * Configure exception handler for async tasks
     *
     * @return AsyncUncaughtExceptionHandler
     */
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (throwable, method, params) -> {
            log.error("Async task exception in method: {} with parameters: {}",
                    method.getName(), params, throwable);

            // You can add additional error handling here, such as:
            // - Sending notifications
            // - Recording to error tracking service
            // - Retry logic
        };
    }

    /**
     * Email task executor - separate executor for email operations
     * This ensures email sending doesn't block other async operations
     *
     * @return configured Executor for email tasks
     */
    @Bean(name = "emailTaskExecutor")
    public Executor emailTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("EmailTask-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(60);

        executor.setRejectedExecutionHandler(
                new java.util.concurrent.ThreadPoolExecutor.CallerRunsPolicy()
        );

        executor.initialize();

        log.info("Email task executor configured");

        return executor;
    }

    /**
     * Audit log task executor - separate executor for audit logging
     * This ensures audit logging doesn't impact application performance
     *
     * @return configured Executor for audit log tasks
     */
    @Bean(name = "auditLogTaskExecutor")
    public Executor auditLogTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(200);
        executor.setThreadNamePrefix("AuditLogTask-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);

        executor.setRejectedExecutionHandler(
                new java.util.concurrent.ThreadPoolExecutor.CallerRunsPolicy()
        );

        executor.initialize();

        log.info("Audit log task executor configured");

        return executor;
    }
}
