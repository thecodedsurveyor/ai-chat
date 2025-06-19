import type { ConversationTemplate } from '../types';

export const defaultTemplates: ConversationTemplate[] = [
	// Work Templates
	{
		id: 'work-meeting-prep',
		name: 'Meeting Preparation',
		description:
			'Prepare for an upcoming meeting with agenda items and talking points',
		category: 'work',
		prompt: 'Help me prepare for a meeting about [TOPIC]. I need to discuss [KEY POINTS] and want to make sure I cover all important aspects. Can you help me create an agenda and suggest talking points?',
		tags: ['meeting', 'preparation', 'agenda'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},
	{
		id: 'work-email-draft',
		name: 'Professional Email',
		description:
			'Draft a professional email for various business purposes',
		category: 'work',
		prompt: 'Help me write a professional email to [RECIPIENT] about [SUBJECT]. The tone should be [FORMAL/INFORMAL] and I need to [MAIN PURPOSE - request, inform, follow up, etc.].',
		tags: ['email', 'communication', 'professional'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},
	{
		id: 'work-project-planning',
		name: 'Project Planning',
		description:
			'Plan and organize a new project with timelines and milestones',
		category: 'work',
		prompt: "I'm starting a new project: [PROJECT NAME]. The goal is [OBJECTIVE] and I have [TIMEFRAME] to complete it. Help me break this down into phases, create a timeline, and identify potential challenges.",
		tags: ['project', 'planning', 'timeline'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},

	// Personal Templates
	{
		id: 'personal-meal-planning',
		name: 'Meal Planning',
		description:
			'Create a personalized meal plan based on your preferences and dietary needs',
		category: 'personal',
		prompt: 'Help me create a meal plan for [TIME PERIOD]. I prefer [CUISINE TYPES], have [DIETARY RESTRICTIONS/PREFERENCES], and want meals that are [DIFFICULTY LEVEL]. My budget is approximately [BUDGET RANGE].',
		tags: ['cooking', 'meal planning', 'nutrition'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},
	{
		id: 'personal-travel-planning',
		name: 'Travel Planning',
		description:
			'Plan your next trip with destination recommendations and itineraries',
		category: 'personal',
		prompt: "I'm planning a trip to [DESTINATION] for [DURATION] in [TIME PERIOD]. My interests include [ACTIVITIES/INTERESTS] and my budget is [BUDGET RANGE]. Help me create an itinerary and suggest must-see places.",
		tags: ['travel', 'planning', 'vacation'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},
	{
		id: 'personal-fitness-plan',
		name: 'Fitness Planning',
		description:
			'Create a personalized fitness routine based on your goals and preferences',
		category: 'personal',
		prompt: 'Help me create a fitness routine. My goal is [FITNESS GOAL], I have [TIME AVAILABILITY] to work out, and I prefer [EXERCISE TYPES]. My current fitness level is [BEGINNER/INTERMEDIATE/ADVANCED].',
		tags: ['fitness', 'health', 'exercise'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},

	// Creative Templates
	{
		id: 'creative-story-writing',
		name: 'Story Writing',
		description:
			'Get help with creative writing and storytelling',
		category: 'creative',
		prompt: 'Help me write a [GENRE] story about [MAIN THEME/CONCEPT]. The setting is [TIME/PLACE] and the main character is [CHARACTER DESCRIPTION]. I want the tone to be [TONE] and approximately [LENGTH] long.',
		tags: ['writing', 'storytelling', 'creative'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},
	{
		id: 'creative-brainstorming',
		name: 'Creative Brainstorming',
		description:
			'Generate creative ideas for projects, content, or solutions',
		category: 'creative',
		prompt: 'I need creative ideas for [PROJECT/CHALLENGE]. The target audience is [AUDIENCE] and the goal is [OBJECTIVE]. Help me brainstorm innovative approaches and unique solutions.',
		tags: ['brainstorming', 'ideas', 'innovation'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},
	{
		id: 'creative-design-feedback',
		name: 'Design Feedback',
		description:
			'Get constructive feedback and suggestions for creative projects',
		category: 'creative',
		prompt: "I'm working on a [TYPE OF DESIGN] for [PURPOSE]. The concept is [DESCRIPTION] and my target audience is [AUDIENCE]. Can you provide feedback and suggestions for improvement?",
		tags: ['design', 'feedback', 'improvement'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},

	// Learning Templates
	{
		id: 'learning-concept-explanation',
		name: 'Concept Explanation',
		description:
			'Get clear explanations of complex topics and concepts',
		category: 'learning',
		prompt: "Explain [CONCEPT/TOPIC] to me as if I'm [BACKGROUND LEVEL]. I want to understand [SPECIFIC ASPECTS] and how it relates to [CONTEXT]. Please use examples and analogies to make it clear.",
		tags: ['explanation', 'learning', 'concept'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},
	{
		id: 'learning-study-plan',
		name: 'Study Plan Creation',
		description:
			'Create an effective study plan for learning new skills or subjects',
		category: 'learning',
		prompt: 'Help me create a study plan for [SUBJECT/SKILL]. I have [TIME AVAILABILITY] and want to reach [GOAL/LEVEL] by [DEADLINE]. My current knowledge level is [CURRENT LEVEL].',
		tags: ['study', 'planning', 'education'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},
	{
		id: 'learning-practice-questions',
		name: 'Practice Questions',
		description:
			'Generate practice questions and quizzes for study topics',
		category: 'learning',
		prompt: 'Create practice questions for [SUBJECT/TOPIC] at [DIFFICULTY LEVEL]. I want [NUMBER] questions covering [SPECIFIC AREAS]. Include both multiple choice and open-ended questions.',
		tags: ['practice', 'questions', 'quiz'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},

	// General Templates
	{
		id: 'general-problem-solving',
		name: 'Problem Solving',
		description:
			'Work through problems systematically with structured thinking',
		category: 'general',
		prompt: "I'm facing this problem: [PROBLEM DESCRIPTION]. The constraints are [CONSTRAINTS] and my goal is [DESIRED OUTCOME]. Help me break this down and find potential solutions.",
		tags: ['problem solving', 'analysis', 'solutions'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},
	{
		id: 'general-decision-making',
		name: 'Decision Making',
		description:
			'Get help making important decisions with pros and cons analysis',
		category: 'general',
		prompt: 'I need to decide between [OPTIONS]. The decision will affect [CONTEXT] and my priorities are [PRIORITIES]. Help me analyze the pros and cons of each option.',
		tags: ['decision', 'analysis', 'comparison'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},
	{
		id: 'general-research-help',
		name: 'Research Assistance',
		description:
			'Get help with research methodology and finding information',
		category: 'general',
		prompt: "I'm researching [TOPIC] for [PURPOSE]. I need to find information about [SPECIFIC ASPECTS] and my audience is [AUDIENCE]. Help me identify reliable sources and create a research strategy.",
		tags: ['research', 'information', 'sources'],
		isCustom: false,
		createdAt: new Date().toISOString(),
		usageCount: 0,
	},
];

export const templateCategories = [
	{ value: 'all', label: 'All Templates', color: 'gray' },
	{ value: 'work', label: 'Work', color: 'blue' },
	{
		value: 'personal',
		label: 'Personal',
		color: 'green',
	},
	{
		value: 'creative',
		label: 'Creative',
		color: 'purple',
	},
	{
		value: 'learning',
		label: 'Learning',
		color: 'orange',
	},
	{ value: 'general', label: 'General', color: 'gray' },
];

export class TemplateManager {
	private static STORAGE_KEY = 'conversation-templates';

	/**
	 * Get all templates (default + custom)
	 */
	static getAllTemplates(): ConversationTemplate[] {
		const customTemplates =
			TemplateManager.getCustomTemplates();
		return [...defaultTemplates, ...customTemplates];
	}

	/**
	 * Get custom templates from localStorage
	 */
	static getCustomTemplates(): ConversationTemplate[] {
		try {
			const stored = localStorage.getItem(
				TemplateManager.STORAGE_KEY
			);
			return stored ? JSON.parse(stored) : [];
		} catch (error) {
			console.error(
				'Error loading custom templates:',
				error
			);
			return [];
		}
	}

	/**
	 * Save custom templates to localStorage
	 */
	static saveCustomTemplates(
		templates: ConversationTemplate[]
	): void {
		try {
			localStorage.setItem(
				TemplateManager.STORAGE_KEY,
				JSON.stringify(templates)
			);
		} catch (error) {
			console.error(
				'Error saving custom templates:',
				error
			);
		}
	}

	/**
	 * Add a new custom template
	 */
	static addCustomTemplate(
		template: Omit<
			ConversationTemplate,
			'id' | 'isCustom' | 'createdAt' | 'usageCount'
		>
	): void {
		const newTemplate: ConversationTemplate = {
			...template,
			id: crypto.randomUUID(),
			isCustom: true,
			createdAt: new Date().toISOString(),
			usageCount: 0,
		};

		const customTemplates =
			TemplateManager.getCustomTemplates();
		customTemplates.push(newTemplate);
		TemplateManager.saveCustomTemplates(
			customTemplates
		);
	}

	/**
	 * Update template usage count
	 */
	static incrementUsageCount(templateId: string): void {
		// For default templates, we might store usage stats separately
		// For custom templates, update the stored data
		const customTemplates =
			TemplateManager.getCustomTemplates();
		const template = customTemplates.find(
			(t) => t.id === templateId
		);

		if (template) {
			template.usageCount++;
			TemplateManager.saveCustomTemplates(
				customTemplates
			);
		}

		// For default templates, we could store usage stats in a separate object
		// This is a simplified approach - in a real app you might want more sophisticated analytics
	}

	/**
	 * Delete a custom template
	 */
	static deleteCustomTemplate(templateId: string): void {
		const customTemplates =
			TemplateManager.getCustomTemplates();
		const filtered = customTemplates.filter(
			(t) => t.id !== templateId
		);
		TemplateManager.saveCustomTemplates(filtered);
	}

	/**
	 * Get templates by category
	 */
	static getTemplatesByCategory(
		category: string
	): ConversationTemplate[] {
		const allTemplates =
			TemplateManager.getAllTemplates();
		if (category === 'all') return allTemplates;
		return allTemplates.filter(
			(t) => t.category === category
		);
	}

	/**
	 * Search templates
	 */
	static searchTemplates(
		query: string
	): ConversationTemplate[] {
		const allTemplates =
			TemplateManager.getAllTemplates();
		const searchTerm = query.toLowerCase();

		return allTemplates.filter(
			(template) =>
				template.name
					.toLowerCase()
					.includes(searchTerm) ||
				template.description
					.toLowerCase()
					.includes(searchTerm) ||
				template.tags.some((tag) =>
					tag.toLowerCase().includes(searchTerm)
				) ||
				template.prompt
					.toLowerCase()
					.includes(searchTerm)
		);
	}
}
