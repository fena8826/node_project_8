const express = require("express");
const { addCategoryPage, addNewCategory, viewCategoryPage, deleteCategory, editCategoryPage, updateCategory } = require("../controller/category.controller");
const upload = require("../middleware/uploadImage");

const categoryRoutes = express.Router();

categoryRoutes.get("/add-category", addCategoryPage);
categoryRoutes.get("/view-categories", viewCategoryPage);
categoryRoutes.get("/delete-category/:id", deleteCategory);
categoryRoutes.get("/edit-category/:id", editCategoryPage);
categoryRoutes.post("/update-category/:id",upload.single('categoryImage'), updateCategory);
categoryRoutes.post("/add-category",upload.single('categoryImage'), addNewCategory)
module.exports = categoryRoutes;