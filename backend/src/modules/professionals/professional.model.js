import mongoose from "mongoose";

const workingHoursSchema = new mongoose.Schema(
  {
    start: {
      type: String,
      default: "08:00",
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    end: {
      type: String,
      default: "18:00",
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
  },
  { _id: false }
);

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

    publicName: {
      type: String,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },

    isPublic: {
      type: Boolean,
      default: false,
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
      type: workingHoursSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Professional", professionalSchema);
