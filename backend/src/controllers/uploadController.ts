import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import cloudinary, {
	profileUploadOptions,
} from '../config/cloudinary';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

/**
 * Upload profile picture to Cloudinary with optimizations
 */
export const uploadProfilePicture = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		if (!req.file) {
			res.status(400).json({
				success: false,
				message: 'No file uploaded',
			});
			return;
		}

		// Optimize image with Sharp before uploading to Cloudinary
		const optimizedBuffer = await sharp(req.file.buffer)
			.resize(300, 300, {
				fit: 'cover',
				position: 'center',
			})
			.webp({ quality: 85, effort: 6 })
			.toBuffer();

		// Upload optimized image to Cloudinary
		const uploadResult = await new Promise(
			(resolve, reject) => {
				cloudinary.uploader
					.upload_stream(
						{
							...profileUploadOptions,
							public_id: `user-${userId}-${Date.now()}`,
							format: 'webp',
							quality: 'auto:good',
							fetch_format: 'auto',
						},
						(error, result) => {
							if (error) {
								reject(error);
							} else {
								resolve(result);
							}
						}
					)
					.end(optimizedBuffer);
			}
		);

		const result = uploadResult as {
			secure_url: string;
			public_id: string;
		};

		// Update user avatar with optimized batch operation
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				avatar: result.secure_url,
				updatedAt: new Date(),
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				avatar: true,
				isVerified: true,
				preferences: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		// Set caching headers for better performance
		res.set({
			'Cache-Control': 'public, max-age=31536000', // 1 year
			ETag: `"${result.public_id}"`,
		});

		res.status(200).json({
			success: true,
			message:
				'Profile picture uploaded successfully',
			data: {
				user: updatedUser,
				cloudinaryUrl: result.secure_url,
				publicId: result.public_id,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to upload profile picture',
			error:
				error instanceof Error
					? error.message
					: 'Unknown error',
		});
	}
};
