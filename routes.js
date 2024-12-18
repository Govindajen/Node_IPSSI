const express = require("express");
const router = express.Router();
const authMiddleware = require("./Middleware/authMiddleware");
const { registerUser, response, deleteUser, login, getUsers, updateUser} = require("./controllers/userControllers");
const {
    createRecipe,
    getRecipes,
    updateRecipe,
    getRecipeByUserId,
    deleteRecipe
} = require("./controllers/recipeControllers");

router.get("/users", authMiddleware, getUsers);
router.post("/user", registerUser);
router.delete("/user", authMiddleware, deleteUser);
router.put("/user/:id", authMiddleware, updateUser);
router.post("/login", login);

router.post("/recipe", authMiddleware, createRecipe);
router.get("/recipes", authMiddleware, getRecipes);
router.put("/recipe/:recipeId", authMiddleware, updateRecipe);
router.get("/recipe/:userId", authMiddleware, getRecipeByUserId);
router.delete("/recipe/:recipeId", authMiddleware, deleteRecipe);

router.get("/", response);



module.exports = router;