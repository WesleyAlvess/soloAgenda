import { updateWorkingHoursService } from "./professional.service.js";

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
