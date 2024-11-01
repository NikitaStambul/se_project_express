const { statusCodes } = require("../utils/constants");
const Item = require("../models/cothingItem");

const getItems = (_req, res) => {
  Item.find({})
    .then((items) => {
      res.status(statusCodes.OK).send(items);
    })
    .catch(() => {
      res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: "Error retrieving items" });
    });
};

const getItemById = (req, res) => {
  const { itemId } = req.params;

  Item.findById(itemId)
    .orFail()
    .then((item) => {
      res.status(statusCodes.OK).send(item);
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(statusCodes.BAD_REQUEST)
          .send({ message: error.message });
      }

      return res.status(statusCodes.OK).send({ message: error.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;

  Item.create({ name, weather, imageURL })
    .then((item) => {
      res.status(statusCodes.CREATED).send(item);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res
          .status(statusCodes.BAD_REQUEST)
          .send({ message: error.message });
      }
      return res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: error.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send({ message: "Item deleted", item });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res.status(500).send({ message: "Error deleting item" });
    });
};

module.exports = { getItems, getItemById, createItem, deleteItem };
