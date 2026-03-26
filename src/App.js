import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SAPI_P1_Landing from './components/SAPI_P1_Landing';
import SAPI_P2_preview from './components/SAPI_P2_preview';
import SAPI_P3_Briefing from './components/SAPI_P3_Briefing';
import SAPI_P4_DimIntro from './components/SAPI_P4_DimIntro';
import SAPI_P5_Quiz from './components/SAPI_P5_Quiz';
import SAPI_P6_Calculating from './components/SAPI_P6_Calculating';
import SAPI_P7_Results from './components/SAPI_P7_Results';

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
          <Route path="/" element={<SAPI_P1_Landing />} />
          <Route path="/preview" element={<SAPI_P2_preview />} />
          <Route path="/briefing" element={<SAPI_P3_Briefing />} />
          <Route path="/dimintro" element={<SAPI_P4_DimIntro />} />
          <Route path="/quiz" element={<SAPI_P5_Quiz />} />
          <Route path="/calculating" element={<SAPI_P6_Calculating />} />
          <Route path="/results" element={<SAPI_P7_Results />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
