import type { QuickResponse } from '../types';

export const quickResponses: QuickResponse[] = [
	// Productivity
	{
		id: 'summarize',
		title: 'Summarize',
		prompt: 'Please summarize the following text in 3-5 bullet points:',
		category: 'Productivity',
	},
	{
		id: 'explain',
		title: 'Explain Simply',
		prompt: 'Please explain this concept in simple terms that anyone can understand:',
		category: 'Productivity',
	},
	{
		id: 'translate',
		title: 'Translate',
		prompt: 'Please translate the following text to English:',
		category: 'Productivity',
	},
	{
		id: 'improve',
		title: 'Improve Writing',
		prompt: 'Please improve the grammar, clarity, and style of this text:',
		category: 'Productivity',
	},

	// Creative
	{
		id: 'brainstorm',
		title: 'Brainstorm Ideas',
		prompt: 'Help me brainstorm creative ideas for:',
		category: 'Creative',
	},
	{
		id: 'story',
		title: 'Write a Story',
		prompt: 'Write a short creative story about:',
		category: 'Creative',
	},
	{
		id: 'poem',
		title: 'Write a Poem',
		prompt: 'Write a beautiful poem about:',
		category: 'Creative',
	},

	// Coding
	{
		id: 'code-explain',
		title: 'Explain Code',
		prompt: 'Please explain what this code does step by step:',
		category: 'Coding',
	},
	{
		id: 'code-review',
		title: 'Code Review',
		prompt: 'Please review this code and suggest improvements:',
		category: 'Coding',
	},
	{
		id: 'debug',
		title: 'Debug Code',
		prompt: "Help me debug this code. Here's the error and code:",
		category: 'Coding',
	},
	{
		id: 'optimize',
		title: 'Optimize Code',
		prompt: 'Please optimize this code for better performance:',
		category: 'Coding',
	},

	// Learning
	{
		id: 'learn',
		title: 'Teach Me',
		prompt: 'I want to learn about this topic. Please explain it step by step:',
		category: 'Learning',
	},
	{
		id: 'quiz',
		title: 'Quiz Me',
		prompt: 'Create a quiz to test my knowledge about:',
		category: 'Learning',
	},
	{
		id: 'examples',
		title: 'Give Examples',
		prompt: 'Please provide 5 practical examples of:',
		category: 'Learning',
	},

	// Quick Starters
	{
		id: 'hello',
		title: 'Hello!',
		prompt: 'Hello! How can you help me today?',
		category: 'Quick',
	},
	{
		id: 'help',
		title: 'Help',
		prompt: 'What are some interesting things you can help me with?',
		category: 'Quick',
	},
	{
		id: 'random',
		title: 'Random Fact',
		prompt: 'Tell me an interesting random fact about science or history.',
		category: 'Quick',
	},
];
