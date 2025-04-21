import { GoogleGenAI } from "@google/genai";

// Check if API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('Gemini API key is missing. Please check your .env file.');
}

const ai = new GoogleGenAI({ apiKey });

export const generateSummary = async (topic) => {
  try {
    console.log('Generating summary for topic:', topic);
    console.log('API Key:', apiKey ? 'Present' : 'Missing');
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Create a comprehensive, well-structured summary about ${topic}. Organize the content into clear sections with the following structure:

1. Introduction
   - Brief overview of the topic
   - Importance and relevance
   - Key objectives

2. Core Concepts
   - List and explain 3-5 fundamental concepts
   - Include examples where applicable
   - Highlight relationships between concepts

3. Key Components/Elements
   - Break down the main components
   - Explain each component's role
   - Show how components interact

4. Important Details
   - Critical facts and figures
   - Key terminology and definitions
   - Common misconceptions

5. Applications
   - Real-world applications
   - Practical examples
   - Use cases

6. Summary & Key Takeaways
   - Main points to remember
   - Critical insights
   - Final thoughts

Format the response with clear headings and subheadings. Use bullet points for lists and maintain a clear hierarchy of information.`
    });
    
    console.log('Summary generated successfully');
    return response.text;
  } catch (error) {
    console.error('Detailed error:', error);
    if (error.message.includes('API key')) {
      throw new Error('Invalid or missing API key. Please check your .env file.');
    } else if (error.message.includes('404')) {
      throw new Error('API endpoint not found. Please check your internet connection and try again.');
    } else {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
  }
};

export const generateQuiz = async (topic) => {
  try {
    console.log('Generating quiz for topic:', topic);
    console.log('API Key:', apiKey ? 'Present' : 'Missing');
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Create 5 multiple choice questions about ${topic}. Format each question as a JSON object with the following structure:
      {
        "question": "question text",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": "correct option"
      }
      Return only the JSON array of questions. Do not include any markdown formatting or additional text.`
    });
    
    try {
      // Clean up the response by removing markdown code block syntax and any extra text
      const cleanedResponse = response.text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      
      console.log('Cleaned response:', cleanedResponse);
      const quiz = JSON.parse(cleanedResponse);
      console.log('Quiz generated successfully');
      return quiz;
    } catch (parseError) {
      console.error('Error parsing quiz response:', parseError);
      console.error('Raw response:', response.text);
      throw new Error('Failed to parse quiz questions. Please try again.');
    }
  } catch (error) {
    console.error('Detailed error:', error);
    if (error.message.includes('API key')) {
      throw new Error('Invalid or missing API key. Please check your .env file.');
    } else if (error.message.includes('404')) {
      throw new Error('API endpoint not found. Please check your internet connection and try again.');
    } else {
      throw new Error(`Failed to generate quiz: ${error.message}`);
    }
  }
}; 