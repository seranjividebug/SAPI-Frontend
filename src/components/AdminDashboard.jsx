import { useState, useEffect } from "react";
import QuestionEditor from './SAPI_E1_QuestionEditor';
import Sidebar from './SAPI_Sidebar';
import Dashboard from '../pages/admin/Dashboard';
import SubmissionsList from '../pages/admin/SubmissionsList';
import SubmissionDetail from '../pages/admin/SubmissionDetail';
import UsersSettingsPage from '../pages/admin/UsersSettingsPage';
import StubPage from '../pages/admin/StubPage';

export default function SAPIAdmin() {
  const [adminPage, setAdminPage] = useState('dashboard');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    setAdminPage('dashboard');
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('sapi_token');
    localStorage.removeItem('sapi_current_user');
    sessionStorage.removeItem('sapi_token');
    window.location.href = '/login';
  };

  const pageTitle = {
    submissionDetail: selectedSubmission ? `${selectedSubmission.country} — Assessment Detail` : 'Assessment Detail',
    leads: 'Leads Pipeline',
    leadDetail: 'Lead Detail',
    questionEditor: 'Question Editor',
    userMgmt: 'Users & Settings',
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <Sidebar
        adminPage={adminPage}
        setAdminPage={setAdminPage}
        onSignOut={handleSignOut}
      />
      <main className="flex-1 overflow-auto bg-[#F7F4EF]">
        {adminPage === 'dashboard' && (
          <Dashboard setAdminPage={setAdminPage} setSelectedSubmission={setSelectedSubmission} />
        )}
        {adminPage === 'submissions' && (
          <SubmissionsList setAdminPage={setAdminPage} setSelectedSubmission={setSelectedSubmission} setSelectedLead={setSelectedSubmission} />
        )}
        {adminPage === 'submissionDetail' && selectedSubmission && (
          <SubmissionDetail submission={selectedSubmission} onBack={() => setAdminPage('submissions')} />
        )}
        {adminPage === 'questionEditor' && <QuestionEditor />}
        {adminPage === 'userMgmt' && <UsersSettingsPage />}
        {adminPage !== 'dashboard' && adminPage !== 'submissions' && adminPage !== 'submissionDetail' && adminPage !== 'questionEditor' && adminPage !== 'userMgmt' && (
          <StubPage title={pageTitle[adminPage] || adminPage} />
        )}
      </main>
    </div>
  );
}
