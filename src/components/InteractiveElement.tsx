import React, { useState } from 'react'; \r
import { Check, X, Sparkles, Zap } from 'lucide-react'; \r
import type { InteractiveElement as InteractiveElementType } from '../types/journey'; \r
\r
interface InteractiveElementProps {
\r
    element: InteractiveElementType; \r
    onComplete?: () => void; \r
}\r
\r
export function InteractiveElement({ element, onComplete }: InteractiveElementProps) {
\r
    if (element.type === 'quiz') {
    \r
        return <Quiz ElementData data={element.data} onComplete={onComplete} />; \r
    } \r
    // TODO: Add diagram and animation support\r
    return null; \r
} \r
\r
function QuizElement({ data, onComplete }: { data: any; onComplete?: () => void }) {
\r
    const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number>>(new Map()); \r
    const [showResults, setShowResults] = useState(false); \r
    \r
    const questions = data.questions || []; \r
    \r
    const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    \r
        if (showResults) return; \r
        const newAnswers = new Map(selectedAnswers); \r
        newAnswers.set(questionIndex, optionIndex); \r
        setSelectedAnswers(newAnswers); \r
    }; \r
    \r
    const handleSubmit = () => {
    \r
        setShowResults(true); \r
        onComplete?.(); \r
    }; \r
    \r
    const correctCount = questions.filter(\r
        (q: any, idx: number) => selectedAnswers.get(idx) === q.correctAnswer\r
    ).length; \r
    \r
    const scorePercentage = (correctCount / questions.length) * 100; \r
    const isPerfect = correctCount === questions.length; \r
    \r
    return (\r
        < div className = "interactive-quiz" >\r
    {/* Quiz Header */ } \r
        < div className = "flex items-center justify-between mb-6" >\r
            < h4 className = "quiz-question flex items-center gap-2 text-2xl" >\r
                < Sparkles className = "w-6 h-6 text-yellow-400" />\r
                    Test Your Knowledge\r
                </h4 >\r
    {
        showResults && (\r
            < div className = "quiz-score" >\r
                < Zap className = "w-5 h-5" />\r
        { correctCount }/{questions.length}\r
                    </div >\r
                )
    } \r
            </div >\r
    \r
        < div className = "space-y-8" >\r
    {
        questions.map((question: any, qIdx: number) => {
        \r
            const selected = selectedAnswers.get(qIdx); \r
            const isCorrect = selected === question.correctAnswer; \r
            \r
            return (\r
                < div key = { qIdx } className = "animate-[fadeInUp_0.5s_ease-out]" >\r
                    < p className = "quiz-question text-xl mb-4" >\r
                        < span className = "inline-block w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full text-white text-sm font-bold flex items-center justify-center mr-3" >\r
            { qIdx + 1 } \r
                                </span >\r
            { question.question } \r
                            </p >\r
            \r
                < div className = "space-y-3 pl-11" >\r
            {
                question.options.map((option: string, oIdx: number) => {
                \r
                    const isSelected = selected === oIdx; \r
                    const isCorrectOption = oIdx === question.correctAnswer; \r
                    \r
                    let className = 'quiz-option'; \r
                    if (showResults && isCorrectOption) {
                    \r
                        className += ' correct'; \r
                    } else if (showResults && isSelected && !isCorrect) {
                    \r
                        className += ' incorrect'; \r
                    } else if (isSelected) {
                    \r
                        className += ' selected'; \r
                    } \r
                    \r
                    return (\r
                        < button\r
                    key = { oIdx }\r
                    onClick = {() => handleSelectAnswer(qIdx, oIdx)
                }\r
                                            disabled = { showResults }\r
                                            className = { className }\r
                >\r
                < span className = "flex-1 text-left" > { option }</span >\r
                                            { showResults && isCorrectOption && (\r
                < Check className = "w-5 h-5 text-green-400 flex-shrink-0" />\r
                )
            } \r
            {
                showResults && isSelected && !isCorrect && (\r
                    < X className = "w-5 h-5 text-red-400 flex-shrink-0" />\r
                                            )
    } \r
                                        </button >\r
                                    ); \r
})}\r
                            </div >\r
\r
{
    showResults && (\r
        < div className = "quiz-explanation ml-11" >\r
            < div className = "flex items-start gap-2" >\r
                < span className = "text-2xl flex-shrink-0" >💡</span >\r
                    < p className = "flex-1" > { question.explanation }</p >\r
                                    </div >\r
                                </div >\r
                            )
} \r
                        </div >\r
                    ); \r
                })}\r
            </div >\r
\r
{
    !showResults && selectedAnswers.size === questions.length && (\r
        < button\r
    onClick = { handleSubmit }\r
    className = "journey-start-button mt-8"\r
        >\r
            < Zap className = "w-5 h-5" />\r
                < span > Check My Answers</span >\r
                    <span>→</span >\r
                </button >\r
            )
} \r
\r
{
    showResults && (\r
        < div className = {`mt-8 p-6 rounded-2xl text-center ${\r
    isPerfect\r
        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50'\r
    : scorePercentage >= 50\r
        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50'\r
    : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/50'\r
} `}>\r
                    <div className="text-6xl mb-3 animate-popIn">\r
                        {isPerfect ? '🏆' : scorePercentage >= 50 ? '🎯' : '💪'}\r
                    </div>\r
                    <h3 className="text-2xl font-bold mb-2">\r
                        {isPerfect ? 'Perfect Score!' : scorePercentage >= 50 ? 'Great Job!' : 'Keep Learning!'}\r
                    </h3>\r
                    <p className="text-lg font-semibold">\r
                        You scored <span className="text-3xl mx-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{scorePercentage.toFixed(0)}%</span>\r
                    </p>\r
                    {isPerfect && (\r
                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">\r
                            🌟 Outstanding! You've mastered this concept!\r
                        </p>\r
                    )}\r
                </div>\r
            )}\r
        </div>\r
    );\r
}
