import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StudyProvider } from './context/StudyContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Summary from './pages/Summary';
import Quiz from './pages/Quiz';
import Notes from './pages/Notes';
import './styles/App.css';

function App() {
  return (
    <Router>
      <StudyProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/notes" element={<Notes />} />
            </Routes>
          </main>
        </div>
      </StudyProvider>
    </Router>
  );
}

export default App; 