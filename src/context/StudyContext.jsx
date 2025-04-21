import { createContext, useContext, useState } from 'react';

const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const [topic, setTopic] = useState('');
  const [summary, setSummary] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addNote = (newNote) => {
    setNotes([...notes, newNote]);
  };

  const value = {
    topic,
    setTopic,
    summary,
    setSummary,
    quiz,
    setQuiz,
    notes,
    addNote,
    isLoading,
    setIsLoading
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}; 