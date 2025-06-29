import React from 'react';
import {
	MdDescription,
	MdClose,
	MdCheckCircle,
} from 'react-icons/md';
import { useTheme } from '../../contexts/ThemeContext';
import {
	useDocumentStore,
	useActiveDocument,
	useDocuments,
} from '../../stores/documentStore';

const DocumentViewer: React.FC = () => {
	const { isDark } = useTheme();
	const documents = useDocuments();
	const activeDocument = useActiveDocument();
	const { removeDocument, setActiveDocument } =
		useDocumentStore();

	if (documents.length === 0) {
		return null;
	}

	return (
		<div
			className={`p-4 border-b-2 ${
				isDark
					? 'bg-chat-secondary/50 border-chat-accent/30'
					: 'bg-gray-50 border-chat-purple/30'
			}`}
		>
			<div className='space-y-2'>
				<h3
					className={`text-sm font-medium ${
						isDark
							? 'text-chat-accent'
							: 'text-gray-700'
					}`}
				>
					Uploaded Documents
				</h3>

				<div className='space-y-2'>
					{documents.map((document) => (
						<div
							key={document.id}
							onClick={() => {
								// Toggle active document on click
								if (
									activeDocument?.id ===
									document.id
								) {
									setActiveDocument(null);
								} else {
									setActiveDocument(
										document
									);
								}
							}}
							className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
								activeDocument?.id ===
								document.id
									? isDark
										? 'bg-chat-pink/20 border-chat-pink'
										: 'bg-chat-purple/20 border-chat-purple'
									: isDark
									? 'bg-chat-primary/50 border-chat-accent/30 hover:border-chat-orange/40'
									: 'bg-white border-gray-300 hover:border-chat-pink/50'
							}`}
							title={
								activeDocument?.id ===
								document.id
									? 'Click to deactivate document context'
									: 'Click to activate document for AI context'
							}
						>
							<MdDescription
								className={`text-xl ${
									activeDocument?.id ===
									document.id
										? isDark
											? 'text-chat-pink'
											: 'text-chat-purple'
										: isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								}`}
							/>

							<div className='flex-1 min-w-0'>
								<p
									className={`text-sm font-medium truncate ${
										isDark
											? 'text-white'
											: 'text-gray-900'
									}`}
								>
									{document.name}
								</p>
								<p
									className={`text-xs ${
										isDark
											? 'text-chat-accent/70'
											: 'text-gray-500'
									}`}
								>
									{Math.round(
										document.size / 1024
									)}{' '}
									KB •{' '}
									{
										document.content.split(
											' '
										).length
									}{' '}
									words
								</p>
							</div>

							{activeDocument?.id ===
								document.id && (
								<MdCheckCircle
									className={`text-lg ${
										isDark
											? 'text-chat-pink'
											: 'text-chat-purple'
									}`}
								/>
							)}

							<button
								onClick={(e) => {
									e.stopPropagation(); // Prevent document activation
									if (
										activeDocument?.id ===
										document.id
									) {
										setActiveDocument(
											null
										);
									}
									removeDocument(
										document.id
									);
								}}
								className={`p-1 rounded-full transition-colors ${
									isDark
										? 'text-chat-accent/70 hover:text-red-400 hover:bg-red-400/20'
										: 'text-gray-400 hover:text-red-500 hover:bg-red-100'
								}`}
								title='Remove document'
							>
								<MdClose className='text-sm' />
							</button>
						</div>
					))}
				</div>

				{activeDocument && (
					<div
						className={`mt-3 p-3 rounded-lg ${
							isDark
								? 'bg-chat-pink/10 border border-chat-pink/30'
								: 'bg-chat-purple/10 border border-chat-purple/30'
						}`}
					>
						<p
							className={`text-xs ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							🤖{' '}
							<strong>
								AI Context Active:
							</strong>{' '}
							"{activeDocument.name}"
							<br />
							<span className='opacity-75'>
								The AI will prioritize
								information from this
								document when answering
								questions.
							</span>
						</p>
					</div>
				)}

				{documents.length > 0 &&
					!activeDocument && (
						<div
							className={`mt-3 p-3 rounded-lg ${
								isDark
									? 'bg-yellow-900/20 border border-yellow-600/30'
									: 'bg-yellow-50 border border-yellow-300'
							}`}
						>
							<p
								className={`text-xs ${
									isDark
										? 'text-yellow-400'
										: 'text-yellow-700'
								}`}
							>
								💡{' '}
								<strong>
									No document active.
								</strong>{' '}
								Click on a document above to
								activate it for AI context.
							</p>
						</div>
					)}
			</div>
		</div>
	);
};

export default DocumentViewer;
