import { v2 as cloudinary } from 'cloudinary';
import config from './environment';

// Configure Cloudinary with environment variables
cloudinary.config({
	cloud_name: config.cloudinary.cloudName,
	api_key: config.cloudinary.apiKey,
	api_secret: config.cloudinary.apiSecret,
	secure: true, // Use HTTPS URLs
});

// Upload options for profile pictures
export const profileUploadOptions = {
	folder: 'neuronflow/profiles', // Organize uploads in folders
	transformation: [
		{
			width: 300,
			height: 300,
			crop: 'fill',
			gravity: 'face', // Focus on face when cropping
			format: 'webp', // Convert to WebP for better compression
			quality: 'auto:good', // Automatic quality optimization
			flags: 'progressive', // Progressive loading
			dpr: 'auto', // Auto device pixel ratio
		},
	],
	allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
	max_file_size: 5000000, // 5MB limit
	eager: [
		// Pre-generate common sizes for faster loading
		{
			width: 150,
			height: 150,
			crop: 'fill',
			gravity: 'face',
			format: 'webp',
			quality: 'auto:good',
		},
		{
			width: 50,
			height: 50,
			crop: 'fill',
			gravity: 'face',
			format: 'webp',
			quality: 'auto:good',
		},
	],
	eager_async: true, // Generate thumbnails asynchronously
};

export default cloudinary;
