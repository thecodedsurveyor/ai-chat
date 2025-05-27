import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

type InteractiveEyeProps = {
	mousePosition: { x: number; y: number };
	isHovered: boolean;
	position?: [number, number, number];
};

const InteractiveEye = ({
	mousePosition,
	isHovered,
	position = [0, 0, 0],
}: InteractiveEyeProps) => {
	const groupRef = useRef<THREE.Group>(null);
	const eyeballRef = useRef<THREE.Mesh>(null);
	const pupilRef = useRef<THREE.Mesh>(null);
	const irisRef = useRef<THREE.Mesh>(null);
	const upperEyelidRef = useRef<THREE.Mesh>(null);
	const lowerEyelidRef = useRef<THREE.Mesh>(null);

	// Target positions for smooth animation
	const [targetRotation, setTargetRotation] = useState({
		x: 0,
		y: 0,
	});
	const [currentRotation, setCurrentRotation] = useState({
		x: 0,
		y: 0,
	});
	const [blinkTimer, setBlinkTimer] = useState(
		Math.random() * 3
	); // Random start time
	const [isBlinking, setIsBlinking] = useState(false);

	// Calculate eye rotation based on mouse position
	useEffect(() => {
		if (isHovered && mousePosition) {
			// Enhanced sensitivity for more dramatic movement
			const maxRotation = 0.8; // Increased for more visible movement

			// Center the mouse coordinates
			const centeredX = mousePosition.x - 0.5; // -0.5 to 0.5
			const centeredY = mousePosition.y - 0.5; // -0.5 to 0.5

			// Apply stronger movement with some easing
			const rotationX = centeredY * maxRotation;
			const rotationY = centeredX * maxRotation;

			setTargetRotation({
				x: rotationX,
				y: rotationY,
			});
		} else {
			// Return to center when not hovered
			setTargetRotation({ x: 0, y: 0 });
		}
	}, [mousePosition, isHovered]);

	// Smooth animation frame
	useFrame((state) => {
		// Faster response when hovered for more interactive feel
		const lerp = isHovered ? 0.2 : 0.1;
		setCurrentRotation((prev) => ({
			x: prev.x + (targetRotation.x - prev.x) * lerp,
			y: prev.y + (targetRotation.y - prev.y) * lerp,
		}));

		// Apply rotation to pupil and iris with enhanced movement
		if (pupilRef.current && irisRef.current) {
			// Increased pupil movement for better visibility
			const pupilMovement = 0.5; // Increased for more dramatic effect
			pupilRef.current.position.x =
				currentRotation.y * pupilMovement;
			pupilRef.current.position.y =
				-currentRotation.x * pupilMovement;

			// Move iris with pupil
			irisRef.current.position.x =
				currentRotation.y * pupilMovement * 0.8;
			irisRef.current.position.y =
				-currentRotation.x * pupilMovement * 0.8;
		}

		// Add subtle floating animation when not hovered
		if (eyeballRef.current && !isHovered) {
			eyeballRef.current.rotation.y =
				Math.sin(state.clock.elapsedTime * 0.3) *
				0.05;
			eyeballRef.current.position.y =
				Math.sin(state.clock.elapsedTime * 0.5) *
				0.02;
		}

		// Blinking animation with random intervals
		setBlinkTimer((prev) => prev + 0.016);
		const blinkInterval = isHovered
			? 6
			: 4 + Math.random() * 2; // Blink less when being watched

		if (blinkTimer > blinkInterval && !isBlinking) {
			setIsBlinking(true);
			setBlinkTimer(0);
		}

		if (isBlinking) {
			const blinkProgress = Math.min(
				blinkTimer * 12,
				1
			); // Very fast blink
			const blinkScale =
				1 -
				Math.sin(blinkProgress * Math.PI) * 0.95;

			if (
				upperEyelidRef.current &&
				lowerEyelidRef.current
			) {
				upperEyelidRef.current.scale.y = blinkScale;
				lowerEyelidRef.current.scale.y = blinkScale;
			}

			if (blinkProgress >= 1) {
				setIsBlinking(false);
				setBlinkTimer(Math.random() * 2); // Random next blink time
			}
		}

		// Scale effect on hover
		if (groupRef.current) {
			const targetScale = isHovered ? 1.15 : 1; // Slightly more dramatic scale
			groupRef.current.scale.lerp(
				new THREE.Vector3(
					targetScale,
					targetScale,
					targetScale
				),
				0.1
			);
		}
	});

	return (
		<group ref={groupRef} position={position}>
			{/* Main Eyeball */}
			<Sphere ref={eyeballRef} args={[1.5, 64, 64]}>
				<meshStandardMaterial
					color='#f8f8f8'
					roughness={0.1}
					metalness={0.05}
					transparent
					opacity={0.95}
				/>
			</Sphere>

			{/* Iris */}
			<Sphere
				ref={irisRef}
				args={[0.9, 32, 32]}
				position={[0, 0, 1.35]}
			>
				<meshStandardMaterial
					color={
						isHovered ? '#1e40af' : '#2563eb'
					} // Slightly darker when hovered
					roughness={0.2}
					metalness={0.3}
					transparent
					opacity={0.9}
				/>
			</Sphere>

			{/* Pupil */}
			<Sphere
				ref={pupilRef}
				args={[isHovered ? 0.45 : 0.4, 32, 32]} // Slightly larger when hovered
				position={[0, 0, 1.45]}
			>
				<meshStandardMaterial
					color='#000000'
					roughness={0.05}
					metalness={0.9}
				/>
			</Sphere>

			{/* Main highlight */}
			<Sphere
				args={[0.12, 16, 16]}
				position={[0.3, 0.3, 1.55]}
			>
				<meshStandardMaterial
					color='#ffffff'
					emissive='#ffffff'
					emissiveIntensity={
						isHovered ? 1.0 : 0.8
					} // Brighter when hovered
					transparent
					opacity={0.9}
				/>
			</Sphere>

			{/* Secondary highlight */}
			<Sphere
				args={[0.06, 16, 16]}
				position={[-0.2, 0.15, 1.5]}
			>
				<meshStandardMaterial
					color='#ffffff'
					emissive='#ffffff'
					emissiveIntensity={0.4}
					transparent
					opacity={0.6}
				/>
			</Sphere>

			{/* Upper Eyelid */}
			<mesh
				ref={upperEyelidRef}
				position={[0, 0.4, 1.2]}
				rotation={[0, 0, 0]}
			>
				<sphereGeometry
					args={[
						1.7,
						32,
						16,
						0,
						Math.PI * 2,
						0,
						Math.PI * 0.35,
					]}
				/>
				<meshStandardMaterial
					color='#d4a574'
					roughness={0.8}
					metalness={0.1}
				/>
			</mesh>

			{/* Lower Eyelid */}
			<mesh
				ref={lowerEyelidRef}
				position={[0, -0.4, 1.2]}
				rotation={[Math.PI, 0, 0]}
			>
				<sphereGeometry
					args={[
						1.7,
						32,
						16,
						0,
						Math.PI * 2,
						0,
						Math.PI * 0.25,
					]}
				/>
				<meshStandardMaterial
					color='#d4a574'
					roughness={0.8}
					metalness={0.1}
				/>
			</mesh>
		</group>
	);
};

export default InteractiveEye;
