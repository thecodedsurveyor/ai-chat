import '@testing-library/jest-dom';

interface WebSocketEvent {
	data?: string;
	code?: number;
	reason?: string;
}

// Mock the WebSocket
global.WebSocket = class MockWebSocket {
	onopen: (() => void) | null = null;
	onmessage: ((event: WebSocketEvent) => void) | null =
		null;
	onerror: ((error: Error) => void) | null = null;
	onclose: ((event: WebSocketEvent) => void) | null =
		null;
	readyState = WebSocket.OPEN;

	static CONNECTING = 0;
	static OPEN = 1;
	static CLOSING = 2;
	static CLOSED = 3;

	constructor(url: string) {
		console.log('MockWebSocket created with URL:', url);
	}

	send(data: string) {
		console.log('MockWebSocket send:', data);
	}

	close() {
		console.log('MockWebSocket closed');
	}
} as unknown as typeof WebSocket;

interface MediaRecorderEvent {
	data: Blob;
}

// Mock the MediaRecorder
global.MediaRecorder = class MockMediaRecorder {
	ondataavailable:
		| ((event: MediaRecorderEvent) => void)
		| null = null;
	onstop: (() => void) | null = null;
	onerror: ((error: Error) => void) | null = null;
	state: 'inactive' | 'recording' | 'paused' = 'inactive';

	static isTypeSupported(type: string): boolean {
		return true;
	}

	constructor(stream: MediaStream) {
		console.log(
			'MockMediaRecorder created with stream:',
			stream
		);
	}

	start() {
		console.log('MockMediaRecorder started');
		this.state = 'recording';
	}

	stop() {
		console.log('MockMediaRecorder stopped');
		this.state = 'inactive';
	}
} as unknown as typeof MediaRecorder;
