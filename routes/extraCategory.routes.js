const express = require('express');
const { extraCategoryPage, extraCategory, deleteExtraCategory, editExtraCategory, viewExtraCategory, updateExtraCategory, getAllExtraCategory, postEditProduct } = require('../controller/extraCategory.controller');

const etcCategoryRoutes = express.Router();

etcCategoryRoutes.get("/add-extraCategory", extraCategoryPage);
etcCategoryRoutes.post("/add-extraCategory", extraCategory);
etcCategoryRoutes.get("/view-extraCategory", viewExtraCategory);
etcCategoryRoutes.get("/delete-extraCategory/:id", deleteExtraCategory);
etcCategoryRoutes.get("/edit-extraCategory/:id", editExtraCategory);
etcCategoryRoutes.post("/update-extraCategory/:id", updateExtraCategory);
etcCategoryRoutes.get("/getAllExtraCategory", getAllExtraCategory)

module.exports = etcCategoryRoutes;