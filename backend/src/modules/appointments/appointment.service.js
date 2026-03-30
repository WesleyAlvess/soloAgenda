import { Appointment } from "./appointment.model.js";
import Service from "../services/service.model.js";
import Professional from "../professionals/professional.model.js";
import { toZonedTime } from "date-fns-tz";

// Criar Agendamento
export const createAppointmentService = async ({
  professionalId,
  serviceId,
  clientName,
  clientPhone,
  date,
}) => {
  if (!serviceId || !clientName || !clientPhone || !date) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    throw new Error("Data inválida.");
  }

  if (parsedDate < new Date()) {
    throw new Error("Não é possível criar agendamento em data passada.");
  }

  const service = await Service.findById(serviceId);

  if (!service) {
    throw new Error("Serviço não encontrado.");
  }

  if (service.professionalId.toString() !== professionalId) {
    throw new Error("Acesso negado.");
  }

  const start = parsedDate;

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + service.durationInMinutes);

  const timeZone = "America/Sao_Paulo";

  const zonedStart = toZonedTime(start, timeZone);
  const zonedEnd = toZonedTime(end, timeZone);

  const professional = await Professional.findById(professionalId);

  if (!professional) {
    throw new Error("Profissional não encontrado.");
  }

  const [startHour, startMinute] = professional.workingHours.start
    .split(":")
    .map(Number);

  const [endHour, endMinute] = professional.workingHours.end
    .split(":")
    .map(Number);

  const startLimit = new Date(zonedStart);
  startLimit.setHours(startHour, startMinute, 0, 0);

  const endLimit = new Date(zonedStart);
  endLimit.setHours(endHour, endMinute, 0, 0);

  if (zonedStart < startLimit || zonedEnd > endLimit) {
    throw new Error("Fora do horário de atendimento.");
  }

  const startOfDay = new Date(start);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(start);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAppointments = await Appointment.find({
    professionalId,
    status: "confirmed",
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).populate("serviceId", "durationInMinutes");

  for (const appointment of existingAppointments) {
    const existingStart = new Date(appointment.date);

    const existingEnd = new Date(existingStart);
    existingEnd.setMinutes(
      existingEnd.getMinutes() + appointment.serviceId.durationInMinutes
    );

    const hasConflict = start < existingEnd && end > existingStart;

    if (hasConflict) {
      throw new Error("Já existe um agendamento nesse intervalo.");
    }
  }

  const appointment = await Appointment.create({
    professionalId,
    serviceId,
    clientName,
    clientPhone,
    date: parsedDate,
  });

  return appointment;
};

// Filtro por data, status e listagem total de agendamentos
// GET /appointments
// GET /appointments?date=2026-03-30
// GET /appointments?status=confirmed
// GET /appointments?date=2026-03-30&status=confirmed
export const getAppointmentsService = async ({
  professionalId,
  date,
  status,
}) => {
  const filter = { professionalId };

  if (date) {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    filter.date = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  if (status) {
    filter.status = status;
  }

  const appointments = await Appointment.find(filter)
    .populate("serviceId", "name price durationInMinutes")
    .sort({ date: 1 });

  return appointments;
};

// Atualizar o status do agendamento
export const updateAppointmentStatusService = async ({
  appointmentId,
  professionalId,
  status,
}) => {
  if (!appointmentId || !status) {
    throw new Error("ID do agendamento e status são obrigatórios.");
  }

  const allowedStatus = ["confirmed", "cancelled", "completed", "no-show"];

  if (!allowedStatus.includes(status)) {
    throw new Error("Status inválido.");
  }

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new Error("Agendamento não encontrado.");
  }

  if (appointment.professionalId.toString() !== professionalId) {
    throw new Error("Acesso negado.");
  }

  appointment.status = status;

  await appointment.save();

  return appointment;
};

// Agendamentos do dia
export const getDailyAgendaService = async ({ professionalId, date }) => {
  if (!date) {
    throw new Error("A data é obrigatória.");
  }

  const startOfDay = new Date(`${date}T00:00:00.000Z`);
  const endOfDay = new Date(`${date}T23:59:59.999Z`);

  const appointments = await Appointment.find({
    professionalId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).sort({ date: 1 });

  return {
    confirmed: appointments.filter(
      (appointment) => appointment.status === "confirmed"
    ),
    completed: appointments.filter(
      (appointment) => appointment.status === "completed"
    ),
    cancelled: appointments.filter(
      (appointment) => appointment.status === "cancelled"
    ),
    "no-show": appointments.filter(
      (appointment) => appointment.status === "no-show"
    ),
  };
};
