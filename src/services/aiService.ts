import { APISettings, Conversation, StudySession, QuizQuestion, TutorMode, AIModel } from '../types';
import { generateId } from '../utils/helpers';

// Persona prompts for tutors
const tutorPrompts: Record<TutorMode, string> = {
  standard: `You are an expert AI Tutor named 'Tutor'. Your primary goal is to help users understand complex topics through clear, patient, and encouraging guidance. Follow these principles strictly:
1. Socratic Method: Do not just provide direct answers. Instead, ask guiding questions to help the user arrive at the solution themselves.
2. Simplify Concepts: Break down complex subjects into smaller, digestible parts. Use simple language, analogies, and real-world examples to make concepts relatable.
3. Encouraging Tone: Maintain a positive, patient, and supportive tone at all times.
4. Clear Explanations: When you must provide an explanation or a code example, ensure it is thoroughly commented and explained step-by-step.
5. Stay Focused: Politely steer the conversation back to the educational topic if the user strays.`,

  exam: `You are a no-nonsense AI Exam Coach. Your purpose is to prepare the user for a test. You are direct, efficient, and focused on results.
1. Focus on Key Concepts: Prioritize formulas, definitions, and facts most likely to appear on exams.
2. Provide Practice Problems: Actively create practice questions and short-answer drills.
3. Concise Answers: Be direct. Avoid long philosophical explanations.
4. Identify Weaknesses: Give immediate feedback and short explanations when answers are wrong.
5. Time Management: Emphasize speed and accuracy.`,

  mentor: `You are a Friendly AI Mentor. You are casual, relatable, and motivating.
1. Relatable Analogies: Use simple analogies and real-life examples.
2. Constant Encouragement: Cheer the student on ("You're doing great!").
3. Casual Tone: Be conversational, use emojis if needed.
4. Focus on the 'Why': Explain the real-world relevance of topics.
5. Growth Mindset: Treat mistakes as learning opportunities.`,

  creative: `You are a Creative AI Guide. You help with brainstorming, writing, and imaginative thinking.
1. Brainstorming Partner: Offer many starting points and "what if" scenarios.
2. Ask Open-Ended Questions: Encourage exploration.
3. Sensory Details: Guide the user to think about sights, sounds, smells, etc.
4. Constructive Feedback: Focus on positives before suggesting improvements.
5. Creative Constraints: Suggest fun challenges to spark ideas.`
};

