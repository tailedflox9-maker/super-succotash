import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ArrowRight, X, Trophy, Sparkles } from 'lucide-react';
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
            <div className="journey-view h-full flex flex-col bg-gradient-to-b from-[var(--color-bg)] to-[#0a0a10]">
                {/* Header */}
                <div className="progress-bar">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-bold text-xl text-[var(--color-text-primary)]">{journey.topic}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Completion celebration */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="completion-screen max-w-md w-full">
                        <div className="trophy-icon mb-6">
                            🏆
                        </div>
                        <h2 className="completion-title">
                            Journey Complete!
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)] mb-8">
                            You've mastered <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{journey.topic}</span>
                        </p>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-4">
                                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                                    {journey.parts.length}
                                </div>
                                <div className="text-sm text-[var(--color-text-secondary)]">Parts Completed</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                                <div className="text-3xl font-bold text-green-400 mb-1">100%</div>
                                <div className="text-sm text-[var(--color-text-secondary)]">Progress</div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="journey-start-button">
                            <Sparkles className="w-5 h-5" />
                            <span>Back to Chat</span>
                            <span>✨</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="journey-view h-full flex flex-col">
            {/* Sticky header with progress */}
            <div className="progress-bar">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold text-xl text-[var(--color-text-primary)]">{journey.topic}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <ProgressBar current={currentIndex + 1} total={journey.parts.length} />
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto p-6 scroll-container">
                <div className="max-w-3xl mx-auto">
                    {/* Part badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full mb-4 animate-[slideInUp_0.5s_ease-out]">
                        <span className="text-sm font-semibold text-blue-400">Part {currentPart.order}</span>
                    </div>

                    {/* Part title */}
                    <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[var(--color-text-primary)] to-blue-400 bg-clip-text text-transparent animate-[slideInUp_0.6s_ease-out]">
                        {currentPart.title}
                    </h3>

                    {/* Part content */}
                    <div className="prose prose-invert max-w-none mb-6 text-[var(--color-text-secondary)] leading-relaxed animate-[fadeInUp_0.7s_ease-out]">
                        <ReactMarkdown>{currentPart.content}</ReactMarkdown>
                    </div>

                    {/* Interactive elements */}
                    {currentPart.interactiveElements?.map((element, idx) => (
                        <InteractiveElement key={idx} element={element} />
                    ))}
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="sticky bottom-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent p-6 border-t border-[rgba(255,255,255,0.1)]">
                <div className="flex gap-4 max-w-3xl mx-auto">
                    <button
                        onClick={handlePrevious}
                        disabled={isFirstPart}
                        className="flex-1 flex items-center justify-center gap-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[var(--color-text-primary)] font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                    >
                        {isLastPart ? (
                            <>
                                <Trophy className="w-5 h-5" />
                                Complete Journey
                            </>
                        ) : (
                            <>
                                Next Part
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
