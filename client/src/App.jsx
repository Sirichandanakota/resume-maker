import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TemplatesPage from './pages/TemplatesPage';
import ResumeEditor from './pages/ResumeEditor';
import Footer from './components/Footer';

export default function App() {
  // 1. Initialize state from localStorage so refresh doesn't reset to 'home'
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('lastVisitedPage') || 'home';
  });
  
  const [template, setTemplate] = useState(() => {
    return localStorage.getItem('selectedTemplate') || null;
  });

  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const [userFullName, setUserFullName] = useState(localStorage.getItem('userFullName') || '');
  const [isLoading, setIsLoading] = useState(true);

  // 2. Save page state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lastVisitedPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (template) localStorage.setItem('selectedTemplate', template);
  }, [template]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, verify token here
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (email, fullName) => {
    setUserEmail(email);
    setUserFullName(fullName);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userFullName', fullName);
    setCurrentPage('templates');
  };

  const handleSignUp = (email, fullName) => {
    setUserEmail(email);
    setUserFullName(fullName);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userFullName', fullName);
    setCurrentPage('templates');
  };

  const handleLogout = () => {
    localStorage.clear(); // Clears token, page state, and user info
    setUserEmail('');
    setUserFullName('');
    setTemplate(null);
    setCurrentPage('home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToSignUp={() => setCurrentPage('signup')}
            onBack={() => setCurrentPage('home')}
          />
        );
      case 'signup':
        return (
          <SignUpPage
            onSignUp={handleSignUp}
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
                onSelect={(tmpl) => {
                  setTemplate(tmpl);
                  setCurrentPage('editor');
                }}
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
                onNavigate={(page) => setCurrentPage(page)}
              />
            </div>
            <Footer />
          </div>
        );
    }
  };

  return renderPage();
}
