import { registerProfessionalService, loginProfessionalService } from "./auth.service.js"

// Criar Profissional
export async function registerProfessional(req, res) {
  try {
    const professional = await registerProfessionalService(req.body)

    return res.status(201).json({
      message: "Profissional cadastrado com sucesso",
      professional,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

// Login do profissional
export async function loginProfessional(req, res) {
  try {
    const data = await loginProfessionalService(req.body)

    return res.status(200).json({
      message: "Login realizado com sucesso",
      ...data,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}
