/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from 'multer';

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req: any, file: any, cb: any) => {
	const allowedTypes = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'image/webp',
	];

	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(
			new Error(
				'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
			)
		);
	}
};

// Configure multer
export const uploadProfilePicture = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB limit
		files: 1, // Only one file
	},
}).single('profilePicture');
