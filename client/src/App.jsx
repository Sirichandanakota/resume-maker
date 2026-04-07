import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TemplatesPage from './pages/TemplatesPage';
import ResumeEditor from './pages/ResumeEditor';
import Footer from './components/Footer';

export default function App() {
  // We do NOT initialize currentPage from localStorage here 
  // so that refresh = back to home (as you requested).
  const [currentPage, setCurrentPage] = useState('home');
  
  // These stay in memory for the session
  const [template, setTemplate] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token to keep user "logged in" session-wise
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd fetch the user's name/email here
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (email, fullName) => {
    setUserEmail(email);
    setUserFullName(fullName);
    setCurrentPage('templates');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // We clear editor data on manual logout
    localStorage.removeItem('ResumeMaker_Shared_Data'); 
    setUserEmail('');
    setUserFullName('');
    setCurrentPage('home');
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage 
            onLogin={handleLoginSuccess} 
            onSwitchToSignUp={() => setCurrentPage('signup')} 
            onBack={() => setCurrentPage('home')} 
          />
        );
      case 'signup':
        return (
          <SignUpPage 
            onSignUp={handleLoginSuccess} 
            onSwitchToLogin={() => setCurrentPage('login')} 
            onBack={() => setCurrentPage('home')} 
          />
        );
      case 'templates':
        return (
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              <TemplatesPage 
                userEmail={userEmail} 
                userName={userFullName} 
                onSelect={(tmpl) => { setTemplate(tmpl); setCurrentPage('editor'); }} 
                onLogout={handleLogout} 
                onBack={() => setCurrentPage('home')} 
              />
            </div>
            <Footer />
          </div>
        );
      case 'editor':
        return (
          <ResumeEditor 
            key={template} 
            template={template} 
            userFullName={userFullName} 
            userEmail={userEmail} 
            onBack={() => setCurrentPage('templates')} 
          />
        );
      default:
        return (
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              <HomePage 
                userEmail={userEmail} 
                onLogout={handleLogout} 
                onNavigate={(p) => setCurrentPage(p)} 
              />
            </div>
            <Footer />
          </div>
        );
    }
  };

  return renderPage();
}
