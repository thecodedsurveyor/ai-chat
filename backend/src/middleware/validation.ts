import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse, HttpStatusCode } from '../types';

/**
 * Generic validation middleware factory
 */
export const validate = (schema: Joi.ObjectSchema) => {
	return (
		req: Request,
		res: Response<ApiResponse>,
		next: NextFunction
	): void => {
		const { error } = schema.validate(req.body);

		if (error) {
			const errorMessage = error.details
				.map((detail) => detail.message)
				.join(', ');
			res.status(HttpStatusCode.BAD_REQUEST).json({
				success: false,
				message: 'Validation failed',
				error: errorMessage,
			});
			return;
		}

		next();
	};
};

/**
 * Validate request parameters (like user ID in URL)
 */
export const validateParams = (
	schema: Joi.ObjectSchema
) => {
	return (
		req: Request,
		res: Response<ApiResponse>,
		next: NextFunction
	): void => {
		const { error } = schema.validate(req.params);

		if (error) {
			const errorMessage = error.details
				.map((detail) => detail.message)
				.join(', ');
			res.status(HttpStatusCode.BAD_REQUEST).json({
				success: false,
				message: 'Invalid parameters',
				error: errorMessage,
			});
			return;
		}

		next();
	};
};

/**
 * Validate query parameters
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
	return (
		req: Request,
		res: Response<ApiResponse>,
		next: NextFunction
	): void => {
		const { error } = schema.validate(req.query);

		if (error) {
			const errorMessage = error.details
				.map((detail) => detail.message)
				.join(', ');
			res.status(HttpStatusCode.BAD_REQUEST).json({
				success: false,
				message: 'Invalid query parameters',
				error: errorMessage,
			});
			return;
		}

		next();
	};
};

/**
 * Common parameter validation schemas
 */
export const paramSchemas = {
	objectId: Joi.object({
		id: Joi.string()
			.pattern(/^[0-9a-fA-F]{24}$/)
			.required()
			.messages({
				'string.pattern.base': 'Invalid ID format',
				'any.required': 'ID is required',
			}),
	}),

	chatId: Joi.object({
		chatId: Joi.string()
			.pattern(/^[0-9a-fA-F]{24}$/)
			.required()
			.messages({
				'string.pattern.base':
					'Invalid chat ID format',
				'any.required': 'Chat ID is required',
			}),
	}),
};

/**
 * Common query validation schemas
 */
export const querySchemas = {
	pagination: Joi.object({
		page: Joi.number().integer().min(1).optional(),
		limit: Joi.number()
			.integer()
			.min(1)
			.max(100)
			.optional(),
		sort: Joi.string()
			.valid('createdAt', 'updatedAt', 'displayId')
			.optional(),
		order: Joi.string().valid('asc', 'desc').optional(),
	}),

	search: Joi.object({
		q: Joi.string().min(1).max(100).optional(),
		category: Joi.string()
			.valid(
				'general',
				'work',
				'personal',
				'research'
			)
			.optional(),
		tags: Joi.string().optional(), // Comma-separated tags
	}),
};
