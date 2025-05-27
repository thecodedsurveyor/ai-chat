/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Speech Recognition API type declarations
interface SpeechRecognition extends EventTarget {
	continuous: boolean;
	grammars: SpeechGrammarList;
	interimResults: boolean;
	lang: string;
	maxAlternatives: number;
	serviceURI: string;

	abort(): void;
	start(): void;
	stop(): void;

	onaudioend:
		| ((this: SpeechRecognition, ev: Event) => any)
		| null;
	onaudiostart:
		| ((this: SpeechRecognition, ev: Event) => any)
		| null;
	onend:
		| ((this: SpeechRecognition, ev: Event) => any)
		| null;
	onerror:
		| ((
				this: SpeechRecognition,
				ev: SpeechRecognitionErrorEvent
		  ) => any)
		| null;
	onnomatch:
		| ((
				this: SpeechRecognition,
				ev: SpeechRecognitionEvent
		  ) => any)
		| null;
	onresult:
		| ((
				this: SpeechRecognition,
				ev: SpeechRecognitionEvent
		  ) => any)
		| null;
	onsoundend:
		| ((this: SpeechRecognition, ev: Event) => any)
		| null;
	onsoundstart:
		| ((this: SpeechRecognition, ev: Event) => any)
		| null;
	onspeechend:
		| ((this: SpeechRecognition, ev: Event) => any)
		| null;
	onspeechstart:
		| ((this: SpeechRecognition, ev: Event) => any)
		| null;
	onstart:
		| ((this: SpeechRecognition, ev: Event) => any)
		| null;
}

declare var SpeechRecognition: {
	prototype: SpeechRecognition;
	new (): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
	prototype: SpeechRecognition;
	new (): SpeechRecognition;
};

interface SpeechRecognitionEvent extends Event {
	readonly resultIndex: number;
	readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
	readonly error: string;
	readonly message: string;
}

interface SpeechRecognitionResultList {
	readonly length: number;
	item(index: number): SpeechRecognitionResult;
	[index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
	readonly isFinal: boolean;
	readonly length: number;
	item(index: number): SpeechRecognitionAlternative;
	[index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
	readonly confidence: number;
	readonly transcript: string;
}

interface SpeechGrammarList {
	readonly length: number;
	item(index: number): SpeechGrammar;
	[index: number]: SpeechGrammar;
	addFromString(string: string, weight?: number): void;
	addFromURI(src: string, weight?: number): void;
}

interface SpeechGrammar {
	src: string;
	weight: number;
}

declare var SpeechGrammarList: {
	prototype: SpeechGrammarList;
	new (): SpeechGrammarList;
};

declare var SpeechGrammar: {
	prototype: SpeechGrammar;
	new (): SpeechGrammar;
};

// Extend the Window interface
interface Window {
	SpeechRecognition: typeof SpeechRecognition;
	webkitSpeechRecognition: typeof webkitSpeechRecognition;
}
