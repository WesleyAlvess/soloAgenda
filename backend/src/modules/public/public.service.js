import Professional from "../professionals/professional.model.js";
import Service from "../services/service.model.js";

// Buscar Porfissional pelo Slug
export const getPublicProfessionalBySlug = async (slug) => {
  const professional = await Professional.findOne({
    slug,
    isPublic: true,
  }).select("publicName businessName slug workingHours");

  if (!professional) {
    throw new Error("Profissional não encontrado ou não está público");
  }

  return {
    name: professional.publicName || professional.businessName,
    slug: professional.slug,
    workingHours: professional.workingHours,
  };
};


// Buscar Serviço Público do Profissional
export const getPublicServicesBySlug = async (slug) => {
  const professional = await Professional.findOne({
    slug,
    isPublic: true,
  });

  if (!professional) {
    throw new Error("Profissional não encontrado ou não está público");
  }

  const services = await Service.find({
    professionalId: professional._id,
    isActive: true,
  }).select("name price durationInMinutes description");

  return services;
};
