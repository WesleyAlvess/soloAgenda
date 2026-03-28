import jwt from "jsonwebtoken"

export function generateToken(professionalId) {
  return jwt.sign({ id: professionalId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
}
