// src/components/ProgressBar.tsx
// Progress bar component with gradient fill and shimmer effect

import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
    showLabels?: boolean;
}

export function ProgressBar({
    current,
    total,
    showLabels = true
}: ProgressBarProps) {
    const percentage = Math.round((current / total) * 100);

    return (
        <div className="progress-container">
            {showLabels && (
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--color-text-secondary)]">
                        Part {current} of {total}
                    </span>
                    <span className="font-bold text-[var(--color-text-primary)]">
                        {percentage}%
                    </span>
                </div>
            )}

            <div className="h-2 bg-[var(--color-card)] rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out relative overflow-hidden"
                    style={{ width: `${percentage}%` }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
            </div>
        </div>
    );
}
