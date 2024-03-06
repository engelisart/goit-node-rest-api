import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlwrapper.js";

import fs from "fs/promises";
import path from "path";

const contactsDir = path.resolve("public", "avatars");

const getAllContacts = async (req, res) => {
  const { _id, owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await contactsService.getContactsByFilter(
    { owner },
    { limit, skip }
  );
  const total = await contactsService.getContactsCountByFilter({ owner });
  res.json({ contacts, total });
};

const getOneContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contact = await contactsService.getContactById({
    _id: contactId,
    owner,
  });

  if (!contact) {
    throw HttpError(404);
  }

  res.json(contact);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contact = await contactsService.removeContact({
    _id: contactId,
    owner,
  });

  if (!contact) {
    throw HttpError(404);
  }

  res.json(contact);
};

const createContact = async (req, res) => {
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(contactsDir, filename);
  await fs.rename(oldPath, newPath);
  const { _id: owner } = req.user;

  const avatarURL = path.join("avatars", filename);
  const contact = await contactsService.addContact({
    ...req.body,
    avatarURL,
    owner,
  });

  res.status(201).json(contact);
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contact = await contactsService.updateContact(
    { _id: contactId, owner },
    req.body
  );

  if (!contact) {
    throw HttpError(404);
  }

  res.json(contact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contact = await contactsService.updateStatusContact(
    { _id: contactId, owner },
    req.body
  );

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
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
