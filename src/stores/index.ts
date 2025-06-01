// Phase 1: UI Store exports
export {
	useUIStore,
	useChatListState,
	useEmojiPickerState,
	useQuickResponsesState,
	useSettingsState,
	useAdvancedSearchState,
	useConversationTemplatesState,
	useFavoritesViewerState,
	usePersonaSelectorState,
	useChatShareDialogState,
} from './uiStore';

// Phase 2: Input Store exports
export { useInputStore, useInputValue } from './inputStore';

// Phase 3: Chat Store exports
export {
	useChatStore,
	useMessages,
	useChats,
	useActiveChat,
	useIsTyping,
	useSearchResults,
	useIsSearching,
} from './chatStore';

// Future phases will add more stores here
// export { useSettingsStore } from './settingsStore';
