const express = require("express");
const router = express.Router();
const authMiddleware = require("./Middleware/authMiddleware");
const { registerUser, response, deleteUser, login, getUsers, updateUser} = require("./controllers/userControllers");

router.get("/users", authMiddleware, getUsers);
router.post("/user", registerUser);
router.delete("/user", authMiddleware, deleteUser);
router.put("/user/:id", authMiddleware, updateUser);
router.post("/login", login);
router.get("/", response);



module.exports = router;