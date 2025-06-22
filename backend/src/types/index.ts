import { Request } from 'express';

// User related types
export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	isVerified: boolean;
	avatar?: string;
	preferences?: Record<string, unknown>;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateUserData {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface UpdateUserData {
	firstName?: string;
	lastName?: string;
	avatar?: string;
	preferences?: Record<string, unknown>;
}

// JWT related types
export interface JWTPayload {
	userId: string;
	email: string;
	iat?: number;
	exp?: number;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

// Session related types
export interface Session {
	id: string;
	userId: string;
	token: string;
	expiresAt: Date;
	userAgent?: string;
	ipAddress?: string;
	createdAt: Date;
}

// Chat related types
export interface Message {
	id: string;
	type: 'prompt' | 'response';
	text: string;
	timestamp: string;
	status?: 'sending' | 'sent' | 'delivered' | 'error';
	responseTime?: number;
	wordCount?: number;
	isFavorite?: boolean;
}

export interface Chat {
	id: string;
	userId: string;
	displayId: string;
	messages: Message[];
	category?: string;
	tags: string[];
	isPinned: boolean;
	isFavorite: boolean;
	isArchived: boolean;
	totalMessages: number;
	averageResponseTime?: number;
	createdAt: Date;
	updatedAt: Date;
	lastActivity?: Date;
}

export interface CreateChatData {
	displayId: string;
	category?: string;
	tags?: string[];
}

export interface UpdateChatData {
	displayId?: string;
	category?: string;
	tags?: string[];
	isPinned?: boolean;
	isFavorite?: boolean;
	isArchived?: boolean;
}

export interface AddMessageData {
	type: 'prompt' | 'response';
	text: string;
	responseTime?: number;
}

// Request types with authenticated user
export interface AuthenticatedRequest extends Request {
	user?: JWTPayload;
}

// API Response types
export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
}

export interface PaginatedResponse<T>
	extends ApiResponse<T[]> {
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

// Validation error types
export interface ValidationError {
	field: string;
	message: string;
}

// Analytics types
export interface ChatAnalytics {
	id: string;
	userId: string;
	date: Date;
	totalChats: number;
	totalMessages: number;
	totalWords: number;
	averageResponseTime?: number;
	topCategories: Array<{
		category: string;
		count: number;
	}>;
	topTags: Array<{ tag: string; count: number }>;
	createdAt: Date;
}

// Rate limiting types
export interface RateLimitInfo {
	windowMs: number;
	max: number;
	message: string;
}

// Environment types
export interface DatabaseConfig {
	url: string;
}

export interface JWTConfig {
	secret: string;
	refreshSecret: string;
	expiresIn: string;
	refreshExpiresIn: string;
}

export interface ServerConfig {
	port: number;
	nodeEnv: string;
	frontendUrl: string;
}

// Error types
export class AppError extends Error {
	public statusCode: number;
	public isOperational: boolean;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

// HTTP Status codes
export enum HttpStatusCode {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	CONFLICT = 409,
	UNPROCESSABLE_ENTITY = 422,
	TOO_MANY_REQUESTS = 429,
	INTERNAL_SERVER_ERROR = 500,
}
