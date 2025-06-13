import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../../../contexts/ThemeContext';
import EnhancedCodeBlock from './EnhancedCodeBlock';

interface MarkdownMessageProps {
	content: string;
	isUser: boolean;
}

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({
	content,
	isUser,
}) => {
	const { isDark } = useTheme();

	return (
		<div
			className={`markdown-content ${
				isUser ? 'user-message' : ''
			}`}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					code: ({
						className,
						children,
						...props
					}) => {
						const match = /language-(\w+)/.exec(
							className || ''
						);
						const language = match
							? match[1]
							: '';

						// Check if this is a code block (has language) vs inline code
						if (language && className) {
							// Use EnhancedCodeBlock for code blocks
							return (
								<EnhancedCodeBlock
									className={className}
									language={language}
								>
									{children}
								</EnhancedCodeBlock>
							);
						}

						// Regular inline code styling
						return (
							<code
								className={`px-1.5 py-0.5 rounded text-sm ${
									isDark
										? 'bg-gray-700 text-pink-300'
										: 'bg-gray-200 text-pink-600'
								} ${className || ''}`}
								{...props}
							>
								{children}
							</code>
						);
					},
					// Blockquotes
					blockquote({ children }) {
						return (
							<blockquote
								className={`border-l-4 pl-4 my-3 italic ${
									isDark
										? 'border-pink-400 bg-gray-800/50 text-gray-300'
										: 'border-pink-400 bg-pink-50/50 text-gray-700'
								}`}
							>
								{children}
							</blockquote>
						);
					},
					// Tables
					table({ children }) {
						return (
							<div className='overflow-x-auto my-3'>
								<table
									className={`min-w-full border-collapse ${
										isDark
											? 'border-gray-600'
											: 'border-gray-300'
									}`}
								>
									{children}
								</table>
							</div>
						);
					},
					th({ children }) {
						return (
							<th
								className={`border px-3 py-2 text-left font-semibold ${
									isDark
										? 'border-gray-600 bg-gray-700 text-white'
										: 'border-gray-300 bg-gray-100 text-gray-900'
								}`}
							>
								{children}
							</th>
						);
					},
					td({ children }) {
						return (
							<td
								className={`border px-3 py-2 ${
									isDark
										? 'border-gray-600'
										: 'border-gray-300'
								}`}
							>
								{children}
							</td>
						);
					},
					// Lists
					ul({ children }) {
						return (
							<ul className='list-disc list-inside my-2 space-y-1'>
								{children}
							</ul>
						);
					},
					ol({ children }) {
						return (
							<ol className='list-decimal list-inside my-2 space-y-1'>
								{children}
							</ol>
						);
					},
					// Links
					a({ href, children }) {
						return (
							<a
								href={href}
								target='_blank'
								rel='noopener noreferrer'
								className={`underline ${
									isDark
										? 'text-blue-400 hover:text-blue-300'
										: 'text-blue-600 hover:text-blue-800'
								}`}
							>
								{children}
							</a>
						);
					},
					// Headings
					h1({ children }) {
						return (
							<h1 className='text-2xl font-bold my-3'>
								{children}
							</h1>
						);
					},
					h2({ children }) {
						return (
							<h2 className='text-xl font-bold my-3'>
								{children}
							</h2>
						);
					},
					h3({ children }) {
						return (
							<h3 className='text-lg font-bold my-2'>
								{children}
							</h3>
						);
					},
					// Paragraphs
					p({ children }) {
						return (
							<p className='my-2 leading-relaxed'>
								{children}
							</p>
						);
					},
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
};

export default MarkdownMessage;
