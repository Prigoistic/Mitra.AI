import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { FaBookOpen, FaQuestionCircle, FaStickyNote, FaBrain, FaLightbulb, FaGraduationCap } from 'react-icons/fa';
import Squares from '../blocks/Backgrounds/Squares/Squares';
import '../styles/Home.css';

const Home = () => {
  const [inputTopic, setInputTopic] = useState('');
  const [error, setError] = useState('');
  const { setTopic } = useStudy();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputTopic.trim()) {
      setError('Please enter a topic');
      return;
    }
    setTopic(inputTopic.trim());
    navigate('/summary');
  };

  const features = [
    {
      icon: <FaBookOpen className="feature-icon" />,
      title: 'Smart Summaries',
      description: 'Get well-structured, detailed summaries of any topic organized into easy-to-understand sections.'
    },
    {
      icon: <FaQuestionCircle className="feature-icon" />,
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with AI-generated quizzes tailored to the topic you\'re studying.'
    },
    {
      icon: <FaStickyNote className="feature-icon" />,
      title: 'Personal Notes',
      description: 'Create and organize your notes alongside AI-generated content for better comprehension.'
    },
    {
      icon: <FaBrain className="feature-icon" />,
      title: 'Concept Flashcards',
      description: 'Reinforce learning with interactive flashcards covering key concepts from your study materials.'
    },
    {
      icon: <FaLightbulb className="feature-icon" />,
      title: 'Deep Understanding',
      description: 'Gain insights through comprehensive explanations and real-world examples.'
    },
    {
      icon: <FaGraduationCap className="feature-icon" />,
      title: 'Study Efficiency',
      description: 'Save time with organized information that focuses on what\'s most important.'
    }
  ];

  return (
    <div className="home-container">
      <Squares 
        direction="diagonal" 
        speed={0.5} 
        borderColor="rgba(0, 0, 0, 0.05)" 
        squareSize={50} 
        hoverFillColor="#f0f0f0" 
        className="background-squares"
      />
      
      <div className="decoration-yellow decoration-1"></div>
      <div className="decoration-yellow decoration-2"></div>
      
      <section className="hero-section">
        <div className="hero-category">YOUR OWN KIND</div>
        <h1 className="hero-title">
          Learn <span>anything</span>. Understand everything.
        </h1>
        <p className="hero-description">
          Generate comprehensive study materials powered by AI to enhance your learning experience.
        </p>
        
        <form onSubmit={handleSubmit} className="topic-form">
          <input
            type="text"
            value={inputTopic}
            onChange={(e) => {
              setInputTopic(e.target.value);
              setError('');
            }}
            placeholder="Enter any topic (e.g., Quantum Physics, React Hooks, Climate Change)"
            className="topic-input"
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">
            Generate Study Materials
          </button>
        </form>
        
        <div className="hero-illustrations">
          <img 
            src="/images/man.png" 
            alt="Person studying" 
            className="hero-illustration illustration-left"
          />
          <img 
            src="public/images/calculator.png" 
            alt="Learning illustration" 
            className="hero-illustration illustration-center"
          />
          <img 
            src="/images/beain.png" 
            alt="Student with notes" 
            className="hero-illustration illustration-right"
          />
        </div>
      </section>
      
      <section className="features-section">
        <h2 className="features-title">All your study needs in one place</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              {feature.icon}
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 