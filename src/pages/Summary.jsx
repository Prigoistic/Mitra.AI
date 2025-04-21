import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { generateSummary } from '../utils/geminiApi';
import { FaCopy, FaCheck, FaExclamationTriangle, FaBookOpen, FaLightbulb, FaCode, FaClock, FaTag, FaCalendar } from 'react-icons/fa';
import Flashcard from '../components/Flashcard';
import '../styles/Summary.css';

const Summary = () => {
  const { topic, summary, setSummary, isLoading, setIsLoading } = useStudy();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [concepts, setConcepts] = useState([]);
  const [sectionTitles, setSectionTitles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!topic) {
      navigate('/');
      return;
    }

    const fetchSummary = async () => {
      setIsLoading(true);
      setError('');
      try {
        let generatedSummary = await generateSummary(topic);
        
        // Pre-process the summary to clean up Redux-style formatting
        generatedSummary = generatedSummary.replace(/\*\*(.*?)\*\*/g, '$1')
                                         .replace(/\*/g, '')
                                         .replace(/_{1,2}(.*?)_{1,2}/g, '$1');
        
        setSummary(generatedSummary);
        
        // Extract section titles for table of contents
        const sections = generatedSummary.split('\n\n');
        const titles = sections
          .map(section => {
            const lines = section.split('\n');
            return lines[0] ? lines[0].trim()
              .replace(/^#+\s*/, '')  // Remove markdown headers
              .replace(/^\d+\.\s*/, '') // Remove numbered lists
              : null;
          })
          .filter(title => title && title.length > 0);
        
        setSectionTitles(titles);
        
        // Extract concepts from the summary
        const coreConceptsSection = sections.find(section => 
          section.toLowerCase().includes('core concepts')
        );
        
        if (coreConceptsSection) {
          const conceptLines = coreConceptsSection.split('\n')
            .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'));
          
          const extractedConcepts = conceptLines.map(line => {
            const cleanLine = line.replace(/^[-•]\s*/, '').trim();
            const [term, ...definitionParts] = cleanLine.split(':');
            return {
              term: term.trim(),
              definition: definitionParts.join(':').trim() || 'No definition provided'
            };
          });
          
          setConcepts(extractedConcepts);
        }
      } catch (error) {
        console.error('Error in Summary component:', error);
        setError(error.message || 'Failed to generate summary. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [topic, setSummary, setIsLoading, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
      .replace(/\*/g, '') // Remove all remaining asterisks
      .replace(/^#+\s*/, '') // Remove markdown headers
      .replace(/^\d+\.\s*/, '') // Remove numbered lists
      .replace(/^[-•]\s*/, '') // Remove bullet points
      .replace(/\[(.*?)\](?:\(.*?\))?/g, '$1') // Remove markdown links
      .replace(/`/g, '') // Remove backticks
      .replace(/_{1,2}(.*?)_{1,2}/g, '$1') // Remove underscores
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getEstimatedReadTime = () => {
    // Average reading speed: 200-250 words per minute
    const wordCount = summary.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  const detectSectionType = (title, content) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('introduction') || lowerTitle === 'overview') {
      return 'introduction';
    } else if (lowerTitle.includes('example') || content.includes('example:')) {
      return 'example';
    } else if (lowerTitle.includes('code') || content.includes('```')) {
      return 'code';
    } else if (lowerTitle.includes('key') || lowerTitle.includes('important') || lowerTitle.includes('takeaway')) {
      return 'key-points';
    } else if (lowerTitle.includes('concept')) {
      return 'concepts';
    } else if (lowerTitle.includes('application')) {
      return 'applications';
    } else {
      return 'default';
    }
  };

  const getSectionIcon = (type) => {
    switch (type) {
      case 'introduction':
        return <FaBookOpen />;
      case 'key-points':
        return <FaLightbulb />;
      case 'code':
        return <FaCode />;
      default:
        return null;
    }
  };

  const formatListItems = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const listItems = lines.map(line => {
      // Check if this is a list item (starts with - or •)
      if (line.startsWith('-') || line.startsWith('•')) {
        return `<li>${cleanText(line)}</li>`;
      }
      return `<p>${line}</p>`;
    });
    
    // Group consecutive list items into <ul> elements
    let result = [];
    let currentList = [];
    
    listItems.forEach(item => {
      if (item.startsWith('<li>')) {
        currentList.push(item);
      } else {
        if (currentList.length > 0) {
          result.push(`<ul>${currentList.join('')}</ul>`);
          currentList = [];
        }
        result.push(item);
      }
    });
    
    if (currentList.length > 0) {
      result.push(`<ul>${currentList.join('')}</ul>`);
    }
    
    return result.join('');
  };

  const formatCodeBlock = (content) => {
    let formattedContent = content;
    
    // Replace code blocks with properly formatted HTML
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
    formattedContent = formattedContent.replace(codeBlockRegex, (match, code) => {
      return `<div class="code-block">
                <div class="code-header">
                  <span class="language">Code</span>
                </div>
                <div class="code-content">
                  <code>${code.trim()}</code>
                </div>
              </div>`;
    });
    
    // Replace inline code with properly formatted HTML
    const inlineCodeRegex = /`([^`]+)`/g;
    formattedContent = formattedContent.replace(inlineCodeRegex, (match, code) => {
      return `<code class="inline-code">${code}</code>`;
    });
    
    return formattedContent;
  };

  const formatSection = (section, index) => {
    const lines = section.split('\n');
    const title = cleanText(lines[0]);
    const content = lines.slice(1).join('\n');
    
    // Skip empty sections or sections with only a title
    if (!title.trim() || !content.trim()) {
      return null;
    }
    
    const sectionType = detectSectionType(title, content);
    const icon = getSectionIcon(sectionType);
    
    // Check if this is a Key Objectives section
    if (title.toLowerCase().includes('key objectives') || title.toLowerCase().includes('objectives')) {
      const listItems = content.split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .map(line => cleanText(line.replace(/^[-•]\s*/, '')));
      
      return (
        <div key={index} className="objectives-section" id={`section-${index}`}>
          <h2 className="objectives-title">{title}</h2>
          <ul className="objectives-list">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }
    
    // Check if this is an introduction section
    if (sectionType === 'introduction') {
      return (
        <div key={index} className="section" id={`section-${index}`}>
          <h2>{title}</h2>
          <div 
            className="topic-content"
            dangerouslySetInnerHTML={{ __html: formatListItems(formatCodeBlock(content)) }}
          />
        </div>
      );
    }
    
    // For other regular sections
    return (
      <div key={index} className="topic-section" id={`section-${index}`}>
        <div className="topic-header">
          <div className="topic-number">{index + 1}</div>
          <h3 className="topic-title">{title}</h3>
        </div>
        <div 
          className="topic-content"
          dangerouslySetInnerHTML={{ __html: formatListItems(formatCodeBlock(content)) }}
        />
        
        {/* Add example section if content contains example */}
        {content.toLowerCase().includes('example:') && (
          <div className="example-section">
            <div className="example-header">Example</div>
            <div className="example-content">
              {content.split('Example:')[1]?.split('\n')[0]?.trim() || 'No example provided'}
            </div>
          </div>
        )}
        
        {/* Add note section for key points */}
        {sectionType === 'key-points' && (
          <div className="note-section">
            <div className="note-header">Key Takeaway</div>
            <div className="note-content">
              {content.split('\n').filter(line => line.trim())[0] || 'Important information to remember'}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTableOfContents = () => {
    return (
      <div className="table-of-contents">
        <div className="toc-title">Table of Contents</div>
        <ul className="toc-list">
          {sectionTitles.map((title, index) => (
            <li key={index} className="toc-item">
              <a href={`#section-${index}`}>
                <span className="toc-number">{index + 1}</span>
                {title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderMetaInfo = () => {
    return (
      <div className="meta-info-card">
        <div className="meta-info-title">About This Summary</div>
        
        <div className="meta-info-item">
          <FaTag className="meta-info-icon" />
          <div className="meta-info-content">
            <div className="meta-info-label">Topic</div>
            <div className="meta-info-value">{topic}</div>
          </div>
        </div>
        
        <div className="meta-info-item">
          <FaCalendar className="meta-info-icon" />
          <div className="meta-info-content">
            <div className="meta-info-label">Generated On</div>
            <div className="meta-info-value">{getFormattedDate()}</div>
          </div>
        </div>
        
        <div className="meta-info-item">
          <FaClock className="meta-info-icon" />
          <div className="meta-info-content">
            <div className="meta-info-label">Reading Time</div>
            <div className="meta-info-value">{getEstimatedReadTime()}</div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Generating comprehensive summary for {topic}...</p>
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

  const sections = summary
    .split('\n\n')
    .map((section, index) => formatSection(section, index))
    .filter(section => section !== null);

  return (
    <div className="summary-container">
      <div className="summary-header">
        <h1>{topic}</h1>
        <button onClick={handleCopy} className="copy-button" aria-label="Copy summary">
          {copied ? <FaCheck /> : <FaCopy />}
        </button>
      </div>
      
      <div className="content-container">
        <div className="sidebar-left">
          {renderTableOfContents()}
        </div>
        
        <div className="main-content">
          {sections}
          
          {concepts.length > 0 && (
            <div className="section">
              <h2>Key Concepts</h2>
              <Flashcard concepts={concepts} />
            </div>
          )}
        </div>
        
        <div className="sidebar-right">
          {renderMetaInfo()}
        </div>
      </div>
    </div>
  );
};

export default Summary; 