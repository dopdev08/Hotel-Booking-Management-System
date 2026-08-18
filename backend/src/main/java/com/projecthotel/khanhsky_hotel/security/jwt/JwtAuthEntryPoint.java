package com.projecthotel.khanhsky_hotel.security.jwt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthEntryPoint.class);

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException)
            throws IOException, ServletException {

        String path = request.getServletPath();
        Object orig = request.getAttribute("javax.servlet.error.request_uri");
        String originalPath = orig != null ? orig.toString() : null;

        // Log for debugging: original request URI and exception message
        logger.warn("AuthenticationEntryPoint triggered for path={}, originalPath={}, cause={}", path, originalPath, authException.getMessage(), authException);

        // 🔓 PUBLIC APIs → KHÔNG TRẢ 401
        if (path.startsWith("/auth/")
                || path.startsWith("/rooms/")
                || path.startsWith("/bootstrap/")) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // 🔒 PROTECTED APIs → TRẢ 401 JSON (include originalPath for debugging)
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        final Map<String, Object> body = new HashMap<>();
        body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
        body.put("error", "Unauthorized");
        body.put("message", authException.getMessage());
        body.put("path", path);
        if (originalPath != null) body.put("originalPath", originalPath);

        final ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), body);
    }
}
