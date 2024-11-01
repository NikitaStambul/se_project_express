const express = require("express");
const {
  getItems,
  getItemById,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/items");

const router = express.Router();

router.get("/", getItems);
router.get("/:itemId", getItemById);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
