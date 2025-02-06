import Lookup from "../services/lookup.service.js";

export const retrieveLookupList = async (req, res, next) => {
  try {
    const data = await Lookup.retrieveLookupList();
    res.status(200).send(data);
  } catch (error) {
    res.error(error);
  }
};

export const getLookupTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Lookup.getLookupTypeById(id);
    res.status(200).send(data);
  } catch (error) {
    res.error(error);
  }
};
