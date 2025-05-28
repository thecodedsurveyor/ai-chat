import React, { useState, useCallback } from 'react';
import type {
	MessageBookmark,
	AIPersona,
} from '../../../types';

import AdvancedSearch from '../../search/AdvancedSearch';
import ChatManager from './ChatManager';
import ConversationTemplates from '../../forms/ConversationTemplates';
import FavoritesViewer from './FavoritesViewer';
import PersonaSelector from './PersonaSelector';
import ChatShareDialog from './ChatShareDialog';
import BookmarksManager from './BookmarksManager';
import SettingsPage from '../../settings/SettingsPage';
import QuickResponses from '../input/QuickResponses';

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
import { PersonaManager } from '../../../utils/aiPersonas';

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
		showBookmarksManager,
		closeBookmarksManager,
		showSettings,
		closeSettings,
		showQuickResponses,
		closeQuickResponses,
	} = useUIStore();

	// Get chat data from store
	const { searchChats, setActiveChat, updateChat } =
		useChatStore();
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
	const [selectedPersona, setSelectedPersona] =
		useState<AIPersona>(() =>
			PersonaManager.getDefaultPersona()
		);

	const [bookmarks, setBookmarks] = useState<
		MessageBookmark[]
	>([]);

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

	const handlePersonaSelect = useCallback(
		(persona: AIPersona) => {
			setSelectedPersona(persona);
			closePersonaSelector();
		},
		[closePersonaSelector]
	);

	const handleBookmarkAccept = useCallback(
		(bookmarkId: string) => {
			setBookmarks((prev) =>
				prev.map((bookmark) =>
					bookmark.id === bookmarkId
						? { ...bookmark, isAccepted: true }
						: bookmark
				)
			);
		},
		[]
	);

	const handleBookmarkReject = useCallback(
		(bookmarkId: string) => {
			setBookmarks((prev) =>
				prev.filter(
					(bookmark) => bookmark.id !== bookmarkId
				)
			);
		},
		[]
	);

	const handleBookmarkDelete = useCallback(
		(bookmarkId: string) => {
			setBookmarks((prev) =>
				prev.filter(
					(bookmark) => bookmark.id !== bookmarkId
				)
			);
		},
		[]
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

			{/* Persona Selector */}
			<PersonaSelector
				selectedPersona={selectedPersona}
				isVisible={showPersonaSelector}
				onClose={closePersonaSelector}
				onPersonaSelect={handlePersonaSelect}
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

			{/* Bookmarks Manager Modal */}
			{showBookmarksManager && (
				<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'>
					<BookmarksManager
						bookmarks={bookmarks}
						onAcceptSuggestion={
							handleBookmarkAccept
						}
						onRejectSuggestion={
							handleBookmarkReject
						}
						onDeleteBookmark={
							handleBookmarkDelete
						}
						onClose={closeBookmarksManager}
					/>
				</div>
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
		</>
	);
};

export default ModalContainer;
