# Settings Features Implementation

## Overview

The AI Chatbot now includes a comprehensive settings system that allows users to customize their experience across multiple categories. The settings are accessible via a dedicated button in the mobile quick actions (Row 3) and provide extensive customization options.

## Features Implemented

### 1. **Appearance Settings**

-   **Theme Mode**: Light, Dark, and Auto (follows system preference)
-   **Color Schemes**: 6 predefined themes including:
    -   Default Light/Dark
    -   Ocean Blue
    -   Forest Green
    -   Sunset Orange
    -   Royal Purple
-   **Typography**:
    -   Font family selection (Inter, Roboto, Poppins, Open Sans, System)
    -   Font size options (XS, SM, MD, LG, XL)
    -   Line height adjustment
-   **Layout Modes**:
    -   Compact: Dense layout with minimal spacing
    -   Comfortable: Balanced spacing (default)
    -   Spacious: Generous spacing for better readability

### 2. **Accessibility Features**

-   **High Contrast**: Enhanced contrast for better visibility
-   **Reduced Motion**: Minimizes animations for users sensitive to motion
-   **Screen Reader Support**: Enhanced compatibility with assistive technologies
-   **Keyboard Navigation**: Full keyboard navigation support
-   **Focus Indicators**: Clear visual focus indicators
-   **Large Click Targets**: Increased button and link sizes for easier interaction

### 3. **Voice Navigation**

-   **Voice Commands**: 8 predefined commands including:
    -   "new chat" - Create a new conversation
    -   "open settings" - Open settings page
    -   "focus mode" - Toggle focus mode
    -   "search chats" - Open chat search
    -   "show analytics" - Open analytics dashboard
    -   "toggle sidebar" - Show/hide chat list
    -   "clear chat" - Clear current conversation
    -   "go home" - Navigate to home page
-   **Wake Word**: Customizable wake word (default: "hey assistant")
-   **Sensitivity Control**: Adjustable voice recognition sensitivity
-   **Action Confirmation**: Optional confirmation for destructive actions
-   **Individual Command Toggle**: Enable/disable specific voice commands

### 4. **Focus Mode**

-   **Distraction-Free Interface**: Hide UI elements for better concentration
-   **Background Dimming**: Reduce background brightness
-   **Notification Suppression**: Hide notifications during focus sessions
-   **Auto-Activation**: Automatically enable after period of inactivity
-   **Keyboard Shortcuts**:
    -   F11 or Ctrl+Shift+F to toggle
    -   Escape to exit focus mode
-   **Visual Indicators**: Focus mode indicator and exit button

### 5. **Privacy Settings**

-   **Analytics**: Control usage analytics collection
-   **Crash Reporting**: Enable/disable automatic crash reports
-   **Data Collection**: Control conversation data collection for improvements

### 6. **Advanced Settings**

-   **Animation Control**: Enable/disable animations with duration adjustment
-   **Reset to Defaults**: Complete settings reset functionality

## Technical Implementation

### Architecture

-   **Settings Manager**: Singleton pattern for centralized settings management
-   **Local Storage**: Persistent settings storage across sessions
-   **CSS Variables**: Dynamic theme application using custom properties
-   **Type Safety**: Full TypeScript support with comprehensive type definitions

### Key Components

-   `SettingsPage.tsx`: Main settings interface with category navigation
-   `settings.ts`: Settings manager utility with default configurations
-   `voiceNavigation.ts`: Voice command processing and speech recognition
-   `focusMode.ts`: Focus mode management with activity tracking
-   `index.css`: CSS variables and styling for all customization options

### Integration Points

-   **Mobile Quick Actions**: Settings button in Row 3 for easy access
-   **Voice Commands**: "open settings" voice command support
-   **Real-time Application**: Settings applied immediately without page refresh
-   **Change Tracking**: Unsaved changes indicator with save/discard options

## Usage

### Accessing Settings

1. **Mobile**: Tap the "Settings" button in the quick actions area (Row 3)
2. **Voice**: Say "open settings" (if voice navigation is enabled)
3. **Keyboard**: Use keyboard navigation to reach the settings button

### Customizing Appearance

1. Navigate to "Appearance" category
2. Select theme mode (Light/Dark/Auto)
3. Choose from 6 color schemes
4. Adjust typography (font family, size)
5. Select layout mode (Compact/Comfortable/Spacious)

### Enabling Voice Navigation

1. Go to "Voice Navigation" category
2. Toggle "Enable Voice Navigation"
3. Customize wake word and sensitivity
4. Enable/disable specific commands
5. Configure action confirmation preferences

### Activating Focus Mode

1. Access "Focus Mode" category
2. Enable focus mode
3. Configure UI hiding options
4. Set up auto-activation if desired
5. Use keyboard shortcuts for quick toggle

### Accessibility Configuration

1. Visit "Accessibility" category
2. Enable high contrast if needed
3. Turn on reduced motion for motion sensitivity
4. Configure keyboard navigation preferences
5. Enable large click targets for easier interaction

## Browser Compatibility

### Voice Navigation Requirements

-   Modern browsers with Web Speech API support
-   Chrome, Edge, Safari (latest versions)
-   Microphone permissions required

### General Compatibility

-   All modern browsers (Chrome, Firefox, Safari, Edge)
-   Responsive design for mobile and desktop
-   Progressive enhancement for older browsers

## Performance Considerations

-   **Lazy Loading**: Settings components loaded on demand
-   **Efficient Updates**: Only changed settings trigger re-renders
-   **CSS Variables**: Optimal theme switching performance
-   **Local Storage**: Minimal storage footprint with compression

## Future Enhancements

### Planned Features

-   Custom color scheme creation
-   Import/export settings
-   Settings sync across devices
-   Advanced voice command customization
-   Gesture navigation support

### Accessibility Improvements

-   Enhanced screen reader support
-   Voice-over navigation
-   High contrast theme variants
-   Dyslexia-friendly font options

## Troubleshooting

### Common Issues

1. **Voice commands not working**: Check microphone permissions and browser compatibility
2. **Settings not saving**: Verify local storage is enabled
3. **Theme not applying**: Clear browser cache and reload
4. **Focus mode stuck**: Press Escape key or refresh page

### Browser Permissions

-   **Microphone**: Required for voice navigation
-   **Local Storage**: Required for settings persistence
-   **Notifications**: Optional for system notifications

## Development Notes

### Adding New Settings

1. Update type definitions in `types/index.ts`
2. Add default values in `utils/settings.ts`
3. Implement UI in `SettingsPage.tsx`
4. Add CSS variables if needed in `index.css`

### Testing Settings

-   Test all theme combinations
-   Verify voice commands in supported browsers
-   Check accessibility with screen readers
-   Validate mobile responsiveness

## Conclusion

The settings system provides a comprehensive customization experience that enhances accessibility, usability, and user satisfaction. The modular architecture allows for easy extension and maintenance while ensuring optimal performance across all supported platforms.
