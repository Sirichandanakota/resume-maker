import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TemplatesPage from './pages/TemplatesPage';
import ResumeEditor from './pages/ResumeEditor';
import Footer from './components/Footer';

export default function App() {
  // --- PERSISTENCE INITIALIZATION ---
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('RM_current_page') || 'home';
  });

  const [template, setTemplate] = useState(() => {
    return localStorage.getItem('RM_selected_template') || null;
  });

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('RM_user_email') || '';
  });

  const [userFullName, setUserFullName] = useState(() => {
    return localStorage.getItem('RM_user_fullname') || '';
  });

  const [isLoading, setIsLoading] = useState(true);

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    localStorage.setItem('RM_current_page', currentPage);
    localStorage.setItem('RM_user_email', userEmail);
    localStorage.setItem('RM_user_fullname', userFullName);
    if (template) {
      localStorage.setItem('RM_selected_template', template);
    }
  }, [currentPage, userEmail, userFullName, template]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleLogin = (email, fullName) => {
    setUserEmail(email);
    setUserFullName(fullName);
    setCurrentPage('templates');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('RM_current_page');
    localStorage.removeItem('RM_user_email');
    localStorage.removeItem('RM_user_fullname');
    localStorage.removeItem('RM_selected_template');
    localStorage.removeItem('ResumeMaker_Shared_Data'); 

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
            onSignUp={handleLogin} 
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
                userName={userFullName ? userFullName.split(' ')[0] : 'User'}
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
                onNavigate={(page) => setCurrentPage(page)}
              />
            </div>
            <Footer />
          </div>
        );
    }
  };

  return <>{renderPage()}</>;
}
