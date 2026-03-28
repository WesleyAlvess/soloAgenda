import bcrypt from "bcryptjs"
import Professional from "../professionals/professional.model.js"
import { generateToken } from "../../utils/generateToken.js"

// Registro do Profissional
export async function registerProfessionalService(data) {
  const { name, businessName, email, phone, password } = data

  if (!name || !businessName || !email || !phone || !password) {
    throw new Error("Todos os campos são obrigatórios")
  }

  const professionalExists = await Professional.findOne({ email })

  if (professionalExists) {
    throw new Error("Este e-mail já está em uso")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const professional = await Professional.create({
    name,
    businessName,
    email,
    phone,
    password: hashedPassword,
  })

  return {
    _id: professional._id,
    name: professional.name,
    businessName: professional.businessName,
    email: professional.email,
    phone: professional.phone,
    createdAt: professional.createdAt,
    updatedAt: professional.updatedAt,
  }
}

// Login do Profissional
export async function loginProfessionalService(data) {
  const { email, password } = data

  if (!email || !password) {
    throw new Error("Email e senha são obrigatórios")
  }

  const professional = await Professional.findOne({ email })

  if (!professional) {
    throw new Error("Credenciais inválidas")
  }

  const isPasswordValid = await bcrypt.compare(password, professional.password)

  if (!isPasswordValid) {
    throw new Error("Credenciais inválidas")
  }

  const token = generateToken(professional._id)

  return {
    token,
    professional: {
      _id: professional._id,
      name: professional.name,
      businessName: professional.businessName,
      email: professional.email,
      phone: professional.phone,
      createdAt: professional.createdAt,
      updatedAt: professional.updatedAt,
    },
  }
}
