import jwt from 'jsonwebtoken';
import config from '../config/environment';
import { JWTPayload, AuthTokens } from '../types';

export class JWTUtils {
	/**
	 * Generate access token
	 */
	static generateAccessToken(
		payload: Omit<JWTPayload, 'iat' | 'exp'>
	): string {
		return jwt.sign(payload, config.JWT_SECRET, {
			expiresIn: '15m',
		});
	}

	/**
	 * Generate refresh token
	 */
	static generateRefreshToken(
		payload: Omit<JWTPayload, 'iat' | 'exp'>
	): string {
		return jwt.sign(
			payload,
			config.JWT_REFRESH_SECRET,
			{
				expiresIn: '7d',
			}
		);
	}

	/**
	 * Generate both access and refresh tokens
	 */
	static generateTokens(
		payload: Omit<JWTPayload, 'iat' | 'exp'>
	): AuthTokens {
		return {
			accessToken: this.generateAccessToken(payload),
			refreshToken:
				this.generateRefreshToken(payload),
		};
	}

	/**
	 * Verify access token
	 */
	static verifyAccessToken(token: string): JWTPayload {
		try {
			return jwt.verify(
				token,
				config.JWT_SECRET as string
			) as JWTPayload;
		} catch {
			throw new Error('Invalid access token');
		}
	}

	/**
	 * Verify refresh token
	 */
	static verifyRefreshToken(token: string): JWTPayload {
		try {
			return jwt.verify(
				token,
				config.JWT_REFRESH_SECRET as string
			) as JWTPayload;
		} catch {
			throw new Error('Invalid refresh token');
		}
	}

	/**
	 * Decode token without verification (for debugging)
	 */
	static decodeToken(token: string): JWTPayload | null {
		try {
			return jwt.decode(token) as JWTPayload;
		} catch {
			return null;
		}
	}

	/**
	 * Get token expiration date
	 */
	static getTokenExpiration(token: string): Date | null {
		const decoded = this.decodeToken(token);
		if (decoded && decoded.exp) {
			return new Date(decoded.exp * 1000);
		}
		return null;
	}

	/**
	 * Check if token is expired
	 */
	static isTokenExpired(token: string): boolean {
		const expiration = this.getTokenExpiration(token);
		if (!expiration) return true;
		return expiration < new Date();
	}
}
