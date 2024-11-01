const express = require("express");
const { getItems, getItemById, createItem, deleteItem } = require("../controllers/items");

const router = express.Router();

router.get("/", getItems);
router.get("/:itemId", getItemById);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
