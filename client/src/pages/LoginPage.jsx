import React, { useState } from 'react';
import { Lock, ChevronRight, ArrowLeft, FileText } from 'lucide-react';
import { authAPI } from '../services/api';

export default function LoginPage({ onLogin, onSwitchToSignUp, onBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // STOPS browser refresh
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // 1. CALL THE API
      const response = await authAPI.login(email, password);
      
      // 2. SUCCESS: If we get here, the API returned 200 OK
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      const fullName = response?.data?.name || name;
      const firstName = fullName.trim().split(' ')[0]; // Extract first name
      
      // 3. NAVIGATE: Only happens if login is successful
      onLogin(email, firstName);

    } catch (err) {
      // 4. FAILURE: Catch 401, 404, or 500 errors
      console.error("Login attempt failed:", err);
      
      // Update UI with error message instead of navigating
      setError(err?.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white relative">
      <button 
        type="button" 
        onClick={onBack} 
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold z-20 bg-white/80 px-4 py-2 rounded-full shadow-sm backdrop-blur transition-all text-sm sm:text-base"
      >
        <ArrowLeft size={18} /> <span>Back to Home</span>
      </button>

      <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="z-10 text-white text-center px-12">
          <FileText size={80} className="mx-auto mb-6 text-blue-200" />
          <h2 className="text-4xl font-extrabold mb-4">ResumeMaker</h2>
          <p className="text-blue-100 text-lg leading-relaxed">Log in to access your saved resumes and continue building your professional career.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-100 mt-12 lg:mt-0">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Lock size={28} className="text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium text-center">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full p-3 sm:p-3.5 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white text-sm sm:text-base" 
                placeholder="Enter your full name" 
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-3 sm:p-3.5 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white text-sm sm:text-base" 
                placeholder="username@example.com" 
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-3 sm:p-3.5 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white text-sm sm:text-base" 
                placeholder="Enter Password" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 sm:py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'} {!loading && <ChevronRight size={20} />}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            Don't have an account? <button type="button" onClick={onSwitchToSignUp} className="text-blue-600 font-extrabold hover:text-blue-800 ml-1">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}
