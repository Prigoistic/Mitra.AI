# Mitra.Ai

A modern, Notion-style study assistant application that uses the Gemini AI to generate summaries and quizzes for any topic.

## Features

- Generate AI-powered summaries for any topic
- Create interactive quizzes based on the topic
- Save and manage your study notes
- Modern, minimalist UI inspired by Notion
- Responsive design for all devices
- Copy-to-clipboard functionality
- Loading states and error handling

## Technologies Used

- React
- Vite
- React Router
- React Context API
- Google Gemini AI
- Vanilla CSS
- React Icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── context/       # React Context
  ├── utils/         # Utility functions
  ├── styles/        # CSS files
  └── App.jsx        # Main application component
```

## Usage

1. Enter a topic on the home page
2. View the AI-generated summary
3. Take the interactive quiz
4. Save your notes for future reference

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License. 
