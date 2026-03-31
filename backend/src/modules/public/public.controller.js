import { getPublicProfessionalBySlug, getPublicServicesBySlug } from "./public.service.js";

export const getPublicProfessional = async (req, res) => {
  try {
    const { slug } = req.params;

    const data = await getPublicProfessionalBySlug(slug);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};


// Buscar Serviço Público do Profissional
export const getPublicServices = async (req, res) => {
  try {
    const { slug } = req.params;

    const services = await getPublicServicesBySlug(slug);

    return res.status(200).json({
      services,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
