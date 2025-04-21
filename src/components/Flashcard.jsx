import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaRedo, FaSync } from 'react-icons/fa';
import '../styles/Flashcard.css';

const Flashcard = ({ concepts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    console.log('Flashcard received concepts:', concepts);
  }, [concepts]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % concepts.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + concepts.length) % concepts.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShowAll = () => {
    setShowAll(!showAll);
    setIsFlipped(false);
  };

  if (!concepts || concepts.length === 0) {
    return (
      <div className="flashcard-container">
        <p className="no-concepts">No key concepts available for flashcards.</p>
      </div>
    );
  }

  const formatContent = (text) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        return (
          <li key={index} className="flashcard-list-item">
            {trimmedLine.replace(/^[•\-*]\s*/, '')}
          </li>
        );
      }
      return <p key={index}>{trimmedLine}</p>;
    });
  };

  return (
    <div className="flashcard-container">
      <div className="flashcard-controls">
        <button 
          onClick={handlePrevious} 
          className="control-button"
          aria-label="Previous card"
        >
          <FaArrowLeft />
        </button>
        <span className="card-counter">
          {currentIndex + 1} / {concepts.length}
        </span>
        <button 
          onClick={handleNext} 
          className="control-button"
          aria-label="Next card"
        >
          <FaArrowRight />
        </button>
      </div>

      <div className="flashcard-grid">
        {showAll ? (
          concepts.map((concept, index) => (
            <div key={index} className="flashcard">
              <div className="flashcard-inner">
                <div className="flashcard-front">
                  <div className="flashcard-content">
                    <h3>{concept.term}</h3>
                    <button 
                      className="flip-button"
                      onClick={() => {
                        const card = document.querySelector(`#card-${index}`);
                        card.classList.toggle('flipped');
                      }}
                      aria-label="Flip card"
                    >
                      <FaSync />
                    </button>
                  </div>
                </div>
                <div className="flashcard-back">
                  <div className="flashcard-content">
                    {formatContent(concept.definition)}
                    <button 
                      className="flip-button"
                      onClick={() => {
                        const card = document.querySelector(`#card-${index}`);
                        card.classList.toggle('flipped');
                      }}
                      aria-label="Flip card"
                    >
                      <FaSync />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div 
            className={`flashcard ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <div className="flashcard-content">
                  <h3>{concepts[currentIndex].term}</h3>
                  <button 
                    className="flip-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip();
                    }}
                    aria-label="Flip card"
                  >
                    <FaSync />
                  </button>
                </div>
              </div>
              <div className="flashcard-back">
                <div className="flashcard-content">
                  {formatContent(concepts[currentIndex].definition)}
                  <button 
                    className="flip-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip();
                    }}
                    aria-label="Flip card"
                  >
                    <FaSync />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flashcard-actions">
        <button onClick={handleShowAll} className="action-button">
          {showAll ? 'Show One' : 'Show All'}
        </button>
        <button 
          onClick={() => {
            setCurrentIndex(0);
            setIsFlipped(false);
          }} 
          className="action-button"
        >
          <FaRedo /> Reset
        </button>
      </div>
    </div>
  );
};

export default Flashcard; 