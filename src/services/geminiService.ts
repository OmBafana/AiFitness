import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Gemini API key is not configured');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface WorkoutRequest {
  goal: string;
  duration: string;
  level: string;
  equipment?: string[];
  preferences?: string[];
}

export interface DietRequest {
  goal: string;
  meals: string;
  dietType: string;
  allergies?: string[];
  preferences?: string[];
  weight?: number;
  height?: number;
  age?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async generateWorkoutPlan(request: WorkoutRequest): Promise<string> {
    const prompt = `
      Create a detailed workout plan with the following specifications:
      - Goal: ${request.goal}
      - Duration: ${request.duration} minutes
      - Fitness Level: ${request.level}
      - Equipment: ${request.equipment?.join(', ') || 'bodyweight exercises'}
      
      Please provide:
      1. A structured workout plan with exercises, sets, reps, and rest periods
      2. Warm-up routine (5-10 minutes)
      3. Main workout exercises with proper form cues
      4. Cool-down and stretching routine
      5. Tips for progression and safety
      
      Format the response in a clear, easy-to-follow structure with proper headings and bullet points.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating workout plan:', error);
      throw new Error('Failed to generate workout plan. Please try again.');
    }
  }

  async generateDietPlan(request: DietRequest): Promise<string> {
    const prompt = `
      Create a personalized diet plan with the following specifications:
      - Goal: ${request.goal}
      - Meals per day: ${request.meals}
      - Diet type: ${request.dietType}
      - Age: ${request.age || 'not specified'}
      - Weight: ${request.weight || 'not specified'} lbs
      - Height: ${request.height || 'not specified'} inches
      - Allergies: ${request.allergies?.join(', ') || 'none specified'}
      
      Please provide:
      1. Daily meal plan with specific meals and portions
      2. Macronutrient breakdown (protein, carbs, fats)
      3. Calorie targets for each meal
      4. Healthy snack options
      5. Hydration recommendations
      6. Meal prep tips
      
      Format the response with clear meal sections and nutritional information.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating diet plan:', error);
      throw new Error('Failed to generate diet plan. Please try again.');
    }
  }

  async chatWithAI(messages: ChatMessage[], userProfile?: any): Promise<string> {
    const conversationHistory = messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'AI Fitness Coach'}: ${msg.content}`
    ).join('\n');

    const profileContext = userProfile ? `
      User Profile:
      - Name: ${userProfile.name}
      - Age: ${userProfile.age || 'not specified'}
      - Weight: ${userProfile.weight || 'not specified'} lbs
      - Height: ${userProfile.height || 'not specified'} inches
      - Goals: ${userProfile.goals?.join(', ') || 'not specified'}
    ` : '';

    const prompt = `
      You are an expert AI fitness coach and nutritionist. You provide personalized advice on:
      - Workout routines and exercise form
      - Nutrition and meal planning
      - Fitness goal setting and motivation
      - Injury prevention and recovery
      - Healthy lifestyle habits
      
      ${profileContext}
      
      Conversation History:
      ${conversationHistory}
      
      Please respond as a knowledgeable, encouraging, and supportive fitness coach. Keep responses helpful, practical, and motivating. If asked about medical conditions or injuries, recommend consulting with healthcare professionals.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in AI chat:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  async analyzeForm(exerciseDescription: string): Promise<string> {
    const prompt = `
      As a fitness expert, analyze the following exercise description and provide form feedback:
      
      Exercise: ${exerciseDescription}
      
      Please provide:
      1. Proper form checklist
      2. Common mistakes to avoid
      3. Safety tips
      4. Progression suggestions
      5. Muscle groups targeted
      
      Keep the response practical and easy to understand.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error analyzing form:', error);
      throw new Error('Failed to analyze exercise form. Please try again.');
    }
  }
}

export const geminiService = new GeminiService();