/** @format */

import { matchedData } from 'express-validator';
import urlSlug from 'url-slug';
import CategoryService from '../services/category.serivce.js';
import StorageService from '../services/storage.service.js';
import DbErrorHandler from '../utilities/db-error.handler.js';
import HttpResponse from '../utilities/http.response.js';

export default class CategoryController {
	async getAllCategories(_req, res) {
		try {
			const result = await CategoryService.getAll();
			return HttpResponse.success(
				res,
				200,
				result,
				'Categories retrieved successfully',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async getCategoryById(req, res) {
		try {
			const { id } = req.params;
			const result = await CategoryService.getById(id);
			if (!result) {
				return HttpResponse.failure(
					res,
					404,
					'CategoryNotFound',
					'Category not found',
				);
			}
			return HttpResponse.success(
				res,
				200,
				result,
				'Category retrieved successfully',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async createCategory(req, res) {
		try {
			req = matchedData(req);
			const { name, image } = req;
			const slug = urlSlug(name);
			const result = await CategoryService.create({
				name,
				image,
				slug,
			});
			if (!result.created) {
				return HttpResponse.failure(
					res,
					DbErrorHandler.getErrorStatusCode(result.error),
					'CategoryNotCreated',
					DbErrorHandler.getErrorMessage(result.error),
				);
			}
			const [category] = await CategoryService.getData(
				result.category._id,
			);
			return HttpResponse.success(
				res,
				201,
				category,
				'Category created successfully',
			);
		} catch (error) {
			console.log(error);
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async updateCategory(req, res) {
		try {
			req = matchedData(req);
			const { id, ...category } = req;
			if (category.name) {
				category.slug = urlSlug(category.name);
			}
			const result = await CategoryService.update(id, category);
			if (!result.updated) {
				return HttpResponse.failure(
					res,
					DbErrorHandler.getErrorStatusCode(result.error),
					'CategoryNotUpdated',
					DbErrorHandler.getErrorMessage(result.error),
				);
			}
			const [updatedCategory] = await CategoryService.getData(
				result.category._id,
			);
			return HttpResponse.success(
				res,
				200,
				updatedCategory,
				'Category updated successfully',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async deleteCategory(req, res) {
		try {
			req = matchedData(req);
			const { id } = req;
			const category = await CategoryService.getById(id);
			if (category && category.courses > 0) {
				return HttpResponse.failure(
					res,
					400,
					'CategoryNotDeleted',
					'Category has courses',
				);
			}
			const result = await CategoryService.delete(category._id);
			if (!result) {
				return HttpResponse.failure(
					res,
					404,
					'CategoryNotDeleted',
					'Category not found',
				);
			}
			await StorageService.delete(result.image._id);
			return HttpResponse.success(
				res,
				200,
				result._id,
				'Category deleted successfully',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}
}
