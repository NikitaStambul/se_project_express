const { statusCodes } = require("../utils/constants");
const Item = require("../models/cothingItem");

const getItems = (_req, res) => {
  Item.find({})
    .populate("owner")
    .then((items) => {
      res.send(items);
    })
    .catch(() => {
      res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getItemById = (req, res) => {
  const { itemId } = req.params;

  Item.findById(itemId)
    .orFail()
    .then((item) => {
      res.send(item);
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        res.status(statusCodes.NOT_FOUND).send({ message: error.message });
      } else if (error.name === "CastError") {
        res.status(statusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(statusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
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
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        res.status(statusCodes.NOT_FOUND).send({ message: "Item not found" });
      } else if (item.owner.toString() !== req.user._id.toString()) {
        res
          .status(statusCodes.FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" });
      } else {
        Item.findByIdAndDelete(itemId)
          .then(() => {
            res.send({ message: "Item deleted", item });
          })
          .catch(() => {
            res
              .status(statusCodes.INTERNAL_SERVER_ERROR)
              .send({ message: "An error has occurred on the server" });
          });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res
          .status(statusCodes.BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      } else {
        res
          .status(statusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
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
    .then(() => res.send({ message: "liked" }))
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        res.status(statusCodes.NOT_FOUND).send({ message: error.message });
      } else if (error.name === "CastError") {
        res.status(statusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(statusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const { user } = req;

  Item.findByIdAndUpdate(itemId, { $pull: { likes: user._id } }, { new: true })
    .orFail()
    .then(() => res.send({ message: "unliked" }))
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        res.status(statusCodes.NOT_FOUND).send({ message: error.message });
      } else if (error.name === "CastError") {
        res.status(statusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(statusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
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
