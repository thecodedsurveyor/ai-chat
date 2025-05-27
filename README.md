# 🤖 AI Chatbot - Advanced Conversational AI Platform

A modern, feature-rich AI chatbot application built with React, TypeScript, and PWA technologies. Experience intelligent conversations with multiple AI personalities, offline functionality, and a beautiful mobile-first interface.

![AI Chatbot Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![PWA](https://img.shields.io/badge/PWA-Enabled-purple)
![Mobile](https://img.shields.io/badge/Mobile-Optimized-orange)

## 🌟 Key Features

### 🎭 AI Personalities & Roles

-   **10 Unique AI Personas**: AI Assistant, Teacher, Coding Assistant, Creative Writer, Business Analyst, Research Assistant, Life Coach, Comedian, Wellness Guide, and Chef
-   **Smart Context Switching**: Each persona maintains its own conversation style and expertise
-   **Category-Based Organization**: Browse personas by Assistant, Creative, Educational, Professional, and Fun categories
-   **Visual Persona Indicators**: Unique icons, colors, and descriptions for each personality
-   **Persistent Persona Memory**: Conversations remember which persona was used

### 🔗 Advanced Sharing & Export

-   **Simple Chat URLs**: Clean, short URLs for easy sharing (`#chat-abc123`)
-   **Flexible Text Sharing**: Include/exclude user messages, timestamps, and persona information
-   **Multiple Export Formats**:
    -   **Conversation**: Full chat history with all participants
    -   **Clean**: AI responses only for streamlined reading
    -   **Markdown**: Formatted text perfect for documentation
-   **One-Click Operations**: Copy URLs, copy formatted text, or download files instantly
-   **Cross-Platform Compatibility**: Share across any device or platform

### 📱 Progressive Web App (PWA)

-   **Native App Experience**: Install on any device like a native application
-   **Offline Functionality**: Read conversations without internet connection
-   **Background Sync**: Automatic data synchronization when connection returns
-   **Push Notifications**: Ready for future notification features
-   **Cross-Platform**: Works on iOS, Android, Windows, macOS, and Linux
-   **Responsive Design**: Optimized for phones, tablets, and desktops

### 💾 Intelligent Storage & Sync

-   **IndexedDB Integration**: Persistent local storage for all conversations
-   **Automatic Caching**: Conversations saved automatically for offline access
-   **Smart Sync**: Background synchronization with seamless conflict resolution
-   **Network Monitoring**: Real-time connection status with visual indicators
-   **Storage Management**: Efficient data handling with cleanup utilities

### 🎨 Modern User Interface

-   **Clean Navigation**: Unified sidebar with organized feature access
-   **Mobile-First Design**: Touch-optimized interface with intuitive gestures
-   **Dark/Light Themes**: Beautiful themes that adapt to system preferences
-   **Real-Time Status**: Live network and message count indicators
-   **Smooth Animations**: Polished transitions and micro-interactions

### 🔖 Smart Bookmarks

-   **AI-Suggested Bookmarks**: Automatically detect important conversation moments
-   **Smart Categorization**: Organize bookmarks by importance and topics
-   **Easy Management**: Accept, reject, or organize AI suggestions
-   **Search & Filter**: Find bookmarks quickly by content or tags

### 🧠 Smart Memory System

-   **Context Awareness**: Remember previous conversations and user preferences
-   **User Profile Learning**: Adapt to communication style and interests
-   **Topic Tracking**: Maintain context across sessions
-   **Intelligent Summaries**: Automatic conversation summarization

## 🚀 Quick Start

### Prerequisites

-   Node.js 16+ and npm
-   Modern web browser (Chrome, Firefox, Safari, Edge)
-   OpenRouter API key for AI functionality

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd ai-chatbot
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    ```bash
    # Create .env file in project root
    echo "VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here" > .env
    ```

    **Important**: Replace `your_openrouter_api_key_here` with your actual OpenRouter API key from https://openrouter.ai/keys

    Your API key should look like: `sk-or-v1-1234567890abcdef...`

4. **Add PWA icons** (Optional for full PWA experience)

    - Add `icon-192x192.png` to `public/` directory
    - Add `icon-512x512.png` to `public/` directory

5. **Start development server**

    ```bash
    npm run dev
    ```

6. **Open in browser**
    - Navigate to `http://localhost:5173` (or shown port)
    - For PWA testing, use `http://localhost:5173` in Chrome/Edge

## 📖 Usage Guide

### Getting Started

1. **Start a Conversation**: Type a message in the input field and press Enter
2. **Choose AI Persona**: Click the persona button to select from 10 different AI personalities
3. **Manage Chats**: Use the sidebar to create, organize, and switch between conversations
4. **Search History**: Find past conversations using the advanced search feature

### Advanced Features

#### 🎭 Using AI Personas

-   Click the **persona button** (👤) in the sidebar
-   Browse by category or search by name/description
-   Select a persona to apply it to your current conversation
-   Each persona brings unique expertise and conversation style

#### 📤 Sharing Conversations

-   Click the **share button** (📤) when viewing a chat
-   **Copy Chat URL**: Get a simple link to share the conversation
-   **Copy Text**: Customize format and copy formatted conversation text
-   **Download**: Save conversation as a text file

#### 🔍 Finding Conversations

-   Use **Search** (🔍) to find conversations by content, title, or metadata
-   Filter by date, persona, or conversation length
-   **Favorites** (⭐) to bookmark important conversations
-   **Analytics** (📊) to view usage statistics and insights

#### 📝 Quick Tools

-   **Templates** (📝): Use pre-built conversation starters
-   **Quick Responses**: Access common responses and prompts
-   **Voice Controls**: Voice input and playback (when supported)

### Mobile Experience

-   **3-Row Navigation**: Organized feature layout in the sidebar
    -   **Row 1**: Search, Analytics, Persona selection
    -   **Row 2**: Templates, Favorites
    -   **Row 3**: Share (when available), New Chat
-   **Touch-Optimized**: Large buttons designed for finger navigation
-   **Gesture Support**: Swipe to open/close sidebar
-   **Offline Reading**: Access cached conversations without internet

## 🛠️ Technology Stack

### Frontend

-   **React 18** - Modern UI library with hooks
-   **TypeScript** - Type-safe development
-   **Vite** - Fast build tool and dev server
-   **Tailwind CSS** - Utility-first styling
-   **Lucide React** - Beautiful icons

### Storage & Sync

-   **IndexedDB** - Browser-native persistent storage
-   **LocalStorage** - Quick access data and preferences
-   **Service Worker** - Background sync and caching

### AI Integration

-   **OpenRouter API** - Access to multiple AI models
-   **Persona Management** - Custom AI personality system
-   **Context Awareness** - Conversation memory and continuity

### PWA Technologies

-   **Service Worker** - Offline functionality and caching
-   **Web App Manifest** - Native app installation
-   **Background Sync** - Data synchronization
-   **Responsive Design** - Cross-device compatibility

## 📱 PWA Installation

### Desktop (Chrome/Edge)

1. Visit the application URL
2. Look for install prompt or click the install icon in address bar
3. Click "Install" to add to your desktop

### Mobile (iOS Safari)

1. Open the app in Safari
2. Tap the share button
3. Select "Add to Home Screen"
4. Confirm installation

### Mobile (Android Chrome)

1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen" or "Install app"
4. Confirm installation

## 🔧 Development

### Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview production build
-   `npm run lint` - Run ESLint checks

### Project Structure

```
src/
├── components/          # React components
│   ├── analytics/      # Analytics and statistics
│   ├── chat/          # Main chat interface
│   ├── forms/         # Form components
│   ├── layout/        # Layout components
│   ├── search/        # Search functionality
│   ├── ui/            # UI components
│   └── voice/         # Voice controls
├── contexts/           # React contexts
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── styles/            # Global styles
```

### Key Components

-   `ChatBotApp.tsx` - Main application component
-   `PersonaSelector.tsx` - AI persona selection
-   `ChatShareDialog.tsx` - Sharing functionality
-   `AdvancedSearch.tsx` - Search interface
-   `PWAPrompt.tsx` - PWA installation prompt

## 🌐 Browser Support

| Browser | Desktop | Mobile  | PWA Support  |
| ------- | ------- | ------- | ------------ |
| Chrome  | ✅ Full | ✅ Full | ✅ Excellent |
| Edge    | ✅ Full | ✅ Full | ✅ Excellent |
| Safari  | ✅ Full | ✅ Full | ⚠️ Limited   |
| Firefox | ✅ Full | ✅ Full | ⚠️ Limited   |

## 🔒 Privacy & Security

-   **Local-First**: All data stored locally in your browser
-   **No Data Collection**: No personal information sent to external servers
-   **API Security**: OpenRouter API key stored securely in environment variables
-   **Offline Capable**: Core functionality works without internet connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Built with React 18+ and TypeScript
-   Styled with Tailwind CSS
-   Icons from Boxicons and Font Awesome
-   Voice processing using Web Speech API

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include browser version and steps to reproduce

---

**Built with ❤️ using React, TypeScript, and modern web technologies**

_Experience the future of AI conversation with offline capability, multiple personalities, and beautiful design._

# AI Chatbot - Advanced Features

A modern, feature-rich AI chatbot application built with React, TypeScript, and Tailwind CSS. This application includes advanced features like Smart Bookmarks and Smart Memory System.

## 🚀 Features

### Core Features

-   **Responsive Chat Interface**: Modern UI with dark/light themes
-   **Multiple Chat Management**: Create, organize, and manage multiple conversations
-   **Voice Controls**: Speech-to-text and text-to-speech capabilities
-   **PWA Support**: Offline functionality and app-like experience
-   **Analytics Dashboard**: Comprehensive chat analytics and insights

### Advanced AI Features

#### 🔖 Smart Bookmarks

AI-powered bookmark suggestions for important conversations:

-   **Automatic detection**: AI identifies important moments
-   **Smart categorization**: Organized by importance and topics
-   **Easy management**: Accept, reject, or organize bookmarks
-   **Search & filter**: Find bookmarks quickly

#### 🧠 Smart Memory System

Persistent conversation memory for better continuity:

-   **Context awareness**: AI remembers previous conversations
-   **User preferences**: Learns your communication style
-   **Topic tracking**: Maintains context across sessions
-   **Intelligent summaries**: Automatic conversation summarization

## 📋 Installation

### Prerequisites

-   Node.js 16+ and npm
-   Modern web browser with ES6+ support

### Basic Setup

```bash
# Clone the repository
git clone <repository-url>
cd ai-chatbot

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠️ Development

### Project Structure

```
src/
├── components/           # React components
│   ├── chat/            # Chat-related components
│   ├── ui/              # Reusable UI components
│   └── voice/           # Voice control components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and classes
└── styles/              # Global styles
```

### Building for Production

```bash
npm run build
```

### Key Architecture Components

#### Smart Features Integration

-   **Memory System**: `src/utils/smartMemory.ts`
-   **Bookmarks**: `src/utils/smartBookmarks.ts`
-   **Main App**: `src/components/chat/ChatBotApp.tsx`

## 📱 Usage

### Smart Bookmarks

1. AI automatically analyzes messages for important content
2. Bookmark suggestions appear for significant moments
3. Accept or reject AI suggestions
4. Manage bookmarks in the dedicated interface
5. Search and filter bookmarks by topic or importance

### Smart Memory

1. System automatically extracts context from conversations
2. User preferences and communication style are learned
3. Previous conversation context is maintained across sessions
4. Memory enhances AI responses with relevant background

## 🎨 Customization

### Themes

The app supports dark/light themes with a custom color palette:

-   Primary colors: Pink, Purple, Orange gradients
-   Dark mode: Deep backgrounds with accent colors
-   Light mode: Clean whites with colorful accents

### Voice Settings

-   Adjustable speech rate, pitch, and volume
-   Multiple language support
-   Noise suppression options
-   Custom voice selection

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Add any API keys or configuration here
VITE_APP_NAME="AI Chatbot"
```

### Customizing AI Personas

Edit `src/utils/aiPersonas.ts` to add custom AI personalities with different behavior patterns.

## 📊 Analytics & Insights

The built-in analytics dashboard provides:

-   **Usage Statistics**: Message counts, conversation trends
-   **Response Metrics**: AI response times and patterns
-   **Topic Analysis**: Conversation topic tracking
-   **Favorites Tracking**: Most bookmarked content analysis

## 🚀 Advanced Features

### PWA Capabilities

-   **Offline Support**: Continue chatting without internet
-   **App Installation**: Install as native app on mobile/desktop
-   **Background Sync**: Sync conversations when online
-   **Push Notifications**: Stay updated with important messages

### Voice Integration

-   **Speech Recognition**: Convert speech to text input
-   **Voice Synthesis**: AI responses read aloud
-   **Voice Commands**: Control app with voice commands
-   **Multiple Languages**: Support for various languages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Built with React 18+ and TypeScript
-   Styled with Tailwind CSS
-   Icons from Boxicons and Font Awesome
-   Voice processing using Web Speech API

---

For detailed technical documentation, see [FEATURES_IMPLEMENTATION.md](FEATURES_IMPLEMENTATION.md).
