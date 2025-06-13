import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse, HttpStatusCode } from '../types';

/**
 * Sanitize input to prevent XSS attacks
 */
const sanitizeInput = (obj: any): any => {
	if (typeof obj === 'string') {
		// Remove potentially dangerous HTML tags and scripts
		return obj
			.replace(
				/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
				''
			)
			.replace(
				/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
				''
			)
			.replace(/javascript:/gi, '')
			.replace(/on\w+\s*=/gi, '')
			.trim();
	}

	if (Array.isArray(obj)) {
		return obj.map(sanitizeInput);
	}

	if (obj && typeof obj === 'object') {
		const sanitized: any = {};
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				sanitized[key] = sanitizeInput(obj[key]);
			}
		}
		return sanitized;
	}

	return obj;
};

/**
 * Input sanitization middleware
 */
export const sanitizeInputs = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (req.body) {
		req.body = sanitizeInput(req.body);
	}

	if (req.query) {
		req.query = sanitizeInput(req.query);
	}

	if (req.params) {
		req.params = sanitizeInput(req.params);
	}

	next();
};

/**
 * Generic validation middleware factory
 */
export const validate = (schema: Joi.ObjectSchema) => {
	return (
		req: Request,
		res: Response<ApiResponse>,
		next: NextFunction
	): void => {
		const { error } = schema.validate(req.body, {
			abortEarly: false, // Return all validation errors
			stripUnknown: true, // Remove unknown fields
		});

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
		const { error } = schema.validate(req.params, {
			abortEarly: false,
			stripUnknown: true,
		});

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
		const { error } = schema.validate(req.query, {
			abortEarly: false,
			stripUnknown: true,
		});

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
		page: Joi.number()
			.integer()
			.min(1)
			.max(1000)
			.optional(),
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
		tags: Joi.string().max(500).optional(), // Comma-separated tags
	}),
};
