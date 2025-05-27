import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useTheme } from '../../../contexts/ThemeContext';
import 'prismjs/themes/prism-tomorrow.css';

type MarkdownMessageProps = {
	content: string;
	className?: string;
};

const MarkdownMessage = ({
	content,
	className = '',
}: MarkdownMessageProps) => {
	const { isDark } = useTheme();

	return (
		<div className={`markdown-content ${className}`}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeHighlight, rehypeRaw]}
				components={{
					// Code blocks
					code(props: {
						inline?: boolean;
						className?: string;
						children?: React.ReactNode;
					}) {
						const {
							inline,
							className,
							children,
						} = props;
						const match = /language-(\w+)/.exec(
							className || ''
						);
						return !inline && match ? (
							<div className='relative'>
								<div
									className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${
										isDark
											? 'bg-gray-700 text-gray-300'
											: 'bg-gray-200 text-gray-600'
									}`}
								>
									{match[1]}
								</div>
								<pre
									className={`language-${
										match[1]
									} rounded-lg p-4 my-3 overflow-x-auto ${
										isDark
											? 'bg-gray-800'
											: 'bg-gray-100'
									}`}
								>
									<code
										className={
											className
										}
									>
										{children}
									</code>
								</pre>
							</div>
						) : (
							<code
								className={`px-1.5 py-0.5 rounded text-sm ${
									isDark
										? 'bg-gray-700 text-pink-300'
										: 'bg-gray-200 text-pink-600'
								} ${className}`}
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
