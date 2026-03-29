import { createAppointmentService, getAppointmentsService, updateAppointmentStatusService } from "./appointment.service.js";

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

// Mostrar agendamento do profissional especifico
export const getAppointmentsController = async (req, res) => {
  try {
    const { date } = req.query;

    const appointments = await getAppointmentsService({
      professionalId: req.userId,
      date,
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
