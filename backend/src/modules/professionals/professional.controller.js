import { updateWorkingHoursService, updatePublicProfileService } from "./professional.service.js";

export const updateWorkingHoursController = async (req, res) => {
  try {
    const professionalId = req.userId;
    const { start, end } = req.body;

    const professional = await updateWorkingHoursService({
      professionalId,
      start,
      end,
    });

    const { password, ...professionalData } = professional.toObject();

    return res.status(200).json(professionalData);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// Atualizar Perfil Público
export const updatePublicProfileController = async (req, res) => {
  try {
    const professionalId = req.userId;
    const { publicName, slug, isPublic } = req.body;

    const data = await updatePublicProfileService({
      professionalId,
      publicName,
      slug,
      isPublic,
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
