import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../helpers/ctrlwrapper.js";

const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.json(contacts);
};

const getOneContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);

  if (!contact) {
    throw HttpError(404);
  }

  res.json(contact);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.removeContact(contactId);

  if (!contact) {
    throw HttpError(404);
  }

  res.json(contact);
};

const createContact = async (req, res) => {
  const contact = await contactsService.addContact(req.body);
  res.status(201).json(contact);
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.updateContact(contactId, req.body);

  if (!contact) {
    throw HttpError(404);
  }

  res.json(contact);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
};
