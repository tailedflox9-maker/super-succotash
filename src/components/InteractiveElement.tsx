import React, { useState } from 'react';
import { Check, X, Sparkles, Zap } from 'lucide-react';
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

    const scorePercentage = (correctCount / questions.length) * 100;
    const isPerfect = correctCount === questions.length;

    return (
        <div className="interactive-quiz">
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-6">
                <h4 className="quiz-question flex items-center gap-2 text-2xl">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    Test Your Knowledge
                </h4>
                {showResults && (
                    <div className="quiz-score">
                        <Zap className="w-5 h-5" />
                        {correctCount}/{questions.length}
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {questions.map((question: any, qIdx: number) => {
                    const selected = selectedAnswers.get(qIdx);
                    const isCorrect = selected === question.correctAnswer;

                    return (
                        <div key={qIdx} className="animate-[fadeInUp_0.5s_ease-out]">
                            <p className="quiz-question text-xl mb-4 flex items-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full text-white text-sm font-bold mr-3">
                                    {qIdx + 1}
                                </span>
                                {question.question}
                            </p>

                            <div className="space-y-3 pl-11">
                                {question.options.map((option: string, oIdx: number) => {
                                    const isSelected = selected === oIdx;
                                    const isCorrectOption = oIdx === question.correctAnswer;

                                    let className = 'quiz-option';
                                    if (showResults && isCorrectOption) {
                                        className += ' correct';
                                    } else if (showResults && isSelected && !isCorrect) {
                                        className += ' incorrect';
                                    } else if (isSelected) {
                                        className += ' selected';
                                    }

                                    return (
                                        <button
                                            key={oIdx}
                                            onClick={() => handleSelectAnswer(qIdx, oIdx)}
                                            disabled={showResults}
                                            className={className}
                                        >
                                            <span className="flex-1 text-left">{option}</span>
                                            {showResults && isCorrectOption && (
                                                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                                            )}
                                            {showResults && isSelected && !isCorrect && (
                                                <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {showResults && (
                                <div className="quiz-explanation ml-11">
                                    <div className="flex items-start gap-2">
                                        <span className="text-2xl flex-shrink-0">💡</span>
                                        <p className="flex-1">{question.explanation}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {!showResults && selectedAnswers.size === questions.length && (
                <button
                    onClick={handleSubmit}
                    className="journey-start-button mt-8"
                >
                    <Zap className="w-5 h-5" />
                    <span>Check My Answers</span>
                    <span>→</span>
                </button>
            )}

            {showResults && (
                <div className={`mt-8 p-6 rounded-2xl text-center ${isPerfect
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50'
                        : scorePercentage >= 50
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50'
                            : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/50'
                    }`}>
                    <div className="text-6xl mb-3 animate-popIn">
                        {isPerfect ? '🏆' : scorePercentage >= 50 ? '🎯' : '💪'}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                        {isPerfect ? 'Perfect Score!' : scorePercentage >= 50 ? 'Great Job!' : 'Keep Learning!'}
                    </h3>
                    <p className="text-lg font-semibold">
                        You scored <span className="text-3xl mx-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{scorePercentage.toFixed(0)}%</span>
                    </p>
                    {isPerfect && (
                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                            🌟 Outstanding! You've mastered this concept!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
