import React from 'react';
import { Rocket, Clock, Layers } from 'lucide-react';

interface JourneyCardProps {
    topic: string;
    onStart: () => void;
    isLoading?: boolean;
}

export function JourneyCard({ topic, onStart, isLoading }: JourneyCardProps) {
    return (
        <div className="journey-card-wrapper my-6 animate-[slideInUp_0.4s_ease-out]">
            <div className="journey-card-modern">
                {/* Animated Background Gradient */}
                <div className="journey-card-glow"></div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Header with Icon */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className="journey-icon-container">
                            <Rocket className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
                                🚀 Start Learning Journey
                            </h3>
                            <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                                {topic}
                            </p>
                        </div>
                    </div>

                    {/* Journey Details */}
                    <div className="flex items-center gap-6 mb-5 text-sm text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-purple-400" />
                            <span className="font-semibold">5 Interactive Parts</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="font-semibold">~20 minutes</span>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="grid grid-cols-2 gap-2 mb-5">
                        <div className="feature-badge">
                            <span className="feature-icon">✨</span>
                            <span>AI-Powered</span>
                        </div>
                        <div className="feature-badge">
                            <span className="feature-icon">🎯</span>
                            <span>Interactive</span>
                        </div>
                        <div className="feature-badge">
                            <span className="feature-icon">💡</span>
                            <span>Quizzes</span>
                        </div>
                        <div className="feature-badge">
                            <span className="feature-icon">🏆</span>
                            <span>Achievements</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={onStart}
                        disabled={isLoading}
                        className="journey-start-button group"
                    >
                        {isLoading ? (
                            <>
                                <div className="loading-spinner"></div>
                                <span>Generating Journey...</span>
                            </>
                        ) : (
                            <>
                                <Rocket className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                <span className="font-bold">Begin Journey</span>
                                <span className="text-xl">→</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
