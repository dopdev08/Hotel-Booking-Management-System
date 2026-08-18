package com.projecthotel.khanhsky_hotel.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.TimeUnit;

@Component
public class LoginAttemptService {

    private final ConcurrentHashMap<String, Deque<Long>> attempts = new ConcurrentHashMap<>();

    // configuration
    private final int maxAttempts = 5; // max failed attempts
    private final long windowMillis = TimeUnit.MINUTES.toMillis(15); // sliding window
    private final long blockMillis = TimeUnit.MINUTES.toMillis(15); // block duration

    public void loginSucceeded(String key) {
        attempts.remove(key);
    }

    public void loginFailed(String key) {
        long now = Instant.now().toEpochMilli();
        Deque<Long> dq = attempts.computeIfAbsent(key, k -> new ConcurrentLinkedDeque<>());
        dq.addLast(now);
    }

    public boolean isBlocked(String key) {
        long now = Instant.now().toEpochMilli();
        Deque<Long> dq = attempts.get(key);
        if (dq == null) return false;

        // remove old timestamps outside the sliding window
        while (!dq.isEmpty() && (now - dq.peekFirst()) > windowMillis) {
            dq.removeFirst();
        }

        if (dq.size() >= maxAttempts) {
            long first = dq.peekFirst();
            if ((now - first) <= blockMillis) {
                return true;
            } else {
                // window expired, clear
                dq.clear();
                return false;
            }
        }
        return false;
    }

    public long getRemainingBlockMillis(String key) {
        long now = Instant.now().toEpochMilli();
        Deque<Long> dq = attempts.get(key);
        if (dq == null || dq.size() < maxAttempts) return 0L;
        long first = dq.peekFirst();
        long elapsed = now - first;
        if (elapsed > blockMillis) return 0L;
        return blockMillis - elapsed;
    }
}