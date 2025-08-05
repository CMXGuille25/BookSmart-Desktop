import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // API de autenticación
            "/api/auth": {
                target: "http://localhost:49357",
                changeOrigin: true,
                secure: false,
            },
            // API de business
            "/api/business": {
                target: "http://localhost:3333", // o el puerto que uses para business
                changeOrigin: true,
                secure: false,
            },
            // API biométrica
            "/api/v1": {
                target: "http://localhost:8000", // puerto de tu API biométrica
                changeOrigin: true,
                secure: false,
            },
            // Proxy general para cualquier otra ruta /api
            "/api": {
                target: "http://localhost:3333", // servidor principal por defecto
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
