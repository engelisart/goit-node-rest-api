import { Schema, model } from "mongoose";
import { haveSaveError, setUpdateSettings } from "./hooks.js";

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { versionKey: false, timestamps: true }
);

contactsSchema.post("save", haveSaveError);

contactsSchema.pre("findOneAndUpdate", setUpdateSettings);

contactsSchema.post("findOneAndUpdate", haveSaveError);

const Contact = model("contact", contactsSchema);

export default Contact;
