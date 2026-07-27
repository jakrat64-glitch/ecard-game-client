import { io, Socket } from "socket.io-client";

function resolveSocketUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_SERVER_URL;

  if (configuredUrl && configuredUrl.trim()) {
    return configuredUrl.trim();
  }

  // The server is hosted on Render; the client may be served from Railway or
  // anywhere else. Any non-local host falls back to the deployed server rather
  // than to localhost, which is never reachable from a visitor's browser.
  // Never name an explicit port — these hosts serve over 443 only.
  if (typeof window !== "undefined" && !isLocalHost(window.location.hostname)) {
    return "https://ecard-game-server.onrender.com";
  }

  return "http://localhost:4000";
}

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

const SOCKET_URL = resolveSocketUrl();

let socketInstance: Socket | null = null;

/**
 * Lazily-created singleton Socket.io client. We avoid creating the
 * connection at module-eval time (SSR safety) — it's only instantiated the
 * first time a client component actually asks for it.
 */
export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      // Let Socket.io negotiate polling -> websocket upgrade automatically
      // rather than forcing websocket-only. Forcing websocket-only fails
      // hard in some proxied/sandboxed network environments that block or
      // mangle the WS upgrade handshake; polling-first with upgrade is the
      // more portable default and degrades gracefully.
    });
  }
  return socketInstance;
}
