import { createServiceService, updateServiceService, deleteServiceService } from "./service.service.js"

// Criar Serviço
export async function createServiceController(req, res) {
  try {
    const service = await createServiceService(req.body, req.userId)

    return res.status(201).json({
      message: "Serviço criado com sucesso",
      service,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

// Atualizar Serviço
export async function updateServiceController(req, res) {
  try {
    const service = await updateServiceService(
      req.body,
      req.params.id,
      req.userId
    )

    return res.status(200).json({
      message: "Serviço atualizado com sucesso",
      service,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

// Deletar servico
export async function deleteServiceController(req, res) {
  try {
    await deleteServiceService(req.params.id, req.userId)

    return res.status(200).json({
      message: "Serviço deletado com sucesso",
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}
