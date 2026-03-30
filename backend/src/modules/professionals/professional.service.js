import Professional from "./professional.model.js";

export const updateWorkingHoursService = async ({
  professionalId,
  start,
  end,
}) => {
  // valida campos
  if (!start || !end) {
    throw new Error("Horário inicial e final são obrigatórios.");
  }

  // valida formato
  if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) {
    throw new Error("Formato de horário inválido. Use HH:mm");
  }

  // valida formato
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  // valida se hora/minuto existem de verdade
  if (
    startHour < 0 || startHour > 23 ||
    endHour < 0 || endHour > 23 ||
    startMinute < 0 || startMinute > 59 ||
    endMinute < 0 || endMinute > 59
  ) {
    throw new Error("Horário inválido.");
  }

  const startInMinutes = startHour * 60 + startMinute;
  const endInMinutes = endHour * 60 + endMinute;

  if (startInMinutes >= endInMinutes) {
    throw new Error("O horário inicial deve ser menor que o horário final.");
  }

  //busca profissional
  const professional = await Professional.findById(professionalId);

  if (!professional) {
    throw new Error("Profissional não encontrado.");
  }

  // atualiza e salva
  professional.workingHours = { start, end };

  await professional.save();

  return professional;
};
