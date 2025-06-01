# Auto-Suggestions Implementation

This document describes the implementation of auto-suggestions/auto-complete functionality in the AI Chatbot application.

## Overview

The auto-suggestions feature provides real-time suggestions as the user types in the chat input field. Once the user has typed at least 10 characters, the system automatically generates contextually relevant suggestions to complete their message. Users can navigate through suggestions using keyboard arrows and select with Tab or Enter.

## Key Components

1. **InputStore (Zustand)**

    - Added `autoSuggestions` array to store suggestion items
    - Added `selectedSuggestionIndex` to track the currently selected suggestion
    - Added methods for suggestion manipulation:
        - `setSuggestions`
        - `clearSuggestions`
        - `selectNextSuggestion`
        - `selectPrevSuggestion`
        - `getSelectedSuggestion`

2. **UIStore (Zustand)**

    - Added `showAutoSuggestions` toggle state
    - Added control methods:
        - `toggleAutoSuggestions`
        - `closeAutoSuggestions`

3. **SmartAutoComplete Component**

    - Uses OpenRouter API to generate contextually relevant suggestions
    - Handles suggestion display and selection
    - Provides visual feedback for the selected suggestion
    - Adapts to the application's light/dark theme

4. **ChatInput Integration**
    - Triggers auto-suggestions after the user types at least 10 characters
    - Manages keyboard navigation through suggestions
    - Applies selected suggestions to the input field

## User Experience

-   Suggestions appear automatically after typing 10+ characters
-   Arrow keys (↑/↓) navigate between suggestions
-   Tab or Enter selects the currently highlighted suggestion
-   Escape key dismisses the suggestions
-   Clicking outside the suggestions box closes it
-   The UI adapts to the current theme (light/dark mode)

## Implementation Notes

-   Suggestions are generated with a 500ms debounce to avoid excessive API calls
-   The component intelligently positions itself within the viewport to ensure visibility
-   Fallback suggestions are provided if the API call fails
-   The system handles errors gracefully to ensure uninterrupted user experience

## Future Enhancements

Potential improvements for the auto-suggestions feature:

1. User-specific suggestion learning based on frequently used phrases
2. Command suggestions for special functions (e.g., "/search", "/help")
3. Enhanced suggestion categories (questions, statements, requests)
4. Localization support for multilingual suggestions
