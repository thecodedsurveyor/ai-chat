import {
	BrowserRouter as Router,
	Routes,
	Route,
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
} from './pages';
import { ChatProvider } from './contexts/ChatContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ScrollToTop from './components/ui/ScrollToTop';
import BackToTop from './components/ui/BackToTop';
import { useChats } from './stores/chatStore';

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
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<ToastProvider>
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
								element={<ProfilePage />}
							/>

							{/* Settings page route */}
							<Route
								path='/settings'
								element={<SettingsPage />}
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
							{/* Dedicated AI Chat route */}
							<Route
								path='/ai-chat'
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
									<AnalyticsPageWrapper />
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
						</Routes>
					</Router>
				</ToastProvider>
			</ThemeProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
};

export default App;
