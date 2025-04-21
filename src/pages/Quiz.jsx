import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { generateQuiz } from '../utils/geminiApi';
import { FaExclamationTriangle } from 'react-icons/fa';
import '../styles/Quiz.css';

const Quiz = () => {
  const { topic, quiz, setQuiz, isLoading, setIsLoading } = useStudy();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!topic) {
      navigate('/');
      return;
    }

    const fetchQuiz = async () => {
      setIsLoading(true);
      setError('');
      try {
        const generatedQuiz = await generateQuiz(topic);
        setQuiz(generatedQuiz);
      } catch (error) {
        console.error('Error in Quiz component:', error);
        setError(error.message || 'Failed to generate quiz. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [topic, setQuiz, setIsLoading, navigate]);

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: selectedOption
    });
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return (correct / quiz.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Generating quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1>Quiz: {topic}</h1>
      <div className="quiz-questions">
        {quiz.map((question, index) => (
          <div key={index} className="question-card">
            <h3>{question.question}</h3>
            <div className="options">
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="option">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={selectedAnswers[index] === option}
                    onChange={() => handleAnswerSelect(index, option)}
                    disabled={showResults}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {showResults && (
              <p className={`answer-feedback ${
                selectedAnswers[index] === question.correctAnswer ? 'correct' : 'incorrect'
              }`}>
                {selectedAnswers[index] === question.correctAnswer
                  ? 'Correct!'
                  : `Incorrect. The correct answer is: ${question.correctAnswer}`}
              </p>
            )}
          </div>
        ))}
      </div>
      <button
        className="submit-button"
        onClick={() => setShowResults(true)}
        disabled={Object.keys(selectedAnswers).length !== quiz.length || showResults}
      >
        {showResults ? `Score: ${calculateScore()}%` : 'Submit Answers'}
      </button>
    </div>
  );
};

export default Quiz; 