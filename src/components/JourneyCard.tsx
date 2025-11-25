// src/components/JourneyCard.tsx
// Card component to suggest starting a journey

import React from 'react';
import { Rocket } from 'lucide-react';

interface JourneyCardProps {
    topic: string;
    onStart: () => void;
    isLoading?: boolean;
}

export function JourneyCard({ topic, onStart, isLoading = false }: JourneyCardProps) {
    const estimatedTime = 20; // minutes
    const partCount = 5;

    return (
        <div className="journey-card my-4 p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 animate-slideInUp">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-1">
                        Explore: {topic}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                        {partCount} parts • ~{estimatedTime} minutes • Interactive quizzes
                    </p>

                    <button
                        onClick={onStart}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating Journey...
                            </span>
                        ) : (
                            <span>Start Journey →</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
