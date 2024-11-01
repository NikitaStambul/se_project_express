const { statusCodes } = require("../utils/constants");
const Item = require("../models/cothingItem");

const getItems = (_req, res) => {
  Item.find({})
    .populate("owner")
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
        res.status(statusCodes.NOT_FOUND).send({ message: error.message });
      } else if (error.name === "CastError") {
        res.status(statusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(statusCodes.OK).send({ message: error.message });
      }

      res.status(statusCodes.OK).send({ message: error.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const { user } = req;

  Item.create({ name, weather, imageUrl, owner: user._id })
    .then((item) => {
      res.status(statusCodes.CREATED).send(item);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(statusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(statusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: error.message });
      }
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        res.status(404).send({ message: "Item not found" });
      } else {
        res.status(200).send({ message: "Item deleted", item });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({ message: "Invalid item ID" });
      } else {
        res.status(500).send({ message: "Error deleting item" });
      }
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const { user } = req;

  Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: user._id } },
    { new: true }
  )
    .orFail()
    .then(() => res.status(statusCodes.OK).send({ message: "liked" }))
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        res.status(statusCodes.NOT_FOUND).send({ message: error.message });
      } else if (error.name === "CastError") {
        res.status(statusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(statusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: error.message });
      }
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const { user } = req;

  Item.findByIdAndUpdate(itemId, { $pull: { likes: user._id } }, { new: true })
    .orFail()
    .then(() => res.status(statusCodes.OK).send({ message: "unliked" }))
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        res.status(statusCodes.NOT_FOUND).send({ message: error.message });
      } else if (error.name === "CastError") {
        res.status(statusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(statusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: error.message });
      }
    });
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
