import React, { useState } from 'react';
import { User, ChevronRight, ArrowLeft, Award, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';

export default function SignUpPage({ onSignUp, onSwitchToLogin, onBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirmation
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Derived state for real-time visual feedback
  const isPasswordValid = password.length >= 6;
  const doPasswordsMatch = password !== '' && password === confirmPassword;
  const isReadyToSubmit = isPasswordValid && doPasswordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return; 
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return; 
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Try to create the account
      const response = await authAPI.signup(name, email, password);
      
      // If successful, store JWT token
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Extract just the first name to pass to the Templates page
      const firstName = name.trim().split(' ')[0];
      
      // Navigate away to the templates page
      onSignUp(email, firstName);

    } catch (err) {
      console.error("SignUp Error Caught:", err);
      setError(err?.response?.data?.error || err.message || 'Sign up failed. Please try again.');
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
        <ArrowLeft size={18} /> <span className="hidden sm:inline">Back to Home</span>
      </button>

      {/* Left Decorative Side */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="z-10 text-white text-center px-12">
          <Award size={80} className="mx-auto mb-6 text-blue-200" />
          <h2 className="text-4xl font-extrabold mb-4">Start Your Journey</h2>
          <p className="text-blue-100 text-lg leading-relaxed">Create your professional resume today and land your dream job tomorrow.</p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-100 mt-12 lg:mt-0">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <User size={28} className="text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium">Sign up to start building</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium text-center">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="you@example.com"
              />
            </div>
            
            {/* MAIN PASSWORD */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className={`w-full p-3 sm:p-3.5 border ${password && !isPasswordValid ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'} rounded-xl focus:ring-4 outline-none transition-all font-medium bg-slate-50 focus:bg-white text-sm sm:text-base`}
                placeholder="Enter Password "
              />
              {password && !isPasswordValid && (
                <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">Must be at least 6 characters</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className={`w-full p-3 sm:p-3.5 pr-10 border ${confirmPassword && !doPasswordsMatch ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'} rounded-xl focus:ring-4 outline-none transition-all font-medium bg-slate-50 focus:bg-white text-sm sm:text-base`}
                  placeholder="Re-enter Password"
                />
                {/* THE TICK MARK */}
                {isReadyToSubmit && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500 bg-white rounded-full">
                    <CheckCircle size={20} strokeWidth={2.5} />
                  </div>
                )}
              </div>
              {confirmPassword && !doPasswordsMatch && (
                <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">Passwords do not match</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading || !isReadyToSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 sm:py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-6 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? 'Creating Account...' : 'Sign Up'} {!loading && <ChevronRight size={20} />}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            Already have an account? <button type="button" onClick={onSwitchToLogin} className="text-blue-600 font-extrabold hover:text-blue-800 ml-1">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}
