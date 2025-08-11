export const refreshToken = async () => {
    try {
        const currentToken = localStorage.getItem("token");

        if (!currentToken) {
            throw new Error("No token available");
        }

        const response = await fetch("/api/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const newToken = data.data?.token || data.token;

            if (newToken) {
                localStorage.setItem("token", newToken);
                console.log("✅ Token refreshed successfully");
                return newToken;
            }
        }

        // If refresh fails, immediately redirect to login
        console.warn("⚠️ Token refresh failed, redirecting to login");
        throw new Error("Failed to refresh token");
    } catch (error) {
        console.error("❌ Token refresh failed:", error);
        clearAuthData();
        redirectToLogin();
        return null;
    }
};

export const fetchWithAuth = async (url, options = {}) => {
    try {
        let token = localStorage.getItem("token");

        if (!token) {
            console.warn(
                "⚠️ No authentication token found, redirecting to login"
            );
            clearAuthData();
            redirectToLogin();
            throw new Error("No authentication token found");
        }

        // First attempt with current token
        let response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        });

        // If token is invalid/expired (401), try to refresh ONCE
        if (response.status === 401) {
            console.log("🔄 Token expired, attempting refresh...");

            const newToken = await refreshToken();
            if (!newToken) {
                // refreshToken already handles redirect, just throw error
                throw new Error("Authentication failed - session expired");
            }

            // Retry with new token
            response = await fetch(url, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                    Authorization: `Bearer ${newToken}`,
                },
            });

            // If still 401 after refresh, immediately redirect
            if (response.status === 401) {
                console.error("❌ Still unauthorized after token refresh");
                clearAuthData();
                redirectToLogin();
                throw new Error("Authentication failed - please login again");
            }
        }

        // If we get a 500 error and it's auth-related, also redirect
        if (response.status === 500) {
            try {
                const errorData = await response.clone().json();
                // Check if 500 error is due to authentication issues
                if (
                    errorData.msg &&
                    (errorData.msg.includes("token") ||
                        errorData.msg.includes("authentication") ||
                        errorData.msg.includes("unauthorized") ||
                        errorData.code?.includes("AUTH"))
                ) {
                    console.warn(
                        "⚠️ 500 error appears to be authentication related, redirecting to login"
                    );
                    clearAuthData();
                    redirectToLogin();
                    throw new Error(
                        "Authentication error - redirecting to login"
                    );
                }
            } catch (parseError) {
                console.warn("Could not parse 500 error response");
            }
        }

        return response;
    } catch (error) {
        console.error("❌ Fetch with auth error:", error);

        // More aggressive auth error detection
        if (
            error.message.includes("authentication") ||
            error.message.includes("token") ||
            error.message.includes("unauthorized") ||
            error.message.includes("session expired") ||
            error.message.includes("login")
        ) {
            console.warn(
                "⚠️ Authentication-related error detected, ensuring redirect to login"
            );
            clearAuthData();
            redirectToLogin();
        }

        throw error;
    }
};

// Helper function to clear all auth data
const clearAuthData = () => {
    console.log("🧹 Clearing all authentication data");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("biblioteca");
    localStorage.removeItem("usuario_registro_temp");
    localStorage.removeItem("usuario_id");

    // Clear any other session-related data
    sessionStorage.clear();
};

// Helper function to redirect to login
const redirectToLogin = () => {
    console.log("🔄 Initiating redirect to login page");

    // Clear any existing timeouts to prevent multiple redirects
    if (window.loginRedirectTimeout) {
        clearTimeout(window.loginRedirectTimeout);
    }

    // Immediate redirect if not already on login page
    if (
        window.location.pathname !== "/Inicio" &&
        window.location.pathname !== "/"
    ) {
        // Use replace instead of href to prevent back button issues
        window.location.replace("/");
    }
};

// Export clearAuthData so it can be used by ProtectedRoute
export { clearAuthData };

// Check if user has basic authentication (token only)
export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
};

// Enhanced session health check - checks both token and biblioteca_id
export const checkSessionHealth = () => {
    const token = localStorage.getItem("token");
    const biblioteca = localStorage.getItem("biblioteca");

    if (!token) {
        console.warn("⚠️ No authentication token found");
        return false;
    }

    if (!biblioteca) {
        console.warn("⚠️ No biblioteca ID found - incomplete session");
        return false;
    }

    return true;
};

// Enhanced token validation
export const validateTokenBeforeRequest = () => {
    const token = localStorage.getItem("token");
    const biblioteca = localStorage.getItem("biblioteca");

    if (!token) {
        console.warn("⚠️ No token found before request");
        clearAuthData();
        redirectToLogin();
        return false;
    }

    if (!biblioteca) {
        console.warn("⚠️ No biblioteca ID found - incomplete session");
        clearAuthData();
        redirectToLogin();
        return false;
    }

    return true;
};

// Enhanced logout function
export const logout = () => {
    console.log("👋 User logging out");
    clearAuthData();
    redirectToLogin();
};

// Auto-check session health on critical pages
export const requireAuth = () => {
    if (!checkSessionHealth()) {
        throw new Error("Authentication required");
    }
};
