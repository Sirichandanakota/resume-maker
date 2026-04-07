import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TemplatesPage from './pages/TemplatesPage';
import ResumeEditor from './pages/ResumeEditor';
import Footer from './components/Footer';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [template, setTemplate] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd fetch the user profile here to get the name/email
      // For now, we assume if token exists, they are valid
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (email, fullName) => {
    setUserEmail(email);
    setUserFullName(fullName);
    setCurrentPage('templates');
  };

  const handleSignUp = (email, fullName) => {
    setUserEmail(email);
    setUserFullName(fullName);
    setCurrentPage('templates');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserEmail('');
    setUserFullName('');
    setCurrentPage('home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Routing Logic
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
                userName={userFullName} // Passing full name; TemplatePage splits it
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
