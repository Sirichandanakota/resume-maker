import React, { useState } from 'react';
import { User, ChevronRight, ArrowLeft, Award } from 'lucide-react';
import { authAPI } from '../services/api';

export default function SignUpPage({ onSignUp, onSwitchToLogin, onBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const response = await authAPI.signup(name, email, password);
      
      // Store JWT token
      localStorage.setItem('token', response.data.token);
      
      // Call onSignUp callback to navigate to templates page
      onSignUp(email, name);
    } catch (err) {
      setError(err.response?.data?.error || 'Sign up failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white relative">
      <button 
        onClick={onBack} 
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold z-20 bg-white/80 px-4 py-2 rounded-full shadow-sm backdrop-blur transition-all"
      >
        <ArrowLeft size={18} /> Back to Home
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <User size={28} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium">Sign up to start building</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full p-3.5 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white" 
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-3.5 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white" 
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-3.5 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white" 
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-6 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'} {!loading && <ChevronRight size={20} />}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            Already have an account? <button onClick={onSwitchToLogin} className="text-blue-600 font-extrabold hover:text-blue-800 ml-1">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}
