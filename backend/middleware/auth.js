// middleware/auth.js
import { supabaseAdmin } from "../supabaseClient.js";

/**
 * Middleware: authenticate request using Supabase access token
 * - Expects header: Authorization: Bearer <access_token>
 * - Attaches req.user = { id, email, role }
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    // Validate token with Supabase
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const supaUser = userData.user;
    const userId = supaUser.id;
    const userEmail = supaUser.email ?? null;

    // Attempt to fetch role/profile from users table (optional)
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("users")
      .select("role, name, avatar_url")
      .eq("id", userId)
      .single();

    let role = "student"; // default role
    let name = null;
    let avatar_url = null;

    if (!profileError && profileData) {
      role = profileData.role || role;
      name = profileData.name || null;
      avatar_url = profileData.avatar_url || null;
    }

    // Attach to request
    req.user = {
      id: userId,
      email: userEmail,
      role,
      name,
      avatar_url
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ error: "Authentication error" });
  }
}

/**
 * Helper middleware factory for role-based access:
 * Usage: authorize('teacher'), authorize('admin'), authorize(['teacher','admin'])
 */
export function authorize(requiredRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    next();
  };
}
