// src/services/journeyDetection.ts
// Service for detecting explorable topics in user messages

const EXPLORABLE_KEYWORDS = [
    'what is',
    'what are',
    'explain',
    'how does',
    'how do',
    'tell me about',
    'teach me',
    'understand',
    'learn about',
    'can you explain',
    'help me understand',
];

/**
 * Determines if a message describes an explorable topic
 * @param message User's message
 * @returns true if the topic is suitable for a journey
 */
export function isExplorableTopic(message: string): boolean {
    const lower = message.toLowerCase().trim();

    // Check for explorable keywords
    const hasKeyword = EXPLORABLE_KEYWORDS.some(keyword => lower.includes(keyword));

    // Check if it's a question
    const isQuestion = message.includes('?');

    // Check if message is reasonably short (not a long essay)
    const wordCount = message.split(/\s+/).length;
    const isShort = wordCount < 30;

    // Should be either a question with keyword, or have keyword and be short
    return hasKeyword && (isQuestion || isShort);
}

/**
 * Extracts the topic from a user message
 * @param message User's message
 * @returns Extracted topic string
 */
export function extractTopic(message: string): string {
    // Patterns to match common query structures
    const patterns = [
        /(?:about|is|are)\s+(.+?)(?:\?|$)/i,
        /(?:explain|teach me|tell me about|help me understand)\s+(.+?)(?:\?|$)/i,
        /(?:what is|what are|how does|how do)\s+(.+?)(?:\?|$)/i,
    ];

    for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }

    // Fallback: take first 50 characters
    return message.slice(0, 50).trim();
}

/**
 * Estimates journey length based on topic
 * @param topic The topic to explore
 * @returns Estimated duration in minutes
 */
export function estimateJourneyDuration(topic: string): number {
    // Base duration: 4 minutes per part
    const partsCount = 5;
    const minutesPerPart = 4;
    return partsCount * minutesPerPart; // ~20 minutes
}
