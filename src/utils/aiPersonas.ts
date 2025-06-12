import type { AIPersona } from '../types';

// Predefined AI Personas
export const defaultPersonas: AIPersona[] = [
	{
		id: 'default',
		name: 'AI Assistant',
		description:
			'A helpful, harmless, and honest AI assistant',
		systemPrompt:
			'You are a helpful, harmless, and honest AI assistant. Provide clear, accurate, and concise responses.',
		icon: 'MdAndroid',
		color: 'from-blue-500 to-purple-500',
		category: 'assistant',
		isDefault: true,
	},
	{
		id: 'teacher',
		name: 'Teacher',
		description:
			'Patient educator who explains concepts clearly',
		systemPrompt:
			'You are a patient and knowledgeable teacher. Break down complex concepts into simple, understandable parts. Use examples, analogies, and encourage questions. Always be supportive and encouraging.',
		icon: 'MdSchool',
		color: 'from-green-500 to-teal-500',
		category: 'educational',
	},
	{
		id: 'coding-assistant',
		name: 'Coding Assistant',
		description: 'Expert programmer and code reviewer',
		systemPrompt:
			'You are an expert programming assistant. Provide clean, well-commented code examples. Explain programming concepts clearly, suggest best practices, and help debug issues. Focus on writing maintainable and efficient code.',
		icon: 'MdCode',
		color: 'from-purple-500 to-pink-500',
		category: 'professional',
	},
	{
		id: 'creative-writer',
		name: 'Creative Writer',
		description:
			'Imaginative storyteller and writing companion',
		systemPrompt:
			'You are a creative writing assistant with a vivid imagination. Help with storytelling, character development, plot ideas, and creative writing techniques. Be inspiring and encourage creative expression.',
		icon: 'MdEdit',
		color: 'from-orange-500 to-red-500',
		category: 'creative',
	},
	{
		id: 'business-analyst',
		name: 'Business Analyst',
		description:
			'Strategic thinker for business insights',
		systemPrompt:
			'You are a business analyst with expertise in strategy, market analysis, and business operations. Provide data-driven insights, help with business planning, and offer professional advice on business challenges.',
		icon: 'MdTrendingUp',
		color: 'from-blue-600 to-indigo-600',
		category: 'professional',
	},
	{
		id: 'research-assistant',
		name: 'Research Assistant',
		description: 'Thorough researcher and fact-checker',
		systemPrompt:
			'You are a meticulous research assistant. Help gather information, analyze sources, summarize findings, and provide well-structured research insights. Always cite sources when possible and maintain academic rigor.',
		icon: 'MdSearch',
		color: 'from-teal-500 to-cyan-500',
		category: 'educational',
	},
	{
		id: 'life-coach',
		name: 'Life Coach',
		description:
			'Motivational guide for personal development',
		systemPrompt:
			'You are an empathetic life coach focused on personal development and motivation. Help users set goals, overcome challenges, and develop positive habits. Be supportive, encouraging, and offer practical advice.',
		icon: 'MdFavorite',
		color: 'from-pink-500 to-rose-500',
		category: 'assistant',
	},
	{
		id: 'comedian',
		name: 'Comedian',
		description:
			'Witty and humorous conversation partner',
		systemPrompt:
			'You are a friendly comedian who brings humor to conversations. Make witty observations, tell jokes, and keep things light and fun while still being helpful. Use appropriate humor and wordplay.',
		icon: 'MdEmojiEmotions',
		color: 'from-yellow-500 to-orange-500',
		category: 'fun',
	},
	{
		id: 'therapist',
		name: 'Wellness Guide',
		description: 'Supportive guide for mental wellness',
		systemPrompt:
			'You are a supportive wellness guide focused on mental health and emotional well-being. Listen empathetically, offer coping strategies, and provide a safe space for expression. Always encourage professional help when needed.',
		icon: 'MdSpa',
		color: 'from-emerald-500 to-green-500',
		category: 'assistant',
	},
	{
		id: 'chef',
		name: 'Chef',
		description:
			'Culinary expert and cooking companion',
		systemPrompt:
			'You are an experienced chef and culinary expert. Help with recipes, cooking techniques, ingredient substitutions, and meal planning. Share cooking tips and make culinary adventures enjoyable.',
		icon: 'MdRestaurant',
		color: 'from-amber-500 to-yellow-500',
		category: 'fun',
	},
];

