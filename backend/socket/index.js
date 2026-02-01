// socket/index.js
import { Server } from "socket.io";
import { supabaseAdmin } from "../supabaseClient.js";

/**
 * initSocket(httpServer) -> returns io instance
 * Handles real-time lobby events and keeps DB in sync.
 */
export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // adjust for production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join socket to a room (session_id) for broadcasts
    socket.on("join_session", async ({ session_id, user }) => {
      try {
        if (!session_id || !user?.id) return;

        socket.join(session_id);

        // Update players list in DB: add or update by user id
        const { data: session } = await supabaseAdmin
          .from("multiplayer_sessions")
          .select("*")
          .eq("id", session_id)
          .single();

        if (!session) {
          socket.emit("error", { message: "Session not found" });
          return;
        }

        const players = Array.isArray(session.players) ? session.players : [];
        const now = new Date().toISOString();
        const newPlayer = {
          id: user.id,
          name: user.name || user.email || "Anonymous",
          avatar: user.avatar_url || null,
          socket_id: socket.id,
          joined_at: now
        };

        const filtered = players.filter(p => p.id !== user.id);
        filtered.push(newPlayer);

        await supabaseAdmin
          .from("multiplayer_sessions")
          .update({ players: filtered })
          .eq("id", session_id);

        // Broadcast updated lobby to room
        io.to(session_id).emit("lobby_update", { session_id, players: filtered });
      } catch (err) {
        console.error("join_session error:", err);
      }
    });

    // Handle leaving a session
    socket.on("leave_session", async ({ session_id, user_id }) => {
      try {
        socket.leave(session_id);
        const { data: session } = await supabaseAdmin
          .from("multiplayer_sessions")
          .select("*")
          .eq("id", session_id)
          .single();

        if (!session) return;

        const players = Array.isArray(session.players) ? session.players.filter(p => p.id !== user_id) : [];
        await supabaseAdmin
          .from("multiplayer_sessions")
          .update({ players })
          .eq("id", session_id);

        io.to(session_id).emit("lobby_update", { session_id, players });
      } catch (err) {
        console.error("leave_session error:", err);
      }
    });

    // Player submits answers via socket (real-time)
    socket.on("submit_answers", async ({ session_id, user_id, answers }) => {
      try {
        // Save result in multiplayer_results
        const { data } = await supabaseAdmin
          .from("multiplayer_results")
          .insert([{ session_id, user_id, answers }])
          .select()
          .single();

        // Broadcast submission event (host can tally)
        io.to(session_id).emit("player_submitted", { session_id, user_id, result: data });
      } catch (err) {
        console.error("submit_answers error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      // Optionally handle cleanup: find sessions with this socket_id and mark disconnected
    });
  });

  return io;
}

