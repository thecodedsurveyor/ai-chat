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
	const getLanguageFromClassName = () => {
		if (className && className.includes('language-')) {
			return className.replace('language-', '');
		}
		return null;
	};

	// Smart language detection with fallbacks
	const detectLanguage = () => {
		// First, try to get from className
		const classLanguage = getLanguageFromClassName();
		if (classLanguage) return classLanguage;

		// Then try the language prop
		if (language && language !== 'code')
			return language;

		// Finally, try to detect from code content
		const codeContent = extractTextContent(children);

		// C/C++ detection (check before CSS to avoid false positives)
		if (
			codeContent.includes('#include') ||
			codeContent.includes('int main') ||
			codeContent.includes('std::') ||
			codeContent.includes('cout <<') ||
			codeContent.includes('cin >>') ||
			codeContent.includes('printf(') ||
			codeContent.includes('scanf(') ||
			codeContent.includes('namespace ') ||
			codeContent.includes('using namespace') ||
			/\b(int|char|float|double|void|bool)\s+\w+\s*\(/.test(
				codeContent
			)
		) {
			return 'cpp';
		}

		// Java detection
		if (
			codeContent.includes('public class') ||
			codeContent.includes('private ') ||
			codeContent.includes('public ') ||
			codeContent.includes('System.out.') ||
			codeContent.includes('import java') ||
			codeContent.includes('extends ') ||
			codeContent.includes('implements ')
		) {
			return 'java';
		}

		// C# detection
		if (
			codeContent.includes('using System') ||
			codeContent.includes('namespace ') ||
			codeContent.includes('Console.WriteLine') ||
			codeContent.includes('[System.') ||
			codeContent.includes('public sealed') ||
			codeContent.includes('override ')
		) {
			return 'csharp';
		}

		// Python detection
		if (
			codeContent.includes('def ') ||
			codeContent.includes('import ') ||
			codeContent.includes('from ') ||
			codeContent.includes('print(') ||
			codeContent.includes('if __name__') ||
			codeContent.includes('elif ') ||
			codeContent.includes('self.') ||
			/^[\s]*#.*$/m.test(codeContent)
		) {
			return 'python';
		}

		// TypeScript detection
		if (
			codeContent.includes('interface ') ||
			codeContent.includes('type ') ||
			codeContent.includes(': string') ||
			codeContent.includes(': number') ||
			codeContent.includes(': boolean') ||
			codeContent.includes('export interface') ||
			codeContent.includes('import type')
		) {
			return 'typescript';
		}

		// React/JSX detection
		if (
			codeContent.includes('useState') ||
			codeContent.includes('useEffect') ||
			codeContent.includes('useCallback') ||
			codeContent.includes('useMemo') ||
			codeContent.includes('jsx') ||
			codeContent.includes('<div') ||
			codeContent.includes('<span') ||
			codeContent.includes('<button') ||
			codeContent.includes('className=') ||
			codeContent.includes('export default') ||
			codeContent.includes('import React') ||
			codeContent.includes('React.') ||
			codeContent.includes('props.') ||
			codeContent.includes('{props') ||
			/return\s*\(\s*</.test(codeContent)
		) {
			return 'jsx';
		}

		// JavaScript detection
		if (
			codeContent.includes('function') ||
			codeContent.includes('const ') ||
			codeContent.includes('let ') ||
			codeContent.includes('var ') ||
			codeContent.includes('=>') ||
			codeContent.includes('console.log') ||
			codeContent.includes('require(') ||
			codeContent.includes('module.exports')
		) {
			return 'javascript';
		}

		// HTML detection (check before CSS)
		if (
			codeContent.includes('<!DOCTYPE') ||
			codeContent.includes('<html') ||
			codeContent.includes('<head') ||
			codeContent.includes('<body') ||
			codeContent.includes('<meta') ||
			codeContent.includes('<link') ||
			codeContent.includes('<script')
		) {
			return 'html';
		}

		// CSS detection (more specific patterns)
		if (
			codeContent.includes('{') &&
			codeContent.includes(':') &&
			codeContent.includes(';') &&
			(codeContent.includes('color:') ||
				codeContent.includes('background:') ||
				codeContent.includes('margin:') ||
				codeContent.includes('padding:') ||
				codeContent.includes('display:') ||
				codeContent.includes('position:') ||
				codeContent.includes('font-') ||
				codeContent.includes('border:') ||
				/\.\w+\s*{/.test(codeContent) ||
				/#\w+\s*{/.test(codeContent))
		) {
			return 'css';
		}

		// SQL detection
		if (
			codeContent.includes('SELECT ') ||
			codeContent.includes('INSERT INTO') ||
			codeContent.includes('UPDATE ') ||
			codeContent.includes('DELETE FROM') ||
			codeContent.includes('CREATE TABLE') ||
			codeContent.includes('ALTER TABLE') ||
			codeContent.includes('FROM ') ||
			codeContent.includes('WHERE ')
		) {
			return 'sql';
		}

		// JSON detection
		if (
			(codeContent.trim().startsWith('{') &&
				codeContent.trim().endsWith('}')) ||
			(codeContent.trim().startsWith('[') &&
				codeContent.trim().endsWith(']')) ||
			(codeContent.includes('"') &&
				codeContent.includes(':') &&
				!codeContent.includes('function'))
		) {
			return 'json';
		}

		// XML detection
		if (
			codeContent.includes('<?xml') ||
			(codeContent.includes('<') &&
				codeContent.includes('</') &&
				!codeContent.includes('<div') &&
				!codeContent.includes('<span'))
		) {
			return 'xml';
		}

		// Shell/Bash detection
		if (
			codeContent.includes('#!/bin/bash') ||
			codeContent.includes('#!/bin/sh') ||
			codeContent.includes('echo ') ||
			codeContent.includes('export ') ||
			codeContent.includes('alias ') ||
			/^\$\s/.test(codeContent)
		) {
			return 'bash';
		}

		// Go detection
		if (
			codeContent.includes('package ') ||
			codeContent.includes('import (') ||
			codeContent.includes('func ') ||
			codeContent.includes('go ') ||
			codeContent.includes('fmt.Print')
		) {
			return 'go';
		}

		// Rust detection
		if (
			codeContent.includes('fn ') ||
			codeContent.includes('let mut') ||
			codeContent.includes('println!') ||
			codeContent.includes('use std::') ||
			codeContent.includes('struct ') ||
			codeContent.includes('impl ')
		) {
			return 'rust';
		}

		// PHP detection
		if (
			codeContent.includes('<?php') ||
			codeContent.includes('$_') ||
			codeContent.includes('echo ') ||
			codeContent.includes('function ') ||
			codeContent.includes('class ') ||
			/\$\w+/.test(codeContent)
		) {
			return 'php';
		}

		// Ruby detection
		if (
			codeContent.includes('def ') ||
			codeContent.includes('end') ||
			codeContent.includes('puts ') ||
			codeContent.includes('require ') ||
			codeContent.includes('class ') ||
			codeContent.includes('@')
		) {
			return 'ruby';
		}

		// Fallback
		return 'code';
	};

	const detectedLanguage = detectLanguage();

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
