import { createAppointmentService, getAppointmentsService, updateAppointmentStatusService, getDailyAgendaService } from "./appointment.service.js";

// Criar um agendamento 
export const createAppointmentController = async (req, res) => {
  try {
    const { serviceId, clientName, clientPhone, date } = req.body;

    const appointment = await createAppointmentService({
      professionalId: req.userId,
      serviceId,
      clientName,
      clientPhone,
      date,
    });

    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Filtro por data, status e listagem total de agendamentos
export const getAppointmentsController = async (req, res) => {
  try {
    const { date, status } = req.query;

    const appointments = await getAppointmentsService({
      professionalId: req.userId,
      date,
      status,
    });

    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// Atualiza Status do agendamento
export const updateAppointmentStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAppointment = await updateAppointmentStatusService({
      appointmentId: id,
      professionalId: req.userId,
      status,
    });

    return res.status(200).json(updatedAppointment);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// Agendamentos do dia 
export const getDailyAgendaController = async (req, res) => {
  try {
    const { date } = req.query;

    const dailyAgenda = await getDailyAgendaService({
      professionalId: req.userId,
      date,
    });

    return res.status(200).json(dailyAgenda);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
