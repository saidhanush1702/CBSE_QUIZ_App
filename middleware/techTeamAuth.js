import dotenv from "dotenv";
dotenv.config();

const TECH_TEAM_KEY = process.env.TECH_TEAM_KEY;

export function techTeamAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== TECH_TEAM_KEY) {
    return res.status(403).json({ error: "Forbidden: Tech team only" });
  }
  next();
}
