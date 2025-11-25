// Journey-related types for Concept Explorer feature
import type { QuizQuestion } from '../types';

export interface InteractiveElement {
    type: 'quiz' | 'diagram' | 'animation';
    data: QuizData | DiagramData | AnimationData;
}

export interface QuizData {
    questions: QuizQuestion[];
}

export interface DiagramData {
    type: string;
    content: string;
}

export interface AnimationData {
    type: string;
    params: Record<string, any>;
}

export interface JourneyPart {
    id: string;
    order: number;
    title: string;
    content: string;
    interactiveElements?: InteractiveElement[];
    completed: boolean;
    completedAt?: Date;
}

export interface ConceptJourney {
    id: string;
    topic: string;
    conversationId: string;
    parts: JourneyPart[];
    progress: {
        currentPartIndex: number;
        totalParts: number;
        percentage: number;
        timeSpent: number;
        completedAt?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}
