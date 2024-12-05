import Lookup from "../services/lookup.service.js";

export const retrieveLookupList = async (req, res, next) => {
  try {
    const data = await Lookup.retrieveLookupList();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};
