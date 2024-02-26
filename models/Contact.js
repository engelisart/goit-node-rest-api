import { Schema, model } from "mongoose";
import { haveSaveError, setUpdateSettings } from "./hooks.js";

const contactsShema = new Schema(
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
  },
  { versionKey: false, timestamps: true }
);

contactsShema.post("save", haveSaveError);

contactsShema.pre("findOneAndUpdate", setUpdateSettings);

contactsShema.post("findOneAndUpdate", haveSaveError);

const Contact = model("contact", contactsShema);

export default Contact;
