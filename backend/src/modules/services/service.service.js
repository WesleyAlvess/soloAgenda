import Service from "./service.model.js"

// Criar Servico
export async function createServiceService(data, professionalId) {
  const { name, price, durationInMinutes, description } = data

  if (!name || !price || !durationInMinutes) {
    throw new Error("Nome, preço e duração são obrigatórios")
  }

  const service = await Service.create({
    professionalId,
    name,
    price,
    durationInMinutes,
    description,
  })

  return service
}

// Atualizar Serviço
export async function updateServiceService(data, id, professionalId) {
  const service = await Service.findOneAndUpdate(
    { _id: id, professionalId },
    data,
    { new: true }
  )

  if (!service) {
    throw new Error("Serviço não encontrado ou não autorizado")
  }

  return service
}

// Deleltar Servico
export async function deleteServiceService(id, professionalId) {
  const service = await Service.findOneAndDelete({
    _id: id,
    professionalId,
  })

  if (!service) {
    throw new Error("Serviço não encontrado ou não autorizado")
  }

  return service
}
