const fs = require('fs');
const path = require('path');

// Icon mapping from BoxIcons to React Icons
const iconMapping = {
	'bx bx-share-alt': 'MdShare',
	'bx bx-plus': 'MdAdd',
	'bx bx-pin': 'MdPushPin',
	'bx bx-cog': 'MdSettings',
	'bx bx-x-circle': 'MdCancel',
	'bx bx-menu': 'MdMenu',
	'bx bx-message-dots': 'MdMessage',
	'bx bx-lightning': 'MdFlashOn',
	'bx bx-collection': 'MdCollections',
	'bx bx-dots-horizontal-rounded': 'MdMoreHoriz',
	'bx bx-x': 'MdClose',
	'bx bx-search': 'MdSearch',
	'bx bx-bar-chart-alt-2': 'MdBarChart',
	'bx bx-user-circle': 'MdPerson',
	'bx bx-bookmark': 'MdBookmark',
	'bx bx-edit-alt': 'MdEdit',
	'bx bx-download': 'MdDownload',
	'bx bx-filter': 'MdFilterList',
	'bx bx-refresh': 'MdRefresh',
	'bx bx-search-alt-2': 'MdSearchOff',
	'bx bx-check-circle': 'MdCheckCircle',
	'bx bx-star': 'MdStar',
	'bx bxs-star': 'MdStar',
	'bx bx-link': 'MdLink',
	'bx bx-copy': 'MdContentCopy',
	'bx bx-trash': 'MdDelete',
	'bx bx-tag': 'MdLabel',
	'bx bx-info-circle': 'MdInfo',
};

// Additional imports needed
const additionalImports = [
	'MdDownload',
	'MdFilterList',
	'MdRefresh',
	'MdSearchOff',
	'MdCheckCircle',
	'MdStar',
	'MdLink',
	'MdContentCopy',
	'MdDelete',
	'MdLabel',
];

function replaceIconsInFile(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		let hasChanges = false;

		// Replace BoxIcon usage patterns
		for (const [boxIcon, reactIcon] of Object.entries(
			iconMapping
		)) {
			// Pattern 1: <i className='bx bx-icon'></i>
			const pattern1 = new RegExp(
				`<i className=['"]${boxIcon.replace(
					/[.*+?^${}()|[\]\\]/g,
					'\\$&'
				)}['"][^>]*></i>`,
				'g'
			);
			if (pattern1.test(content)) {
				content = content.replace(
					pattern1,
					`<${reactIcon} />`
				);
				hasChanges = true;
			}

			// Pattern 2: <i className='bx bx-icon text-xl'></i>
			const pattern2 = new RegExp(
				`<i className=['"]${boxIcon.replace(
					/[.*+?^${}()|[\]\\]/g,
					'\\$&'
				)}([^'"]*?)['"][^>]*></i>`,
				'g'
			);
			if (pattern2.test(content)) {
				content = content.replace(
					pattern2,
					(match, classes) => {
						const cleanClasses = classes
							.replace(boxIcon, '')
							.trim();
						return cleanClasses
							? `<${reactIcon} className='${cleanClasses}' />`
							: `<${reactIcon} />`;
					}
				);
				hasChanges = true;
			}

			// Pattern 3: className={cn('bx bx-icon', ...)}
			const pattern3 = new RegExp(
				`['"]${boxIcon.replace(
					/[.*+?^${}()|[\]\\]/g,
					'\\$&'
				)}['"]`,
				'g'
			);
			if (pattern3.test(content)) {
				content = content.replace(
					pattern3,
					`'${reactIcon}'`
				);
				hasChanges = true;
			}
		}

		if (hasChanges) {
			fs.writeFileSync(filePath, content);
			console.log(`Updated: ${filePath}`);
			return true;
		}
		return false;
	} catch (error) {
		console.error(
			`Error processing ${filePath}:`,
			error.message
		);
		return false;
	}
}

function processDirectory(dirPath) {
	const files = fs.readdirSync(dirPath);
	let totalUpdated = 0;

	for (const file of files) {
		const fullPath = path.join(dirPath, file);
		const stat = fs.statSync(fullPath);

		if (
			stat.isDirectory() &&
			!file.startsWith('.') &&
			file !== 'node_modules'
		) {
			totalUpdated += processDirectory(fullPath);
		} else if (
			file.endsWith('.tsx') ||
			file.endsWith('.ts')
		) {
			if (replaceIconsInFile(fullPath)) {
				totalUpdated++;
			}
		}
	}

	return totalUpdated;
}

// Run the replacement
console.log(
	'Starting BoxIcons to React Icons replacement...'
);
const srcPath = path.join(__dirname, 'src');
const totalUpdated = processDirectory(srcPath);
console.log(`\nCompleted! Updated ${totalUpdated} files.`);

console.log("\nDon't forget to:");
console.log(
	'1. Add missing React Icons imports to files that need them'
);
console.log(
	'2. Remove unused BoxIcons CDN links from index.html'
);
console.log(
	'3. Test the application to ensure all icons display correctly'
);
