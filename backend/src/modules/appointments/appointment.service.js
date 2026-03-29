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


// Mostrar agendamentos do proficional especifico
export const getAppointmentsService = async ({ professionalId, date }) => {
  const filter = { professionalId };

  if (date) {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    filter.date = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
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
