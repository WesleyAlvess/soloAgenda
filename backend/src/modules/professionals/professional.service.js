import Professional from "./professional.model.js";

// Atualizar Jornada de trabalho
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



// Atualizar Perfil Público
export const updatePublicProfileService = async ({
  professionalId,
  publicName,
  slug,
  isPublic,
}) => {
  const professional = await Professional.findById(professionalId);

  if (!professional) {
    throw new Error("Profissional não encontrado.");
  }

  // Atualiza nome público
  if (publicName !== undefined) {
    if (!publicName.trim()) {
      throw new Error("O nome público não pode ser vazio.");
    }

    professional.publicName = publicName.trim();
  }

  // Atualiza slug (se enviado)
  if (slug !== undefined) {
    const formattedSlug = slug
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");


    if (!formattedSlug) {
      throw new Error("Link público inválido.");
    }

    // verifica duplicidade
    const slugExists = await Professional.findOne({
      slug: formattedSlug,
      _id: { $ne: professionalId },
    });

    if (slugExists) {
      throw new Error("Este link já está em uso.");
    }

    professional.slug = formattedSlug;
  }

  // Ativar/desativar perfil público
  if (isPublic !== undefined) {
    if (typeof isPublic !== "boolean") {
      throw new Error("O campo isPublic deve ser true ou false.");
    }

    if (isPublic === true && !professional.slug) {
      throw new Error("Defina um link (slug) antes de ativar o perfil público.");
    }

    professional.isPublic = isPublic;
  }

  await professional.save();

  return {
    publicName: professional.publicName || null,
    slug: professional.slug,
    isPublic: professional.isPublic,
  };
};
