import { Appointment } from "./appointment.model.js";
import Service from "../services/service.model.js";

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

  const service = await Service.findById(serviceId);

  if (!service) {
    throw new Error("Serviço não encontrado.");
  }

  if (service.professionalId.toString() !== professionalId) {
    throw new Error("Acesso negado.");
  }

  const existingAppointment = await Appointment.findOne({
    professionalId,
    date: parsedDate,
    status: { $in: ["confirmed"] },
  });

  if (existingAppointment) {
    throw new Error("Já existe um agendamento nesse horário.");
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
// GET /appointments, 
// GET /appointments?date=2026-03-30,GET 
// /appointments?status=confirmed
// GET /appointments?date=2026-03-30&status=confirmed
export const getAppointmentsService = async ({ professionalId, date, status }) => {
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

  const appointments = await Appointment.find(filter).sort({ date: 1 });

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
    confirmed: appointments.filter((appointment) => appointment.status === "confirmed"),
    completed: appointments.filter((appointment) => appointment.status === "completed"),
    cancelled: appointments.filter((appointment) => appointment.status === "cancelled"),
    "no-show": appointments.filter((appointment) => appointment.status === "no-show"),
  };
};
