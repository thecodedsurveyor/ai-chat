import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

interface EnhancedCodeBlockProps {
	children: React.ReactNode;
	className?: string;
	language?: string;
}

const EnhancedCodeBlock: React.FC<
	EnhancedCodeBlockProps
> = ({ children, className = '', language = 'code' }) => {
	const [copied, setCopied] = useState(false);
	const { showSuccess, showError } = useToast();

	// Extract plain text from React children (handles ReactMarkdown nodes)
	const extractTextContent = (
		node: React.ReactNode
	): string => {
		if (typeof node === 'string') {
			return node;
		}

		if (typeof node === 'number') {
			return String(node);
		}

		if (React.isValidElement(node)) {
			// Handle React elements by extracting their children
			const element = node as React.ReactElement<{
				children?: React.ReactNode;
			}>;
			if (element.props && element.props.children) {
				return extractTextContent(
					element.props.children
				);
			}
			return '';
		}

		if (Array.isArray(node)) {
			return node.map(extractTextContent).join('');
		}

		return '';
	};

	const codeText = extractTextContent(children);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(codeText);
			setCopied(true);
			showSuccess(
				'Code copied!',
				'Code has been copied to your clipboard.'
			);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			showError(
				'Copy failed',
				'Failed to copy code to clipboard.'
			);
		}
	};

	// Extract language from className (e.g., "language-javascript" -> "javascript")
	const detectedLanguage =
		className.replace('language-', '') || language;

	return (
		<div className='enhanced-code-block'>
			{/* Terminal-style header */}
			<div className='enhanced-code-header'>
				<div className='enhanced-code-dots'>
					<span className='dot red'></span>
					<span className='dot yellow'></span>
					<span className='dot green'></span>
				</div>
				<div className='enhanced-code-language'>
					{detectedLanguage}
				</div>
				<div className='enhanced-code-actions'>
					<button
						onClick={handleCopy}
						className='enhanced-copy-btn'
						title='Copy code'
					>
						{copied ? (
							<Check className='w-4 h-4' />
						) : (
							<Copy className='w-4 h-4' />
						)}
						<span className='sr-only sm:not-sr-only ml-1'>
							{copied ? 'Copied!' : 'Copy'}
						</span>
					</button>
				</div>
			</div>

			{/* Code content */}
			<div className='enhanced-code-content'>
				<pre className='enhanced-code-pre'>
					<code className={className}>
						{codeText}
					</code>
				</pre>
			</div>

			{/* Status bar */}
			<div className='enhanced-code-status'>
				<span>{detectedLanguage}</span>
				<span>
					{codeText.split('\n').length} lines
				</span>
			</div>
		</div>
	);
};

export default EnhancedCodeBlock;
