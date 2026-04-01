import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import SAPILanding from './components/SAPI_P1_Landing';
import SAPIPreview from './components/SAPI_P2_preview';
import SAPIBriefing from './components/SAPI_P3_Briefing';
import SAPIDimIntro from './components/SAPI_P4_DimIntro';
import SAPIQuiz from './components/SAPI_P5_Quiz';
import SAPICalculating from './components/SAPI_P6_Calculating';
import SAPIResults from './components/SAPI_P7_Results';
import SAPIScorecard from './components/SAPI_P8_Scorecard';
import SAPIPeerComparison from './components/SAPI_P9_PeerComparison';
import SAPIRoadmap from './components/SAPI_P10_Roadmap';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Wrapper component to handle dimension navigation
function DimIntroWrapper({ currentDimension, setCurrentDimension }) {
  const navigate = useNavigate();
  
  return (
    <SAPIDimIntro 
      currentIndex={currentDimension}
      onBegin={() => navigate('/quiz')}
      onBack={() => {
        if (currentDimension === 0) {
          navigate('/briefing');
        } else {
          setCurrentDimension(currentDimension - 1);
        }
      }}
    />
  );
}

// Wrapper component to handle quiz navigation
function QuizWrapper({ currentDimension, setCurrentDimension }) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  
  return (
    <SAPIQuiz 
      appState={{ currentDimension, answers }}
      setAppState={(newState) => {
        setAnswers(newState.answers || answers);
        if (newState.currentDimension !== undefined) {
          setCurrentDimension(newState.currentDimension);
        }
      }}
      setCurrentPage={(page) => {
        if (page === 'dimIntro') {
          setCurrentDimension(currentDimension + 1);
          navigate('/dimintro');
        } else if (page === 'calculating') {
          navigate('/calculating');
        }
      }}
    />
  );
}

function App() {
  const [currentDimension, setCurrentDimension] = useState(0);

  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<SAPILanding />} />
          <Route path="/preview" element={<SAPIPreview />} />
          <Route path="/briefing" element={<SAPIBriefing />} />
          <Route 
            path="/dimintro" 
            element={<DimIntroWrapper 
              currentDimension={currentDimension} 
              setCurrentDimension={setCurrentDimension}
            />} 
          />
          <Route 
            path="/quiz" 
            element={<QuizWrapper 
              currentDimension={currentDimension}
              setCurrentDimension={setCurrentDimension}
            />} 
          />
          <Route path="/calculating" element={<SAPICalculating />} />
          <Route path="/results" element={<SAPIResults />} />
          <Route path="/scorecard" element={<SAPIScorecard />} />
          <Route path="/peercomparison" element={<SAPIPeerComparison />} />
          <Route path="/roadmap" element={<SAPIRoadmap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
