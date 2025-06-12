import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
	maxSizeMB: number;
	maxWidthOrHeight: number;
	useWebWorker: boolean;
	fileType?: string;
	initialQuality?: number;
}

const DEFAULT_COMPRESSION_OPTIONS: CompressionOptions = {
	maxSizeMB: 1, // Compress to max 1MB
	maxWidthOrHeight: 800, // Max dimension for faster upload
	useWebWorker: true, // Use web worker for non-blocking compression
	fileType: 'image/webp', // Convert to WebP for better compression
	initialQuality: 0.8, // Good quality/size balance
};

/**
 * Compress and optimize image before upload
 */
export const compressImage = async (
	file: File,
	options: Partial<CompressionOptions> = {}
): Promise<File> => {
	const compressionOptions = {
		...DEFAULT_COMPRESSION_OPTIONS,
		...options,
	};

	try {
		// Check if compression is needed
		const fileSizeMB = file.size / 1024 / 1024;

		// If file is already small and optimized, return as-is
		if (
			fileSizeMB <= 0.5 &&
			file.type === 'image/webp'
		) {
			return file;
		}

		// Compress the image
		const compressedFile = await imageCompression(
			file,
			compressionOptions
		);

		// Ensure we actually reduced the file size
		return compressedFile.size < file.size
			? compressedFile
			: file;
	} catch {
		// If compression fails, return original file
		return file;
	}
};

/**
 * Get optimized image dimensions
 */
export const getOptimizedDimensions = (
	originalWidth: number,
	originalHeight: number,
	maxDimension: number = 800
): { width: number; height: number } => {
	if (
		originalWidth <= maxDimension &&
		originalHeight <= maxDimension
	) {
		return {
			width: originalWidth,
			height: originalHeight,
		};
	}

	const aspectRatio = originalWidth / originalHeight;

	if (originalWidth > originalHeight) {
		return {
			width: maxDimension,
			height: Math.round(maxDimension / aspectRatio),
		};
	} else {
		return {
			width: Math.round(maxDimension * aspectRatio),
			height: maxDimension,
		};
	}
};

/**
 * Validate image file
 */
export const validateImageFile = (
	file: File
): { valid: boolean; error?: string } => {
	const allowedTypes = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'image/webp',
	];
	const maxSizeBytes = 10 * 1024 * 1024; // 10MB before compression

	if (!allowedTypes.includes(file.type)) {
		return {
			valid: false,
			error: 'Please select a JPEG, PNG, or WebP image',
		};
	}

	if (file.size > maxSizeBytes) {
		return {
			valid: false,
			error: 'Image size must be less than 10MB',
		};
	}

	return { valid: true };
};
