import React from 'react';
import { Rocket, Clock, Layers } from 'lucide-react';

interface JourneyCardProps {
    topic: string;
    onStart: () => void;
    isLoading?: boolean;
}

export function JourneyCard({ topic, onStart, isLoading }: JourneyCardProps) {
    return (
        <div className="my-6 max-w-2xl mx-auto animate-[slideInUp_0.4s_ease-out]">
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
                {/* Content */}
                <div className="relative z-10">
                    {/* Header with Icon */}
                    <div className="flex items-start gap-4 mb-5">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                            <Rocket className="w-7 h-7 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-[var(--color-text-secondary)] mb-2">
                                🚀 Start Learning Journey
                            </h3>
                            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                                {topic}
                            </p>
                        </div>
                    </div>

                    {/* Journey Details */}
                    <div className="flex items-center gap-6 mb-5 text-sm text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            <span>5 Interactive Parts</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>~20 minutes</span>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="grid grid-cols-2 gap-2 mb-5">
                        <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg text-xs text-[var(--color-text-secondary)]">
                            <span>✨</span>
                            <span>AI-Powered</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg text-xs text-[var(--color-text-secondary)]">
                            <span>🎯</span>
                            <span>Interactive</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg text-xs text-[var(--color-text-secondary)]">
                            <span>💡</span>
                            <span>Quizzes</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg text-xs text-[var(--color-text-secondary)]">
                            <span>🏆</span>
                            <span>Progress Tracking</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={onStart}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Generating Journey...</span>
                            </>
                        ) : (
                            <>
                                <Rocket className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                <span>Begin Journey</span>
                                <span className="text-xl">→</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
