import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Basic middleware
app.use(
	cors({
		origin: [
			'http://localhost:5173',
			'http://localhost:5179',
			'http://localhost:5177',
		],
		credentials: true,
	})
);
app.use(express.json());

// Define interfaces for better typing
interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	createdAt: string;
}

interface Session {
	userId: string;
	token: string;
	expiresAt: string;
}

// In-memory storage for demo (replace with database later)
const users: User[] = [];
const sessions: Session[] = [];

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
	res.json({
		success: true,
		message: 'Server is running',
		timestamp: new Date().toISOString(),
	});
});

// Registration endpoint
app.post(
	'/api/auth/register',
	(req: Request, res: Response): void => {
		try {
			const { email, password, firstName, lastName } =
				req.body;

			// Check if user already exists
			const existingUser = users.find(
				(user) => user.email === email
			);
			if (existingUser) {
				res.status(400).json({
					success: false,
					message:
						'User already exists with this email',
				});
				return;
			}

			// Create new user (in production, hash the password)
			const newUser: User = {
				id: Date.now().toString(),
				email,
				firstName,
				lastName,
				password, // In production, this should be hashed
				createdAt: new Date().toISOString(),
			};

			users.push(newUser);

			// Create session token (simplified)
			const token = `token_${Date.now()}_${Math.random()}`;
			sessions.push({
				userId: newUser.id,
				token,
				expiresAt: new Date(
					Date.now() + 7 * 24 * 60 * 60 * 1000
				).toISOString(),
			});

			// Return user without password
			const userWithoutPassword = {
				id: newUser.id,
				email: newUser.email,
				firstName: newUser.firstName,
				lastName: newUser.lastName,
				createdAt: newUser.createdAt,
			};

			res.status(201).json({
				success: true,
				message: 'User registered successfully',
				data: {
					user: userWithoutPassword,
					token,
				},
			});
		} catch (error) {
			console.error('Registration error:', error);
			res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	}
);

// Login endpoint
app.post(
	'/api/auth/login',
	(req: Request, res: Response): void => {
		try {
			const { email, password } = req.body;

			// Find user
			const user = users.find(
				(u) => u.email === email
			);
			if (!user) {
				res.status(401).json({
					success: false,
					message: 'Invalid email or password',
				});
				return;
			}

			// Check password (in production, compare hashed passwords)
			if (user.password !== password) {
				res.status(401).json({
					success: false,
					message: 'Invalid email or password',
				});
				return;
			}

			// Create session token
			const token = `token_${Date.now()}_${Math.random()}`;
			sessions.push({
				userId: user.id,
				token,
				expiresAt: new Date(
					Date.now() + 7 * 24 * 60 * 60 * 1000
				).toISOString(),
			});

			// Return user without password
			const userWithoutPassword = {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				createdAt: user.createdAt,
			};

			res.json({
				success: true,
				message: 'Login successful',
				data: {
					user: userWithoutPassword,
					token,
				},
			});
		} catch (error) {
			console.error('Login error:', error);
			res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	}
);

// Logout endpoint
app.post(
	'/api/auth/logout',
	(req: Request, res: Response) => {
		try {
			const token =
				req.headers.authorization?.replace(
					'Bearer ',
					''
				);

			if (token) {
				// Remove session
				const sessionIndex = sessions.findIndex(
					(s) => s.token === token
				);
				if (sessionIndex > -1) {
					sessions.splice(sessionIndex, 1);
				}
			}

			res.json({
				success: true,
				message: 'Logout successful',
			});
		} catch (error) {
			console.error('Logout error:', error);
			res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	}
);

// Test auth endpoint
app.post(
	'/api/auth/test',
	(req: Request, res: Response) => {
		res.json({
			success: true,
			message: 'Auth endpoint working',
			data: req.body,
		});
	}
);

app.listen(PORT, () => {
	console.log(`🚀 Simple server running on port ${PORT}`);
	console.log(
		`📊 Health check: http://localhost:${PORT}/health`
	);
	console.log(`🔐 Auth endpoints available:`);
	console.log(`   POST /api/auth/register`);
	console.log(`   POST /api/auth/login`);
	console.log(`   POST /api/auth/logout`);
});

export default app;
