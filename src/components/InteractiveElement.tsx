// src/components/InteractiveElement.tsx
// Component for rendering interactive elements (quizzes, diagrams, etc.)

import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { InteractiveElement as InteractiveElementType } from '../types/journey';

interface InteractiveElementProps {
    element: InteractiveElementType;
    onComplete?: () => void;
}

export function InteractiveElement({ element, onComplete }: InteractiveElementProps) {
    if (element.type === 'quiz') {
        return <QuizElement data={element.data} onComplete={onComplete} />;
    }

    // TODO: Add diagram and animation support
    return null;
}

function QuizElement({ data, onComplete }: { data: any; onComplete?: () => void }) {
    const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number>>(new Map());
    const [showResults, setShowResults] = useState(false);

    const questions = data.questions || [];

    const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
        if (showResults) return;

        const newAnswers = new Map(selectedAnswers);
        newAnswers.set(questionIndex, optionIndex);
        setSelectedAnswers(newAnswers);
    };

    const handleSubmit = () => {
        setShowResults(true);
        onComplete?.();
    };

    const correctCount = questions.filter(
        (q: any, idx: number) => selectedAnswers.get(idx) === q.correctAnswer
    ).length;

    return (
        <div className="interactive-quiz bg-[var(--color-card)] rounded-lg p-6 my-4 border border-[var(--color-border)]">
            <h4 className="font-bold text-lg mb-4 text-[var(--color-text-primary)]">
                Quick Check ✓
            </h4>

            <div className="space-y-6">
                {questions.map((question: any, qIdx: number) => {
                    const selected = selectedAnswers.get(qIdx);
                    const isCorrect = selected === question.correctAnswer;

                    return (
                        <div key={qIdx} className="quiz-question">
                            <p className="font-medium mb-3 text-[var(--color-text-primary)]">
                                {qIdx + 1}. {question.question}
                            </p>

                            <div className="space-y-2">
                                {question.options.map((option: string, oIdx: number) => {
                                    const isSelected = selected === oIdx;
                                    const isCorrectOption = oIdx === question.correctAnswer;

                                    let bgClass = 'bg-[var(--color-card)] border-[var(--color-border)]';
                                    if (showResults && isCorrectOption) {
                                        bgClass = 'bg-green-500/20 border-green-500';
                                    } else if (showResults && isSelected && !isCorrect) {
                                        bgClass = 'bg-red-500/20 border-red-500';
                                    } else if (isSelected) {
                                        bgClass = 'bg-blue-500/20 border-blue-500';
                                    }

                                    return (
                                        <button
                                            key={oIdx}
                                            onClick={() => handleSelectAnswer(qIdx, oIdx)}
                                            disabled={showResults}
                                            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${bgClass} ${!showResults ? 'hover:border-blue-400 cursor-pointer' : 'cursor-default'
                                                } flex items-center gap-2`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-500' : 'border-gray-500'
                                                }`}>
                                                {isSelected && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                                            </div>
                                            <span className="flex-1">{option}</span>
                                            {showResults && isCorrectOption && <Check className="w-5 h-5 text-green-500" />}
                                            {showResults && isSelected && !isCorrect && <X className="w-5 h-5 text-red-500" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {showResults && (
                                <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        💡 {question.explanation}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {!showResults && selectedAnswers.size === questions.length && (
                <button
                    onClick={handleSubmit}
                    className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all"
                >
                    Check Answers
                </button>
            )}

            {showResults && (
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                    <p className="text-center font-bold text-lg">
                        Score: {correctCount} / {questions.length}
                        {correctCount === questions.length && ' 🎉 Perfect!'}
                    </p>
                </div>
            )}
        </div>
    );
}
