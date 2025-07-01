import React, { useEffect } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ChatBotApp from './components/chat/ChatBotApp';
import LandingPage from './components/layout/LandingPage';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import PageWrapper from './components/layout/PageWrapper';
import AnalyticsPage from './pages/AnalyticsPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import {
	Contact,
	Terms,
	Privacy,
	About,
	Pricing,
	Blog,
	Careers,
	CookiePolicy,
	GDPR,
	HelpCenter,
	Status,
	Features,
	EmailVerificationPage,
} from './pages';
import { ChatProvider } from './contexts/ChatContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ui/ToastContainer';
import ScrollToTop from './components/ui/ScrollToTop';
import BackToTop from './components/ui/BackToTop';
import OfflineIndicator from './components/ui/OfflineIndicator';
import PWAInstallPrompt from './components/ui/PWAInstallPrompt';
import { useChats } from './stores/chatStore';
import AdminAuth from './components/admin/AdminAuth';
import { authService } from './services/authService';
import { useChatStore } from './stores/chatStore';
import ProtectedRoute from './components/auth/ProtectedRoute';

const queryClient = new QueryClient();

// Wrapper component to provide chats data to AnalyticsPage
const AnalyticsPageWrapper = () => {
	// Use Zustand store instead of ChatContext for real-time data
	const chats = useChats();
	return (
		<PageWrapper>
			<AnalyticsPage chats={chats} />
		</PageWrapper>
	);
};

const App = () => {
	// Load user chats on app start if user is already authenticated
	useEffect(() => {
		const loadUserChatsOnStart = async () => {
			if (authService.isAuthenticated()) {
				try {
					const chatStore =
						useChatStore.getState();
					if (chatStore.loadChatsFromBackend) {
						await chatStore.loadChatsFromBackend();
					}
				} catch (error) {
					console.error(
						'Failed to load user chats on app start:',
						error
					);
				}
			}
		};

		loadUserChatsOnStart();
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<ToastProvider>
					<ToastContainer>
						<OfflineIndicator />
						<PWAInstallPrompt />
						<Router>
							<ScrollToTop />
							<Routes>
								{/* Auth page route */}
								<Route
									path='/auth'
									element={<AuthPage />}
								/>

								{/* Profile page route */}
								<Route
									path='/profile'
									element={
										<ProtectedRoute>
											<PageWrapper>
												<ProfilePage />
											</PageWrapper>
										</ProtectedRoute>
									}
								/>

								{/* Settings page route */}
								<Route
									path='/settings'
									element={
										<ProtectedRoute>
											<PageWrapper>
												<SettingsPage />
											</PageWrapper>
										</ProtectedRoute>
									}
								/>

								{/* Reset password route */}
								<Route
									path='/reset-password'
									element={
										<PageWrapper>
											<ResetPasswordPage />
										</PageWrapper>
									}
								/>

								{/* Email verification route */}
								<Route
									path='/verify-email'
									element={
										<PageWrapper>
											<EmailVerificationPage />
										</PageWrapper>
									}
								/>

								{/* Landing page and other routes */}
								<Route
									path='/'
									element={
										<PageWrapper>
											<Navigation />
											<LandingPage />
											<Footer />
											<BackToTop />
										</PageWrapper>
									}
								/>
								<Route
									path='/about'
									element={
										<PageWrapper>
											<Navigation />
											<About />
											<Footer />
											<BackToTop />
										</PageWrapper>
									}
								/>
								<Route
									path='/contact'
									element={
										<PageWrapper>
											<Navigation />
											<Contact />
											<Footer />
											<BackToTop />
										</PageWrapper>
									}
								/>
								<Route
									path='/terms'
									element={
										<PageWrapper>
											<Navigation />
											<Terms />
											<Footer />
											<BackToTop />
										</PageWrapper>
									}
								/>
								<Route
									path='/privacy'
									element={
										<PageWrapper>
											<Navigation />
											<Privacy />
											<Footer />
											<BackToTop />
										</PageWrapper>
									}
								/>
								{/* Dedicated NeuronFlow Chat route - Now supports guest mode */}
								<Route
									path='/chat'
									element={
										<ChatProvider>
											<ChatBotApp />
										</ChatProvider>
									}
								/>
								{/* Analytics route */}
								<Route
									path='/analytics'
									element={
										<ProtectedRoute>
											<PageWrapper>
												<AnalyticsPageWrapper />
											</PageWrapper>
										</ProtectedRoute>
									}
								/>
								{/* Admin Dashboard route */}
								<Route
									path='/admin'
									element={
										<PageWrapper>
											<AdminAuth
												onLoginSuccess={(
													admin
												) => {
													console.log(
														'Admin logged in:',
														admin
													);
													// Handle admin login success
												}}
											/>
										</PageWrapper>
									}
								/>
								{/* New footer pages */}
								<Route
									path='/pricing'
									element={
										<PageWrapper>
											<Navigation />
											<Pricing />
											<Footer />
											<BackToTop />
										</PageWrapper>
									}
								/>
								<Route
									path='/blog'
									element={
										<PageWrapper>
											<Navigation />
											<Blog />
											<Footer />
											<BackToTop />
										</PageWrapper>
									}
								/>
								<Route
									path='/careers'
									element={
										<PageWrapper>
											<Navigation />
											<Careers />
											<Footer />
											<BackToTop />
										</PageWrapper>
									}
								/>
								<Route
									path='/cookies'
									element={
										<PageWrapper>
											<Navigation />
											<CookiePolicy />
											<Footer />
											<BackToTop />
										</PageWrapper>
									}
								/>
								<Route
									path='/gdpr'
									element={
										<PageWrapper>
											<Navigation />
											<GDPR />
											<Footer />
											<BackToTop />
										</PageWrapper>
									}
								/>
								<Route
									path='/help'
									element={
										<PageWrapper>
											<Navigation />
											<HelpCenter />
											<Footer />
											<BackToTop />
										</PageWrapper>
									}
								/>
								<Route
									path='/status'
									element={
										<PageWrapper>
											<Navigation />
											<Status />
											<Footer />
											<BackToTop />
										</PageWrapper>
									}
								/>
								{/* Public Routes */}
								<Route
									path='/features'
									element={
										<PageWrapper>
											<Navigation />
											<Features />
											<Footer />
											<BackToTop />
										</PageWrapper>
									}
								/>
								{/* Fallback route */}
								<Route
									path='*'
									element={
										<Navigate
											to='/'
											replace
										/>
									}
								/>
							</Routes>
						</Router>
					</ToastContainer>
				</ToastProvider>
			</ThemeProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
};

export default App;
