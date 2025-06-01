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
}
