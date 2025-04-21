import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { BiSave, BiTrash } from 'react-icons/bi';
import { FiEdit } from 'react-icons/fi';
import { VscBook } from 'react-icons/vsc';
import '../styles/Notes.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const { state } = useLocation();
  const { topic } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load notes from localStorage on initial render only
  useEffect(() => {
    const savedNotes = localStorage.getItem('studyNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Handle incoming new note from Summary or Quiz page
  useEffect(() => {
    if (state && state.newNote) {
      const { newNote } = state;
      
      setNotes(currentNotes => {
        // Check if we already have a note for this topic
        const existingNoteIndex = currentNotes.findIndex(note => 
          note.topic.toLowerCase() === newNote.topic.toLowerCase()
        );
        
        let updatedNotes;
        if (existingNoteIndex !== -1) {
          // Update existing note
          updatedNotes = [...currentNotes];
          updatedNotes[existingNoteIndex] = {
            ...newNote,
            date: new Date().toLocaleDateString(),
            id: updatedNotes[existingNoteIndex].id
          };
        } else {
          // Add new note
          const noteWithId = {
            ...newNote,
            id: Date.now(),
            date: new Date().toLocaleDateString()
          };
          updatedNotes = [...currentNotes, noteWithId];
        }
        
        // Save to localStorage
        localStorage.setItem('studyNotes', JSON.stringify(updatedNotes));
        return updatedNotes;
      });
      
      // Clear the state to prevent duplicate notes on refresh
      window.history.replaceState({}, document.title);
    }
  }, [state]);

  const saveNotes = useCallback(() => {
    setIsLoading(true);
    try {
      localStorage.setItem('studyNotes', JSON.stringify(notes));
      setTimeout(() => {
        setIsLoading(false);
        setIsSaved(true);
        
        // Reset saved status after 2 seconds
        setTimeout(() => {
          setIsSaved(false);
        }, 2000);
      }, 500);
    } catch (error) {
      console.error('Error saving notes:', error);
      setIsLoading(false);
    }
  }, [notes]);

  const deleteNote = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(currentNotes => {
        const updatedNotes = currentNotes.filter(note => note.id !== id);
        localStorage.setItem('studyNotes', JSON.stringify(updatedNotes));
        return updatedNotes;
      });
    }
  }, []);

  const handleEditNote = useCallback((topicName) => {
    navigate(`/summary/${topicName}`);
  }, [navigate]);

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h1>Your Study Notes</h1>
        <button 
          className="save-button" 
          onClick={saveNotes}
          disabled={isLoading || notes.length === 0}
        >
          {isLoading ? 'Saving...' : isSaved ? 'Saved!' : (
            <>
              <BiSave /> Save Notes
            </>
          )}
        </button>
      </div>

      <div className="notes-grid">
        {notes.length === 0 ? (
          <div className="no-notes">
            <VscBook size={60} />
            <h2>No Notes Yet</h2>
            <p>
              Start by entering a topic on the home page to generate a summary and create your first note!
            </p>
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <div>
                  <h2>{note.topic}</h2>
                  <span className="note-date">{note.date}</span>
                </div>
                <div>
                  <button 
                    className="delete-button" 
                    onClick={() => handleEditNote(note.topic)}
                    title="Edit Note"
                    style={{ marginRight: '0.5rem' }}
                  >
                    <FiEdit size={20} />
                  </button>
                  <button 
                    className="delete-button" 
                    onClick={() => deleteNote(note.id)}
                    title="Delete Note"
                  >
                    <BiTrash size={20} />
                  </button>
                </div>
              </div>
              <div className="note-content">
                <h3>Summary</h3>
                <p>{note.summary}</p>
                
                {note.concepts && note.concepts.length > 0 && (
                  <>
                    <h3>Key Concepts</h3>
                    <ul>
                      {note.concepts.map((concept, idx) => (
                        <li key={idx}>{concept}</li>
                      ))}
                    </ul>
                  </>
                )}
                
                {note.questions && note.questions.length > 0 && (
                  <>
                    <h3>Practice Questions</h3>
                    <div className="quiz-questions">
                      {note.questions.map((question, idx) => (
                        <div key={idx} className="question">
                          <p><strong>Q:</strong> {question.question}</p>
                          <div className="correct-answer">
                            <strong>A:</strong> {question.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes; 