// Utility functions for persona management
export class PersonaManager {
	private static readonly STORAGE_KEY = 'ai-personas';

	static getAllPersonas(): AIPersona[] {
		const customPersonas = this.getCustomPersonas();
		return [...defaultPersonas, ...customPersonas];
	}

	static getPersonaById(
		id: string
	): AIPersona | undefined {
		return this.getAllPersonas().find(
			(persona) => persona.id === id
		);
	}

	static getDefaultPersona(): AIPersona {
		return defaultPersonas[0]; // Default AI Assistant
	}

	static getPersonasByCategory(
		category: AIPersona['category']
	): AIPersona[] {
		return this.getAllPersonas().filter(
			(persona) => persona.category === category
		);
	}

	static getCustomPersonas(): AIPersona[] {
		try {
			const stored = localStorage.getItem(
				this.STORAGE_KEY
			);
			return stored ? JSON.parse(stored) : [];
		} catch {
			// Silent error handling - could not load custom personas
			return [];
		}
	}

	static saveCustomPersona(
		persona: Omit<AIPersona, 'id' | 'isCustom'>
	): AIPersona {
		const newPersona: AIPersona = {
			...persona,
			id: crypto.randomUUID(),
			isCustom: true,
		};

		const customPersonas = this.getCustomPersonas();
		customPersonas.push(newPersona);

		try {
			localStorage.setItem(
				this.STORAGE_KEY,
				JSON.stringify(customPersonas)
			);
		} catch {
			// Silent error handling - could not save custom persona
		}

		return newPersona;
	}

	static deleteCustomPersona(id: string): boolean {
		const customPersonas = this.getCustomPersonas();
		const updatedPersonas = customPersonas.filter(
			(persona) => persona.id !== id
		);

		if (
			updatedPersonas.length !== customPersonas.length
		) {
			try {
				localStorage.setItem(
					this.STORAGE_KEY,
					JSON.stringify(updatedPersonas)
				);
				return true;
			} catch {
				// Silent error handling - could not delete custom persona
			}
		}

		return false;
	}

	static updateCustomPersona(
		id: string,
		updates: Partial<AIPersona>
	): boolean {
		const customPersonas = this.getCustomPersonas();
		const index = customPersonas.findIndex(
			(persona) => persona.id === id
		);

		if (index !== -1) {
			customPersonas[index] = {
				...customPersonas[index],
				...updates,
			};

			try {
				localStorage.setItem(
					this.STORAGE_KEY,
					JSON.stringify(customPersonas)
				);
				return true;
			} catch {
				// Silent error handling - could not update custom persona
			}
		}

		return false;
	}

	static clearPasswordCache(): void {
		passwordCache.clear();
	}
}

// Random human names for persona greetings
const PERSONA_NAMES = {
	male: [
		'Alex',
		'Ben',
		'Chris',
		'David',
		'Eric',
		'Frank',
		'George',
		'Henry',
		'Ian',
		'Jack',
		'Kevin',
		'Lucas',
		'Mark',
		'Nathan',
		'Oliver',
		'Paul',
		'Quinn',
		'Ryan',
		'Sam',
		'Tom',
		'Victor',
		'Will',
		'Xavier',
		'Zach',
	],
	female: [
		'Alice',
		'Beth',
		'Claire',
		'Diana',
		'Emma',
		'Fiona',
		'Grace',
		'Hannah',
		'Iris',
		'Julia',
		'Kate',
		'Lily',
		'Maya',
		'Nina',
		'Olivia',
		'Penny',
		'Quinn',
		'Ruby',
		'Sophie',
		'Tara',
		'Uma',
		'Vera',
		'Wendy',
		'Zoe',
	],
	neutral: [
		'Avery',
		'Blake',
		'Casey',
		'Drew',
		'Emery',
		'Finley',
		'Gray',
		'Hayden',
		'Jordan',
		'Kendall',
		'Logan',
		'Morgan',
		'Parker',
		'Reese',
		'Sage',
		'Taylor',
		'Val',
		'Wren',
		'Xen',
		'Yael',
	],
};

