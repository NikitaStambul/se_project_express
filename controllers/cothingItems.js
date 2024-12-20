const { statusCodes } = require("../utils/constants");
const Item = require("../models/cothingItem");
const NotFoundError = require("../utils/errors/notFoundError")
const BadRequestError = require("../utils/errors/badRequestError")
const ForbiddenError = require("../utils/errors/forbiddenError")

const getItems = (_req, res, next) => {
  Item.find({})
    .then((items) => {
      res.send(items);
    })
    .catch(next);
};

const getItemById = (req, res, next) => {
  const { id } = req.params;

  Item.findById(id)
    .orFail()
    .then((item) => {
      res.send(item);
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError(`Item with id: ${id} not found`));
      } else if (error.name === "CastError") {
        next(new BadRequestError("Wrong item id format"));
      } else {
        next(error);
      }
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const { user } = req;

  Item.create({ name, weather, imageUrl, owner: { _id: user._id } })
    .then((item) => {
      res.status(statusCodes.CREATED).send(item);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Data is not valid"));
      } else {
        next(error);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { id } = req.params;

  Item.findById(id)
    .then((item) => {
      if (!item) {
        next(new NotFoundError(`Item with id: ${id} not found`));
      } else if (item.owner.toString() !== req.user._id.toString()) {
        next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      } else {
        Item.findByIdAndDelete(id)
          .then(() => {
            res.send({ message: "Item deleted", item });
          })
          .catch((error) => {
            next(error);
          });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Wrong item id format"));
      } else {
        next(error);
      }
    });
};

const likeItem = (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  Item.findByIdAndUpdate(
    id,
    { $addToSet: { likes: user._id } },
    { new: true }
  )
    .orFail()
    .then(() => res.send({ message: "liked" }))
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError(`Item with id: ${id} not found`));
      } else if (error.name === "CastError") {
        next(new BadRequestError("Wrong item id format"));
      } else {
        next(error);
      }
    });
};

const unlikeItem = (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  Item.findByIdAndUpdate(id, { $pull: { likes: user._id } }, { new: true })
    .orFail()
    .then(() => res.send({ message: "unliked" }))
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError(`Item with id: ${id} not found`));
      } else if (error.name === "CastError") {
        next(new BadRequestError("Wrong item id format"));
      } else {
        next(error);
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
