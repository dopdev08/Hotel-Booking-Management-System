import { getAuth } from "../utils/auth";

/**
 * Normalizes the base URL by stripping trailing slashes.
 * @param {string} [baseUrl]
 * @returns {string}
 */
export function normalizeBaseUrl(baseUrl = "/api") {
  if (!baseUrl || typeof baseUrl !== "string") return "/api";
  const trimmed = baseUrl.trim();
  return trimmed.replace(/\/+$/, "") || "/";
}

/**
 * Global API base path (defaults to "/api", can be overridden via VITE_API_BASE_URL).
 */
export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL || "/api"
);

/**
 * Checks if a specific header exists in headers object (case-insensitive).
 * @param {Record<string, string>} headers
 * @param {string} name
 * @returns {boolean}
 */
function hasHeader(headers, name) {
  if (!headers || typeof headers !== "object") return false;
  const target = name.toLowerCase();
  return Object.keys(headers).some((key) => key.toLowerCase() === target);
}

/**
 * Determines if a request body is a plain JS object/array that should be serialized to JSON.
 * Excludes binary types, stream types, FormData, URLSearchParams, strings, null, and undefined.
 *
 * @param {unknown} body
 * @returns {boolean}
 */
function isJsonSerializable(body) {
  if (body === null || body === undefined) return false;
  if (typeof body === "string") return false;
  if (typeof body !== "object") return false;

  // Preserve native browser payloads and binary data
  if (typeof FormData !== "undefined" && body instanceof FormData) return false;
  if (typeof Blob !== "undefined" && body instanceof Blob) return false;
  if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) return false;
  if (
    typeof ArrayBuffer !== "undefined" &&
    (body instanceof ArrayBuffer || ArrayBuffer.isView(body))
  ) {
    return false;
  }
  if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream) return false;

  return true;
}

/**
 * Resolves and standardizes the request URL against API_BASE_URL.
 *
 * @param {string} endpoint - Relative endpoint (e.g., "/rooms/all-rooms" or "rooms/all-rooms")
 * @param {string} [baseUrl] - Base API prefix (defaults to API_BASE_URL)
 * @returns {string} Standardized URL path
 * @throws {Error} If an absolute URL is provided
 */
export function buildUrl(endpoint, baseUrl = API_BASE_URL) {
  if (!endpoint || typeof endpoint !== "string") {
    return baseUrl;
  }

  const trimmed = endpoint.trim();

  // Reject absolute URLs to prevent bypassing proxy or hardcoding host/port
  if (/^https?:\/\//i.test(trimmed)) {
    throw new Error(
      `[apiClient] Absolute URL "${trimmed}" is not allowed. Please use relative endpoints (e.g., '/rooms/all-rooms').`
    );
  }

  // Ensure leading slash
  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  // If base URL is root "/", return path directly
  if (baseUrl === "/" || !baseUrl) {
    return normalizedPath;
  }

  // Prevent duplicate prefix (e.g. "/api" + "/api/rooms" -> "/api/rooms")
  // Ensures boundary check so "/api-docs" is not confused with "/api"
  if (normalizedPath === baseUrl || normalizedPath.startsWith(`${baseUrl}/`)) {
    return normalizedPath;
  }

  return `${baseUrl}${normalizedPath}`;
}

/**
 * Centralized API Client using Native Fetch API.
 * - Infrastructure layer only (no domain/business logic).
 * - Standardizes endpoint with API_BASE_URL (compatible with Vite proxy).
 * - Injects JWT Bearer token from auth storage if available.
 * - Serializes plain objects/arrays to JSON without breaking FormData/File uploads.
 * - Returns native Response object for full backward compatibility (.ok, .status, .json(), .text()).
 *
 * @param {string} endpoint - API endpoint (e.g. "/rooms/all-rooms")
 * @param {RequestInit} [options={}] - Fetch configuration options
 * @returns {Promise<Response>} Native fetch Response promise
 */
export async function apiClient(endpoint, options = {}) {
  const url = buildUrl(endpoint);
  const { headers = {}, body, ...customConfig } = options;

  const requestHeaders = { ...headers };

  // Attach JWT Bearer Token if available and not explicitly provided in headers
  const auth = getAuth();
  const token = auth?.token;
  if (token && !hasHeader(requestHeaders, "Authorization")) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Prepare request body and Content-Type header
  let requestBody = body;
  if (isJsonSerializable(body)) {
    requestBody = JSON.stringify(body);
    if (!hasHeader(requestHeaders, "Content-Type")) {
      requestHeaders["Content-Type"] = "application/json";
    }
  }

  return fetch(url, {
    ...customConfig,
    headers: requestHeaders,
    body: requestBody,
  });
}

/**
 * HTTP GET request helper.
 * @param {string} endpoint
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
apiClient.get = (endpoint, options = {}) =>
  apiClient(endpoint, { ...options, method: "GET" });

/**
 * HTTP POST request helper.
 * @param {string} endpoint
 * @param {any} [body]
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
apiClient.post = (endpoint, body, options = {}) =>
  apiClient(endpoint, { ...options, method: "POST", body });

/**
 * HTTP PUT request helper.
 * @param {string} endpoint
 * @param {any} [body]
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
apiClient.put = (endpoint, body, options = {}) =>
  apiClient(endpoint, { ...options, method: "PUT", body });

/**
 * HTTP PATCH request helper.
 * @param {string} endpoint
 * @param {any} [body]
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
apiClient.patch = (endpoint, body, options = {}) =>
  apiClient(endpoint, { ...options, method: "PATCH", body });

/**
 * HTTP DELETE request helper.
 * @param {string} endpoint
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
apiClient.delete = (endpoint, options = {}) =>
  apiClient(endpoint, { ...options, method: "DELETE" });

/**
 * Alias for general request execution.
 */
apiClient.request = apiClient;

export default apiClient;
