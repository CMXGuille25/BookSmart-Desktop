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

        throw new Error("Failed to refresh token");
    } catch (error) {
        console.error("❌ Token refresh failed:", error);
        // Clear invalid tokens
        clearAuthData();
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
            // Instead of throwing immediately, try to handle gracefully
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

        // If token is invalid/expired (401), try to refresh
        if (response.status === 401) {
            console.log("🔄 Token expired, attempting refresh...");

            const newToken = await refreshToken();
            if (!newToken) {
                console.warn("⚠️ Token refresh failed, redirecting to login");
                redirectToLogin();
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

            // If still 401 after refresh, something is wrong
            if (response.status === 401) {
                console.error("❌ Still unauthorized after token refresh");
                clearAuthData();
                redirectToLogin();
                throw new Error("Authentication failed - please login again");
            }
        }

        return response;
    } catch (error) {
        console.error("❌ Fetch with auth error:", error);

        // If it's an auth-related error, ensure we redirect to login
        if (
            error.message.includes("authentication") ||
            error.message.includes("token")
        ) {
            clearAuthData();
            redirectToLogin();
        }

        throw error;
    }
};

// Helper function to clear all auth data
const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("biblioteca");
    localStorage.removeItem("usuario_registro_temp"); // Clear any temp user data too
};

// Helper function to redirect to login
const redirectToLogin = () => {
    // Add a small delay to prevent immediate redirect loops
    setTimeout(() => {
        if (window.location.pathname !== "/Inicio") {
            console.log("🔄 Redirecting to login page");
            window.location.href = "/Inicio";
        }
    }, 100);
};

// Optional: Helper to check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
};

// Optional: Helper to logout user
export const logout = () => {
    clearAuthData();
    redirectToLogin();
};

// New: Helper to check token validity before making requests
export const validateTokenBeforeRequest = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.warn("⚠️ No token found before request");
        clearAuthData();
        redirectToLogin();
        return false;
    }
    return true;
};