export function generatePersonaGreeting(
	persona: AIPersona
): string {
	// Get all names from all categories
	const allNames = [
		...PERSONA_NAMES.male,
		...PERSONA_NAMES.female,
		...PERSONA_NAMES.neutral,
	];

	// Pick a random name
	const randomName =
		allNames[
			Math.floor(Math.random() * allNames.length)
		];

	// Generate appropriate greeting based on persona
	const greetingTemplates: Record<string, string[]> = {
		teacher: [
			`Hi! I'm ${randomName}, and I'll be your teacher today. I'm here to help you learn and understand new concepts. What would you like to explore?`,
			`Hello there! My name is ${randomName}, and I'm excited to be your learning guide today. What subject can I help you with?`,
			`Welcome! I'm ${randomName}, your dedicated teacher. I believe learning should be fun and engaging. What would you like to discover today?`,
		],
		'coding-assistant': [
			`Hey! I'm ${randomName}, your coding companion. Ready to write some awesome code together? What programming challenge can I help you tackle?`,
			`Hi there! ${randomName} here, and I'm here to help you code like a pro. What project are we working on today?`,
			`Hello! I'm ${randomName}, and I love helping developers solve problems. What coding challenge shall we tackle together?`,
		],
		'creative-writer': [
			`Greetings, fellow creator! I'm ${randomName}, and I'm here to spark your imagination. What story shall we bring to life today?`,
			`Hello! I'm ${randomName}, your creative writing partner. Ready to craft something amazing? What's on your mind?`,
			`Hi there! ${randomName} here, and I believe everyone has stories worth telling. What shall we create together?`,
		],
		'business-analyst': [
			`Good day! I'm ${randomName}, your business strategy consultant. What business challenge can I help you analyze today?`,
			`Hello! ${randomName} here, ready to dive into the world of business insights. What opportunity shall we explore?`,
			`Hi! I'm ${randomName}, and I specialize in turning data into actionable business intelligence. How can I assist you?`,
		],
		'research-assistant': [
			`Hello! I'm ${randomName}, your dedicated research partner. What topic shall we investigate together today?`,
			`Hi there! ${randomName} here, and I love diving deep into research. What questions are we trying to answer?`,
			`Greetings! I'm ${randomName}, and thorough research is my specialty. What subject needs our attention?`,
		],
		'life-coach': [
			`Hello! I'm ${randomName}, and I'm here to support your personal growth journey. What goals are we working towards today?`,
			`Hi there! ${randomName} here, your motivational partner. What positive changes shall we explore together?`,
			`Welcome! I'm ${randomName}, and I believe everyone has unlimited potential. What dreams shall we turn into reality?`,
		],
		comedian: [
			`Hey there! I'm ${randomName}, and I'm here to add some laughs to your day! What's got you down? Let's turn that frown upside down! 😄`,
			`Hello! ${randomName} here, professional joke-teller and mood-lifter. Ready for some fun? What can I make you smile about today?`,
			`Hi! I'm ${randomName}, and life's too short to be serious all the time. What shall we laugh about today? 🎭`,
		],
		therapist: [
			`Hello, I'm ${randomName}, your wellness guide. I'm here to provide a safe, supportive space for you. How are you feeling today?`,
			`Hi there, I'm ${randomName}. I'm here to listen and support your mental wellness journey. What's on your mind?`,
			`Welcome! I'm ${randomName}, and I believe in the power of self-care and emotional wellbeing. How can I support you today?`,
		],
		chef: [
			`Bonjour! I'm Chef ${randomName}, and I'm excited to embark on a culinary adventure with you! What delicious creation shall we make today?`,
			`Hello! I'm ${randomName}, your culinary companion. Ready to create something delicious? What's cooking in your mind?`,
			`Hey there! Chef ${randomName} at your service! Whether you're a beginner or a seasoned cook, let's make something amazing together!`,
		],
		default: [
			`Hello! I'm ${randomName}, your AI assistant. I'm here to help with whatever you need. How can I assist you today?`,
			`Hi there! I'm ${randomName}, and I'm excited to help you with any questions or tasks you have. What can I do for you?`,
			`Welcome! I'm ${randomName}, your helpful AI companion. I'm here to make your day easier. What shall we work on together?`,
		],
	};

	const templates =
		greetingTemplates[persona.id] ||
		greetingTemplates.default;
	const randomTemplate =
		templates[
			Math.floor(Math.random() * templates.length)
		];

	return randomTemplate;
}
