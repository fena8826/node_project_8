const express = require('express');
const { addSubCategoryPage, addSubCategory, viewSubCategory, deleteSubCategory, editSubCategoryPage, updateSubCategory, getAllSubCategoies } = require('../controller/subcategory.controller');


const subcategoryRoutes = express.Router();

subcategoryRoutes.get("/add-subCategory", addSubCategoryPage);
subcategoryRoutes.post("/add-subCategory", addSubCategory);
subcategoryRoutes.get("/view-subCategory", viewSubCategory);
subcategoryRoutes.get("/delete-subcategory/:id", deleteSubCategory);
subcategoryRoutes.get("/edit-subcategory/:id", editSubCategoryPage);
subcategoryRoutes.post("/update-subcategory/:id", updateSubCategory);
subcategoryRoutes.get("/getAllSubCategory", getAllSubCategoies)


module.exports = subcategoryRoutes;