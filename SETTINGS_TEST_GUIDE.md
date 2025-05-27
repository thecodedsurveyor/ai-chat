# Settings Features Test Guide - Simplified Version

## How to Test the Simplified Settings Features

### 1. **Access Settings**

-   Open the AI Chatbot application at `http://localhost:5187/`
-   Click the **Settings** button in Row 3 of the mobile quick actions
-   The settings page should open with 6 categories on the left

### 2. **Test Theme Mode (Light/Dark/Auto)**

#### Theme Mode Test:

1. Go to **Appearance** category
2. Try each theme mode:
    - **Light** - Should switch to light theme immediately
    - **Dark** - Should switch to dark theme immediately
    - **Auto** - Should follow your system's dark/light preference
3. **Expected Result**: The overall theme should switch immediately
4. **Check**: Background colors, text colors, and UI elements should change

### 3. **Test Typography**

#### Font Family Test:

1. In **Appearance** → **Typography**
2. Try different font families:
    - Inter, Roboto, Poppins, Open Sans, System Default
3. **Expected Result**: All text should change font immediately
4. **Check**: Message text, UI text, and input text

#### Font Size Test:

1. Adjust font size from XS to XL using the buttons
2. **Expected Result**: Text size should change throughout the app
3. **Check**: Message text, UI text, and input text

#### Line Height Test:

1. Use the slider to adjust line height from 1.2 to 2.0
2. **Expected Result**: Text line spacing should change immediately
3. **Check**: Text should become tighter or looser based on setting

### 4. **Test Layout Modes**

1. In **Appearance** → **Layout**
2. Try each layout mode:
    - **Compact**: Smaller spacing, tighter layout
    - **Comfortable**: Default balanced spacing
    - **Spacious**: Larger spacing, more breathing room
3. **Expected Result**: Message spacing and padding should change immediately

### 5. **Test Accessibility Features**

#### High Contrast Test:

1. Go to **Accessibility** category
2. Enable **High Contrast**
3. **Expected Result**: Colors should become more contrasted and borders more defined

#### Large Click Targets Test:

1. Enable **Large Click Targets**
2. **Expected Result**: All buttons and clickable elements should become larger (44px minimum)

#### Reduced Motion Test:

1. Enable **Reduced Motion**
2. **Expected Result**: All animations should become very fast or disabled
3. **Test**: Try opening/closing modals, hover effects should be minimal

### 6. **Test Focus Mode**

#### Manual Activation:

1. Go to **Focus Mode** category
2. Enable **Focus Mode**
3. **Expected Result**:
    - UI elements should become very faded (10% opacity)
    - Background should dim slightly
    - Focus mode indicator should appear: "🎯 Focus Mode Active"
    - Exit button (✕) should appear in top-right
    - Keyboard shortcut hint should appear at bottom

#### Keyboard Shortcuts:

1. Press **F11** or **Ctrl+Shift+F**
2. **Expected Result**: Focus mode should toggle on/off
3. Press **Escape** to exit focus mode

#### UI Interaction in Focus Mode:

1. When focus mode is active, hover over faded UI elements
2. **Expected Result**: Elements should become fully visible on hover
3. **Check**: Sidebar, navigation, and other UI elements

### 7. **Test Voice Navigation**

#### Enable Voice Navigation:

1. Go to **Voice Navigation** category
2. Enable **Voice Navigation**
3. Allow microphone permissions when prompted

#### Test Voice Commands:

1. Say the wake word: **"hey assistant"**
2. Try these commands:
    - "open settings" - Should open settings
    - "focus mode" - Should toggle focus mode
    - "new chat" - Should create new chat

### 8. **Test Settings Persistence**

1. Change several settings (theme, font, layout)
2. **Refresh the page**
3. **Expected Result**: All your settings should be preserved
4. **Check**: Theme, fonts, and layout should remain as you set them

### 9. **Test Reset to Defaults**

1. Go to **Advanced** category
2. Click **Reset to Defaults**
3. **Expected Result**: All settings should return to original defaults (Dark theme, Inter font, MD size, Comfortable layout)

## What's Been Simplified

### ✅ **Removed (Simplified)**

-   **Color Schemes**: No more Ocean Blue, Forest Green, etc. - just clean light/dark themes
-   **Complex Color Customization**: Simplified to the original beautiful light/dark themes

### ✅ **Kept (Essential Features)**

-   **Theme Mode**: Light, Dark, Auto (follows system)
-   **Typography**: Font family, size, line height
-   **Layout Modes**: Compact, Comfortable, Spacious
-   **Accessibility**: High contrast, reduced motion, large targets, etc.
-   **Focus Mode**: Distraction-free interface
-   **Voice Navigation**: Voice commands
-   **Settings Persistence**: All settings saved

## Expected Visual Changes

### Theme Mode Changes:

-   **Light**: Clean white background, dark text, blue accents
-   **Dark**: Dark background (#0d111a), white text, colorful gradients
-   **Auto**: Follows your system preference automatically

### Typography Changes:

-   **Font Family**: Immediate change across all text
-   **Font Size**: XS (12px) to XL (20px) scaling
-   **Line Height**: 1.2 (tight) to 2.0 (loose) spacing

### Layout Mode Changes:

-   **Compact**: Tight spacing, smaller padding (8px)
-   **Comfortable**: Balanced, default spacing (16px)
-   **Spacious**: Generous spacing, larger padding (24px)

### Focus Mode Changes:

-   **UI Fading**: Most UI elements become 10% opacity
-   **Background Dimming**: Subtle dark overlay
-   **Focus Indicator**: "🎯 Focus Mode Active" in top-left
-   **Exit Button**: ✕ button in top-right corner
-   **Keyboard Hint**: Instructions at bottom of screen

## Success Criteria

✅ **Settings Apply Immediately**: No page refresh needed
✅ **Settings Persist**: Survive page refreshes  
✅ **Visual Changes Obvious**: Clear difference between options
✅ **Focus Mode Works**: UI fades, overlay appears, keyboard shortcuts work
✅ **Voice Commands Work**: At least basic commands respond
✅ **Accessibility Features Work**: High contrast, large targets, reduced motion
✅ **No Console Errors**: Clean browser console
✅ **Responsive**: Works on mobile and desktop
✅ **Original Theme Preserved**: Beautiful original light/dark themes maintained

## Troubleshooting

### If Settings Don't Apply:

1. **Check Browser Console**: Press F12 and look for errors
2. **Check Body Classes**: Should have `settings-applied`, `dark`/`light`, layout classes
3. **Try Hard Refresh**: Ctrl+F5 to clear cache

### If Focus Mode Doesn't Work:

1. **Check CSS Classes**: Body should have `focus-mode` class when active
2. **Check Overlay**: Look for focus mode indicator and exit button
3. **Try Keyboard Shortcuts**: F11, Ctrl+Shift+F, or Escape

### If Themes Don't Switch:

1. **Check Body Classes**: Should toggle between `dark` and `light`
2. **Check Auto Mode**: Should follow system preference
3. **Verify Original Colors**: Dark mode should have gradients, light mode should be clean

The simplified settings now focus on the essential customization options while maintaining the beautiful original design aesthetic!
