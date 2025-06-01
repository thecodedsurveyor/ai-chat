import Joi from 'joi';
import {
	CreateUserData,
	LoginCredentials,
	UpdateUserData,
	CreateChatData,
	UpdateChatData,
} from '../types';

export class ValidationUtils {
	/**
	 * User registration validation schema
	 */
	static readonly registerSchema =
		Joi.object<CreateUserData>({
			firstName: Joi.string()
				.min(2)
				.max(50)
				.required()
				.messages({
					'string.min':
						'First name must be at least 2 characters long',
					'string.max':
						'First name cannot exceed 50 characters',
					'any.required':
						'First name is required',
				}),
			lastName: Joi.string()
				.min(2)
				.max(50)
				.required()
				.messages({
					'string.min':
						'Last name must be at least 2 characters long',
					'string.max':
						'Last name cannot exceed 50 characters',
					'any.required': 'Last name is required',
				}),
			email: Joi.string()
				.email()
				.required()
				.messages({
					'string.email':
						'Please provide a valid email address',
					'any.required': 'Email is required',
				}),
			password: Joi.string()
				.min(8)
				.pattern(
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/
				)
				.required()
				.messages({
					'string.min':
						'Password must be at least 8 characters long',
					'string.pattern.base':
						'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
					'any.required': 'Password is required',
				}),
		});

	/**
	 * User login validation schema
	 */
	static readonly loginSchema =
		Joi.object<LoginCredentials>({
			email: Joi.string()
				.email()
				.required()
				.messages({
					'string.email':
						'Please provide a valid email address',
					'any.required': 'Email is required',
				}),
			password: Joi.string().required().messages({
				'any.required': 'Password is required',
			}),
		});

	/**
	 * User update validation schema
	 */
	static readonly updateUserSchema =
		Joi.object<UpdateUserData>({
			firstName: Joi.string()
				.min(2)
				.max(50)
				.optional(),
			lastName: Joi.string()
				.min(2)
				.max(50)
				.optional(),
			avatar: Joi.string().uri().optional(),
			preferences: Joi.object().optional(),
		});

	/**
	 * Chat creation validation schema
	 */
	static readonly createChatSchema =
		Joi.object<CreateChatData>({
			displayId: Joi.string()
				.min(1)
				.max(200)
				.required()
				.messages({
					'string.min':
						'Chat title cannot be empty',
					'string.max':
						'Chat title cannot exceed 200 characters',
					'any.required':
						'Chat title is required',
				}),
			category: Joi.string()
				.valid(
					'general',
					'work',
					'personal',
					'research'
				)
				.optional(),
			tags: Joi.array()
				.items(Joi.string().max(50))
				.max(10)
				.optional(),
		});

	/**
	 * Chat update validation schema
	 */
	static readonly updateChatSchema =
		Joi.object<UpdateChatData>({
			displayId: Joi.string()
				.min(1)
				.max(200)
				.optional(),
			category: Joi.string()
				.valid(
					'general',
					'work',
					'personal',
					'research'
				)
				.optional(),
			tags: Joi.array()
				.items(Joi.string().max(50))
				.max(10)
				.optional(),
			isPinned: Joi.boolean().optional(),
			isFavorite: Joi.boolean().optional(),
			isArchived: Joi.boolean().optional(),
		});

	/**
	 * Email validation
	 */
	static isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	/**
	 * MongoDB ObjectId validation
	 */
	static isValidObjectId(id: string): boolean {
		const objectIdRegex = /^[0-9a-fA-F]{24}$/;
		return objectIdRegex.test(id);
	}

	/**
	 * Sanitize string input
	 */
	static sanitizeString(input: string): string {
		return input.trim().replace(/[<>]/g, '');
	}

	/**
	 * Validate pagination parameters
	 */
	static validatePagination(
		page?: string,
		limit?: string
	): { page: number; limit: number } {
		const pageNum = Math.max(
			1,
			parseInt(page || '1', 10) || 1
		);
		const limitNum = Math.min(
			100,
			Math.max(1, parseInt(limit || '10', 10) || 10)
		);

		return { page: pageNum, limit: limitNum };
	}

	/**
	 * Password reset request validation schema
	 */
	static readonly requestPasswordResetSchema = Joi.object(
		{
			email: Joi.string()
				.email()
				.required()
				.messages({
					'string.email':
						'Please provide a valid email address',
					'any.required': 'Email is required',
				}),
		}
	);

	/**
	 * Password reset validation schema
	 */
	static readonly resetPasswordSchema = Joi.object({
		token: Joi.string()
			.min(32)
			.max(128)
			.required()
			.messages({
				'string.min': 'Invalid reset token',
				'string.max': 'Invalid reset token',
				'any.required': 'Reset token is required',
			}),
		email: Joi.string().email().required().messages({
			'string.email':
				'Please provide a valid email address',
			'any.required': 'Email is required',
		}),
		newPassword: Joi.string()
			.min(8)
			.pattern(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/
			)
			.required()
			.messages({
				'string.min':
					'Password must be at least 8 characters long',
				'string.pattern.base':
					'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
				'any.required': 'New password is required',
			}),
	});
}
