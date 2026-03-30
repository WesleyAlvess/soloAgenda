import mongoose from "mongoose";

const professionalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    workingHours: {
      start: { type: String, default: "08:00" },
      end: { type: String, default: "18:00" }
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Professional", professionalSchema);
