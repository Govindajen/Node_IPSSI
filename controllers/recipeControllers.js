const Recipe = require("../Models/recipeModel");

const createRecipe = async (req, res) => {

  const authorId = req.user.id;
  try {
    const recipe = new Recipe({
      ...req.body,
      author: authorId,
    });
    if (!recipe) {
      return res.status(400).send("Merci de remplir tous les champs");
    }
    await recipe.save();
    res.status(201).send({result: true, recipe});
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getRecipes = async (req, res) => {
  try {
    const filter = {};
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" };
    }
    if (req.query.cuisineType) {
      filter.cuisineType = { $regex: req.query.cuisineType, $options: "i" };
    }
    if (req.query.ingredients) {
      filter.ingredients = { $regex: req.query.ingredients, $options: "i" };
    }
    if (req.query.id) {
      filter._id = { $regex: req.query.id, $options: "i" };
    }


    const recipes = await Recipe.find(filter).populate(
      "author",
      "name email"
    );

    res.status(200).send(recipes);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.recipeId,
      req.body,
      {
        new: true,
      }
    );
    if (!recipe) {
      return res.status(404).send({ error: "Recette introuvable" });
    }
    res.status(200).send(recipe);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getRecipeByUserId = async (req, res) => {
  try {
    const recipe = await Recipe.find({ author: req.params.userId }).populate(
      "author",
      "username email"
    );
    if (!recipe) {
      return res.status(404).send({ error: "Recette introuvable" });
    }
    res.status(200).send(recipe);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.recipeId);
    if (!recipe) {
      return res.status(404).send({ error: "Recette introuvable" });
    }
    res.status(200).send({ message: "Recette supprimée" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  updateRecipe,
  getRecipeByUserId,
  deleteRecipe,
};
