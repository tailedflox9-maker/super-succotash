// src/components/JourneyView.tsx
// Main view component for displaying and navigating through concept journeys

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ArrowRight, X, Trophy } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { InteractiveElement } from './InteractiveElement';
import type { ConceptJourney } from '../types/journey';

interface JourneyViewProps {
    journey: ConceptJourney;
    onUpdate: (journey: ConceptJourney) => void;
    onClose: () => void;
}

export function JourneyView({ journey, onUpdate, onClose }: JourneyViewProps) {
    const [currentIndex, setCurrentIndex] = useState(journey.progress.currentPartIndex);
    const currentPart = journey.parts[currentIndex];

    const isFirstPart = currentIndex === 0;
    const isLastPart = currentIndex === journey.parts.length - 1;
    const isCompleted = journey.progress.percentage === 100;

    useEffect(() => {
        // Update progress when part changes
        const updatedJourney = {
            ...journey,
            progress: {
                ...journey.progress,
                currentPartIndex: currentIndex,
                percentage: Math.round(((currentIndex + 1) / journey.parts.length) * 100)
            }
        };
        onUpdate(updatedJourney);
    }, [currentIndex]);

    const handleNext = () => {
        if (isLastPart) {
            // Mark journey as complete
            const updatedJourney = {
                ...journey,
                progress: {
                    ...journey.progress,
                    percentage: 100,
                    completedAt: new Date()
                },
                parts: journey.parts.map((part, idx) => ({
                    ...part,
                    completed: true,
                    completedAt: idx === currentIndex && !part.completed ? new Date() : part.completedAt
                }))
            };
            onUpdate(updatedJourney);
        } else {
            // Mark current part as complete and move to next
            const updatedParts = journey.parts.map((part, idx) =>
                idx === currentIndex ? { ...part, completed: true, completedAt: new Date() } : part
            );
            const updatedJourney = {
                ...journey,
                parts: updatedParts
            };
            onUpdate(updatedJourney);
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstPart) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Completion screen
    if (isCompleted) {
        return (
            <div className="journey-view h-full flex flex-col">
                {/* Header with close button */}
                <div className="sticky top-0 bg-[var(--color-bg)] p-4 border-b border-[var(--color-border)] flex justify-between items-center z-10">
                    <h2 className="font-bold text-xl">{journey.topic}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--color-card)] rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Completion celebration */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="mb-6 animate-popIn">
                            <Trophy className="w-24 h-24 mx-auto text-yellow-500" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Journey Complete! 🎉</h2>
                        <p className="text-lg text-[var(--color-text-secondary)] mb-6">
                            You've mastered: <span className="font-bold text-[var(--color-text-primary)]">{journey.topic}</span>
                        </p>
                        <div className="flex flex-col gap-2 mb-8 text-left bg-[var(--color-card)] p-4 rounded-lg">
                            <div className="flex justify-between">
                                <span className="text-[var(--color-text-secondary)]">Parts Completed:</span>
                                <span className="font-bold">{journey.parts.length}/{journey.parts.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--color-text-secondary)]">Progress:</span>
                                <span className="font-bold text-green-500">100%</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                        >
                            Back to Chat
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="journey-view h-full flex flex-col">
            {/* Sticky header with progress */}
            <div className="sticky top-0 bg-[var(--color-bg)] p-4 border-b border-[var(--color-border)] z-10">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold text-xl">{journey.topic}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--color-card)] rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <ProgressBar current={currentIndex + 1} total={journey.parts.length} />
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-3xl mx-auto">
                    {/* Part title */}
                    <h3 className="text-2xl font-bold mb-6">
                        Part {currentPart.order}: {currentPart.title}
                    </h3>

                    {/* Part content */}
                    <div className="prose prose-invert max-w-none mb-6">
                        <ReactMarkdown>{currentPart.content}</ReactMarkdown>
                    </div>

                    {/* Interactive elements */}
                    {currentPart.interactiveElements?.map((element, idx) => (
                        <InteractiveElement key={idx} element={element} />
                    ))}
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="sticky bottom-0 bg-[var(--color-bg)] p-4 border-t border-[var(--color-border)]">
                <div className="flex gap-4 max-w-3xl mx-auto">
                    <button
                        onClick={handlePrevious}
                        disabled={isFirstPart}
                        className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-card)] hover:bg-[var(--color-card)]/80 text-[var(--color-text-primary)] font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                        {isLastPart ? (
                            <>
                                Finish
                                <Trophy className="w-5 h-5" />
                            </>
                        ) : (
                            <>
                                Next
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
