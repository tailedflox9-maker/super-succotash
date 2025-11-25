import React, { useState, useEffect } from 'react'; \r
import ReactMarkdown from 'react-markdown'; \r
import { ArrowLeft, ArrowRight, X, Trophy, Sparkles } from 'lucide-react'; \r
import { ProgressBar } from './ProgressBar'; \r
import { InteractiveElement } from './InteractiveElement'; \r
import type { ConceptJourney } from '../types/journey'; \r
\r
interface JourneyViewProps {
\r
    journey: ConceptJourney; \r
    onUpdate: (journey: ConceptJourney) => void; \r
    onClose: () => void; \r
}\r
\r
export function JourneyView({ journey, onUpdate, onClose }: JourneyViewProps) {
\r
    const [currentIndex, setCurrentIndex] = useState(journey.progress.currentPartIndex); \r
    const currentPart = journey.parts[currentIndex]; \r
    \r
    const isFirstPart = currentIndex === 0; \r
    const isLastPart = currentIndex === journey.parts.length - 1; \r
    const isCompleted = journey.progress.percentage === 100; \r
    \r
    useEffect(() => {
    \r
        // Update progress when part changes\r
        const updatedJourney = {
        \r
            ...journey, \r
            progress: {
            \r
                ...journey.progress, \r
                currentPartIndex: currentIndex, \r
                percentage: Math.round(((currentIndex + 1) / journey.parts.length) * 100) \r
            }\r
        }; \r
        onUpdate(updatedJourney); \r
    }, [currentIndex]); \r
    \r
    const handleNext = () => {
    \r
        if (isLastPart) {
        \r
            // Mark journey as complete\r
            const updatedJourney = {
            \r
                ...journey, \r
                progress: {
                \r
                    ...journey.progress, \r
                    percentage: 100, \r
                    completedAt: new Date() \r
                }, \r
                parts: journey.parts.map((part, idx) => ({
                \r
                    ...part, \r
                    completed: true, \r
                    completedAt: idx === currentIndex && !part.completed ? new Date() : part.completedAt\r
                })) \r
            }; \r
            onUpdate(updatedJourney); \r
        } else {
        \r
            // Mark current part as complete and move to next\r
            const updatedParts = journey.parts.map((part, idx) => \r
                idx === currentIndex ? { ...part, completed: true, completedAt: new Date() } : part\r
            ); \r
            const updatedJourney = {
            \r
                ...journey, \r
                parts: updatedParts\r
            }; \r
            onUpdate(updatedJourney); \r
            setCurrentIndex(currentIndex + 1); \r
        } \r
    }; \r
    \r
    const handlePrevious = () => {
    \r
        if (!isFirstPart) {
        \r
            setCurrentIndex(currentIndex - 1); \r
        } \r
    }; \r
    \r
    // Completion screen\r
    if (isCompleted) {
    \r
        return (\r
            < div className = "jour ney-view h-full flex flex-col bg-gradient-to-b from-[var(--color-bg)] to-[#0a0a10]" >\r
        {/* Header */ } \r
            < div className = "progress-bar" >\r
                < div className = "flex justify-between items-center mb-3" >\r
                    < h2 className = "font-bold text-xl text-[var(--color-text-primary)]" > { journey.topic }</h2 >\r
                        < button\r
        onClick = { onClose }\r
        className = "p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors"\r
            >\r
                < X className = "w-5 h-5" />\r
                        </button >\r
                    </div >\r
                </div >\r
        \r
        {/* Completion celebration */ } \r
            < div className = "flex-1 flex items-center justify-center p-8" >\r
                < div className = "completion-screen max-w-md w-full" >\r
                    < div className = "trophy-icon mb-6" >\r
                            🏆\r
                        </div >\r
            < h2 className = "completion-title" >\r
                            Journey Complete!\r
                        </h2 >\r
            < p className = "text-xl text-[var(--color-text-secondary)] mb-8" >\r
                            You've mastered <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{journey.topic}</span>\r
                        </p >\r
        \r
        {/* Stats Cards */ } \r
            < div className = "grid grid-cols-2 gap-4 mb-8" >\r
                < div className = "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-4" >\r
                    < div className = "text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1" >\r
        { journey.parts.length } \r
                                </div >\r
            < div className = "text-sm text-[var(--color-text-secondary)]" > Parts Completed</div >\r
                            </div >\r
            < div className = "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4" >\r
                < div className = "text-3xl font-bold text-green-400 mb-1" > 100 %</div >\r
                    < div className = "text-sm text-[var(--color-text-secondary)]" > Progress</div >\r
                            </div >\r
                        </div >\r
        \r
            < button\r
        onClick = { onClose }\r
        className = "journey-start-button" >\r
            < Sparkles className = "w-5 h-5" />\r
                < span > Back to Chat</span >\r
                    <span>✨</span >\r
                        </button >\r
                    </div >\r
                </div >\r
            </div >\r
        ); \r
    } \r
    \r
    return (\r
        < div className = "journey-view h-full flex flex-col" >\r
    {/* Sticky header with progress */ } \r
        < div className = "progress-bar" >\r
            < div className = "flex justify-between items-center mb-3" >\r
                < h2 className = "font-bold text-xl text-[var(--color-text-primary)]" > { journey.topic }</h2 >\r
                    < button\r
    onClick = { onClose }\r
    className = "p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors"\r
        >\r
            < X className = "w-5 h-5" />\r
                    </button >\r
                </div >\r
        < ProgressBar current = { currentIndex + 1
} total = { journey.parts.length } />\r
            </div >\r
\r
{/* Scrollable content area */ } \r
    < div className = "flex-1 overflow-y-auto p-6 scroll-container" >\r
        < div className = "max-w-3xl mx-auto" >\r
{/* Part badge */ } \r
    < div className = "inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full mb-4 animate-[slideInUp_0.5s_ease-out]" >\r
        < span className = "text-sm font-semibold text-blue-400" > Part { currentPart.order }</span >\r
                    </div >\r
\r
{/* Part title */ } \r
    < h3 className = "text-3xl font-bold mb-6 bg-gradient-to-r from-[var(--color-text-primary)] to-blue-400 bg-clip-text text-transparent animate-[slideInUp_0.6s_ease-out]" >\r
{ currentPart.title } \r
                    </h3 >\r
\r
{/* Part content */ } \r
    < div className = "prose prose-invert max-w-none mb-6 text-[var(--color-text-secondary)] leading-relaxed animate-[fadeInUp_0.7s_ease-out]" >\r
        < ReactMarkdown > { currentPart.content }</ReactMarkdown >\r
                    </div >\r
\r
{/* Interactive elements */ } \r
{
    currentPart.interactiveElements?.map((element, idx) => (\r
        < InteractiveElement key = { idx } element = { element } />\r
    ))
} \r
                </div >\r
            </div >\r
\r
{/* Navigation buttons */ } \r
    < div className = "sticky bottom-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent p-6 border-t border-[rgba(255,255,255,0.1)]" >\r
        < div className = "flex gap-4 max-w-3xl mx-auto" >\r
            < button\r
onClick = { handlePrevious }\r
disabled = { isFirstPart }\r
className = "flex-1 flex items-center justify-center gap-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[var(--color-text-primary)] font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"\r
    >\r
        < ArrowLeft className = "w-5 h-5" />\r
Previous\r
                    </button >\r
    < button\r
onClick = { handleNext }\r
className = "flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"\r
    >\r
{
    isLastPart ? (\r
        <>\r
            < Trophy className = "w-5 h-5" />\r
                                Complete Journey\r
                            </>\r
                        ) : (\r
        <>\r
                                Next Part\r
        < ArrowRight className = "w-5 h-5" />\r
                            </>\r
                        )
} \r
                    </button >\r
                </div >\r
            </div >\r
        </div >\r
    ); \r
}
