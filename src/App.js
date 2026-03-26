import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SAPILanding from './components/SAPI_P1_Landing';
import SAPIPreview from './components/SAPI_P2_preview';
import SAPIBriefing from './components/SAPI_P3_Briefing';
import SAPIDimIntro from './components/SAPI_P4_DimIntro';
import SAPIQuiz from './components/SAPI_P5_Quiz';
import SAPICalculating from './components/SAPI_P6_Calculating';
import SAPIResults from './components/SAPI_P7_Results';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<SAPILanding />} />
          <Route path="/preview" element={<SAPIPreview />} />
          <Route path="/briefing" element={<SAPIBriefing />} />
          <Route path="/dimintro" element={<SAPIDimIntro />} />
          <Route path="/quiz" element={<SAPIQuiz />} />
          <Route path="/calculating" element={<SAPICalculating />} />
          <Route path="/results" element={<SAPIResults />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
