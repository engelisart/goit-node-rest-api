import Contact from "../models/Contact.js";

export async function listContacts() {
  return Contact.find();
}

export async function getContactsByFilter(filter, query) {
  return Contact.find(filter, null, query);
}

export async function getContactsCountByFilter(filter) {
  return Contact.countDocuments(filter);
}

export async function getContactById(contactId) {
  return Contact.findById(contactId);
}

export async function getContactByIdFilte(filter) {
  return Contact.findOne(filter);
}

export async function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

export async function removeContactByFilter(filter) {
  return Contact.findOneAndDelete(filter);
}

export async function addContact(data) {
  return Contact.create(data);
}

export async function updateContact(contactId, data) {
  return Contact.findByIdAndUpdate(contactId, data);
}

export async function updateContactByFilter(filter, data) {
  return Contact.findOneAndUpdate(filter, data);
}

export async function updateStatusContact(contactId, data) {
  return Contact.findByIdAndUpdate(contactId, data);
}

export async function updateStatusContactByFilter(filter, data) {
  return Contact.findOneAndUpdate(filter, data);
}
