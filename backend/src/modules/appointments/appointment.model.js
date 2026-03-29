import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed", "no-show"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
