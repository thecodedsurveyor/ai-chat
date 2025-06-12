import React, { useState, useCallback } from 'react';
import type {
	ConversationTemplate,
	AIPersona,
} from '../../../types';

import AdvancedSearch from '../../search/AdvancedSearch';
import ChatManager from './ChatManager';
import ConversationTemplates from '../../forms/ConversationTemplates';
import FavoritesViewer from './FavoritesViewer';
import PersonaSelector from './PersonaSelector';

import ChatShareDialog from './ChatShareDialog';
import SettingsPage from '../../settings/SettingsPage';
import QuickResponses from '../input/QuickResponses';
import TemplatesModal from '../input/TemplatesModal';

// Zustand store imports
import { useUIStore } from '../../../stores/uiStore';
import {
	useChatStore,
	useChats,
	useSearchResults,
	useIsSearching,
	useActiveChat,
} from '../../../stores/chatStore';
import { useInputStore } from '../../../stores/inputStore';
import { settingsManager } from '../../../utils/settings';

const ModalContainer: React.FC = () => {
	// Get UI state from store
	const {
		showAdvancedSearch,
		closeAdvancedSearch,
		showConversationTemplates,
		closeConversationTemplates,
		showFavoritesViewer,
		closeFavoritesViewer,
		showPersonaSelector,
		closePersonaSelector,

		showChatShareDialog,
		closeChatShareDialog,
		showSettings,
		closeSettings,
		showQuickResponses,
		closeQuickResponses,
		showUnifiedTemplates,
		closeUnifiedTemplates,
	} = useUIStore();

	// Get chat data from store
	const {
		searchChats,
		setActiveChat,
		updateChat,
		setActivePersona,
	} = useChatStore();
	const chats = useChats();
	const searchResults = useSearchResults();
	const isSearching = useIsSearching();
	const activeChat = useActiveChat();

	// Get input store for quick responses
	const { updateInputValue } = useInputStore();

	// Local state for modals that need it
	const [managingChat, setManagingChat] = useState<
		string | null
	>(null);

	// Get app settings
	const appSettings = settingsManager.getSettings();

	// Local handlers
	const handleSearch = useCallback(
		(params: unknown) => {
			searchChats(
				params as Parameters<typeof searchChats>[0]
			);
		},
		[searchChats]
	);

	const handleSearchResultSelect = useCallback(
		(result: { chat: { id: string } }) => {
			setActiveChat(result.chat.id);
			closeAdvancedSearch();
		},
		[setActiveChat, closeAdvancedSearch]
	);

	const handleChatUpdate = useCallback(
		(
			chatId: string,
			updates: Record<string, unknown>
		) => {
			updateChat(chatId, updates);
			setManagingChat(null);
		},
		[updateChat]
	);

	const handleConversationTemplateSelect = useCallback(
		(template: { prompt: string }) => {
			// Set the input value with the template prompt
			updateInputValue({
				target: { value: template.prompt },
			} as React.ChangeEvent<HTMLInputElement>);
			closeConversationTemplates();
		},
		[updateInputValue, closeConversationTemplates]
	);

	const handleChatSelect = useCallback(
		(chatId: string) => {
			setActiveChat(chatId);
		},
		[setActiveChat]
	);

	const handleSettingsChange = useCallback(
		(newSettings: Record<string, unknown>) => {
			settingsManager.updateSettings(newSettings);
		},
		[]
	);

	const handleQuickResponseSelect = useCallback(
		(prompt: string) => {
			updateInputValue({
				target: { value: prompt },
			} as React.ChangeEvent<HTMLInputElement>);
			closeQuickResponses();
		},
		[updateInputValue, closeQuickResponses]
	);

	// Unified Templates handlers
	const handleUnifiedQuickResponseSelect = useCallback(
		(prompt: string) => {
			updateInputValue({
				target: { value: prompt },
			} as React.ChangeEvent<HTMLInputElement>);
			closeUnifiedTemplates();
		},
		[updateInputValue, closeUnifiedTemplates]
	);

	const handleUnifiedTemplateSelect = useCallback(
		(template: ConversationTemplate) => {
			updateInputValue({
				target: { value: template.prompt },
			} as React.ChangeEvent<HTMLInputElement>);
			closeUnifiedTemplates();
		},
		[updateInputValue, closeUnifiedTemplates]
	);

	// Persona selector handlers
	const handlePersonaSelect = useCallback(
		(persona: AIPersona) => {
			setActivePersona(persona);
			closePersonaSelector();
		},
		[setActivePersona, closePersonaSelector]
	);

	return (
		<>
			{/* Advanced Search Modal */}
			<AdvancedSearch
				isVisible={showAdvancedSearch}
				onClose={closeAdvancedSearch}
				onSearch={handleSearch}
				onResultSelect={handleSearchResultSelect}
				results={searchResults}
				isSearching={isSearching}
				totalResults={searchResults.length}
			/>

			{/* Chat Manager Modal */}
			{managingChat && (
				<ChatManager
					chat={
						chats.find(
							(c) => c.id === managingChat
						)!
					}
					onUpdate={handleChatUpdate}
					onClose={() => setManagingChat(null)}
					isVisible={!!managingChat}
				/>
			)}

			{/* Conversation Templates */}
			<ConversationTemplates
				isVisible={showConversationTemplates}
				onClose={closeConversationTemplates}
				onSelectTemplate={
					handleConversationTemplateSelect
				}
			/>

			{/* Favorites Viewer */}
			<FavoritesViewer
				chats={chats}
				isVisible={showFavoritesViewer}
				onClose={closeFavoritesViewer}
				onSelectChat={handleChatSelect}
			/>

			{/* Chat Share Dialog */}
			{activeChat && (
				<ChatShareDialog
					isVisible={showChatShareDialog}
					onClose={closeChatShareDialog}
					chat={
						chats.find(
							(c) => c.id === activeChat
						)!
					}
				/>
			)}

			{/* Settings Modal */}
			<SettingsPage
				isVisible={showSettings}
				onClose={closeSettings}
				settings={appSettings}
				onSettingsChange={handleSettingsChange}
			/>

			{/* Quick Responses Modal */}
			<QuickResponses
				isVisible={showQuickResponses}
				onClose={closeQuickResponses}
				onSelectResponse={handleQuickResponseSelect}
			/>

			{/* Templates Modal */}
			<TemplatesModal
				isVisible={showUnifiedTemplates}
				onClose={closeUnifiedTemplates}
				onSelectQuickResponse={
					handleUnifiedQuickResponseSelect
				}
				onSelectTemplate={
					handleUnifiedTemplateSelect
				}
			/>

			{/* Persona Selector Modal */}
			<PersonaSelector
				isVisible={showPersonaSelector}
				onClose={closePersonaSelector}
				onPersonaSelect={handlePersonaSelect}
			/>
		</>
	);
};

export default ModalContainer;