// Helper: OpenAI-compatible streaming with timeout
async function* streamOpenAICompatResponse(
  url: string,
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  systemPrompt: string,
  timeout: number = 30000
): AsyncGenerator<string> {
  const messagesWithSystemPrompt = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ 
        model, 
        messages: messagesWithSystemPrompt, 
        stream: true,
        max_tokens: 8192,
        temperature: 0.7 
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Body:", errorBody);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6).trim();
            if (data === '[DONE]') return;
            
            try {
              const json = JSON.parse(data);
              const chunk = json.choices?.[0]?.delta?.content;
              if (chunk) yield chunk;
            } catch (e) {
              console.error('Error parsing stream chunk:', e, 'Raw data:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}

class AiService {
  private settings: APISettings = {
    googleApiKey: '',
    zhipuApiKey: '',
    mistralApiKey: '',
    groqApiKey: '',
    cerebrasApiKey: '',
    selectedModel: 'gemini-2.5-flash',
    selectedTutorMode: 'standard',
  };

  public updateSettings(newSettings: APISettings) {
    this.settings = newSettings;
  }

  private getSystemPrompt(): string {
    return tutorPrompts[this.settings.selectedTutorMode] || tutorPrompts.standard;
  }

  // Method specifically for flowchart generation that ALWAYS uses Google Gemini
  public async *generateFlowchartResponse(
    messages: { role: string; content: string }[]
  ): AsyncGenerator<string> {
    // Flowcharts prioritize Google, but fall back if needed logic can be added here
    // For now, adhering to the requirement to use a capable model
    if (!this.settings.googleApiKey) {
      throw new Error('Google API key required for flowchart generation.');
    }

    const userMessages = messages.map(m => ({ role: m.role, content: m.content }));
    const systemPrompt = 'You are a helpful assistant that generates flowcharts in JSON format.';
    // Using Gemini 2.5 Flash for speed/efficiency in flowcharts
    const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${this.settings.googleApiKey}&alt=sse`;

    const googleMessages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood. I will follow this role.' }] },
      ...userMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); 

    try {
      const response = await fetch(googleUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: googleMessages }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Google API Error: ${response.status} - ${errorBody}`);
      }

      if (!response.body) throw new Error('Response body is null');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const json = JSON.parse(line.substring(6));
                const chunk = json.candidates?.[0]?.content?.parts?.[0]?.text;
                if (chunk) yield chunk;
              } catch (e) { console.error(e); }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Unified streaming response generator
  public async *generateStreamingResponse(
    messages: { role: string; content: string }[]
  ): AsyncGenerator<string> {
    if (!messages || messages.length === 0) {
      throw new Error('No messages provided');
    }

    const userMessages = messages.map(m => ({ role: m.role, content: m.content }));
    const systemPrompt = this.getSystemPrompt();
    const model = this.settings.selectedModel;

    try {
      // GOOGLE MODELS
      if (model.startsWith('gemini') || model.startsWith('gemma')) {
        if (!this.settings.googleApiKey) throw new Error('Google API key not set');
        
        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${this.settings.googleApiKey}&alt=sse`;

        const googleMessages = [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'Understood. I will follow this role.' }] },
          ...userMessages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
        ];

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
          const response = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: googleMessages }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Google API Error: ${response.status} - ${errorBody}`);
          }

          if (!response.body) throw new Error('Response body is null');
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const json = JSON.parse(line.substring(6));
                    const chunk = json.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (chunk) yield chunk;
                  } catch (e) { }
                }
              }
            }
          } finally {
            reader.releaseLock();
          }
        } catch (error) {
          clearTimeout(timeoutId);
          if (error instanceof Error && error.name === 'AbortError') throw new Error('Request timed out');
          throw error;
        }
      }

      // MISTRAL MODELS
      else if (model.includes('mistral') || model.includes('codestral')) {
        if (!this.settings.mistralApiKey) throw new Error('Mistral API key not set');
        yield* streamOpenAICompatResponse(
          'https://api.mistral.ai/v1/chat/completions',
          this.settings.mistralApiKey,
          model,
          userMessages,
          systemPrompt
        );
      }

      // ZHIPU MODELS
      else if (model.includes('glm')) {
        // Note: Cerebras also has a GLM model 'zai-glm-4.6', so we check if it is selected as provider or model ID structure
        if (model === 'zai-glm-4.6') {
             // Fallthrough to Cerebras check below, or handle here if distinct
             if (!this.settings.cerebrasApiKey) throw new Error('Cerebras API key not set for ZAI GLM');
             yield* streamOpenAICompatResponse(
              'https://api.cerebras.ai/v1/chat/completions',
              this.settings.cerebrasApiKey,
              model,
              userMessages,
              systemPrompt
            );
        } else {
            // Standard Zhipu
            if (!this.settings.zhipuApiKey) throw new Error('ZhipuAI API key not set');
            yield* streamOpenAICompatResponse(
              'https://open.bigmodel.cn/api/paas/v4/chat/completions',
              this.settings.zhipuApiKey,
              model, // e.g. glm-4.5-flash
              userMessages,
              systemPrompt
            );
        }
      }

      // GROQ MODELS
      else if (model.includes('llama') || model.includes('openai/gpt-oss-20b')) {
        if (!this.settings.groqApiKey) throw new Error('Groq API key not set');
        yield* streamOpenAICompatResponse(
          'https://api.groq.com/openai/v1/chat/completions',
          this.settings.groqApiKey,
          model,
          userMessages,
          systemPrompt
        );
      }

      // CEREBRAS MODELS
      else if (model.includes('gpt-oss-120b') || model.includes('qwen') || model === 'zai-glm-4.6') {
        if (!this.settings.cerebrasApiKey) throw new Error('Cerebras API key not set');
        yield* streamOpenAICompatResponse(
          'https://api.cerebras.ai/v1/chat/completions',
          this.settings.cerebrasApiKey,
          model,
          userMessages,
          systemPrompt
        );
      }

      else {
        throw new Error(`Model ${model} not supported or API key missing.`);
      }

    } catch (error) {
      console.error('Error in generateStreamingResponse:', error);
      throw error;
    }
  }

  // Quiz generation
  public async generateQuiz(conversation: Conversation): Promise<StudySession> {
    if (!this.settings.googleApiKey) {
      throw new Error('Google API key must be configured to generate quizzes.');
    }

    if (!conversation.messages || conversation.messages.length < 2) {
      throw new Error('Conversation must have at least 2 messages to generate a quiz.');
    }

    const conversationText = conversation.messages
      .map(m => `${m.role === 'user' ? 'Q:' : 'A:'} ${m.content}`)
      .join('\n\n');

    const prompt = `Based on the following conversation, create a multiple-choice quiz with 5 questions... (truncated for brevity)... Generate the quiz now:`;

    // Using Gemini Flash for faster JSON generation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.settings.googleApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: prompt + `\n\n${conversationText.slice(0, 6000)}` }] } // Appending content here
            ],
            generationConfig: { responseMimeType: "application/json" } // Force JSON mode
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      const parsed = JSON.parse(textResponse);
      
      if (!parsed.questions || parsed.questions.length === 0) throw new Error('Invalid quiz format');

      const questions: QuizQuestion[] = parsed.questions.map((q: any, index: number) => ({
        id: generateId(),
        question: q.question,
        options: q.options,
        correctAnswer: q.options.indexOf(q.answer),
        explanation: q.explanation,
      }));

      return {
        id: generateId(),
        conversationId: conversation.id,
        questions,
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: questions.length,
        isCompleted: false,
        createdAt: new Date(),
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

export const aiService = new AiService();
