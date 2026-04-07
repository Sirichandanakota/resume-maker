import React, { useState } from 'react';
import { Lock, ChevronRight, ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/api';

export default function LoginPage({ onLogin, onSwitchToSignUp, onBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    // Error stays visible while loading...

    try {
      if (!name || !email || !password) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }

      const response = await authAPI.login(email, password);
      
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        setError(''); // SUCCESS: Clear error before moving
        onLogin(email, response.data.name || name);
      }
    } catch (err) {
      console.error("Login attempt failed:", err);
      // FAILURE: Error stays strictly here until next attempt or refresh
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex font-sans bg-white relative overflow-hidden">
      <button type="button" onClick={onBack} className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold z-20 bg-white/80 px-4 py-2 rounded-full shadow-sm backdrop-blur text-sm sm:text-base">
        <ArrowLeft size={18} /> <span>Back to Home</span>
      </button>

      <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="z-10 text-white text-center px-12">
          <FileText size={80} className="mx-auto mb-6 text-blue-200" />
          <h2 className="text-4xl font-extrabold mb-4">ResumeMaker</h2>
          <p className="text-blue-100 text-lg leading-relaxed">Sign in to manage your professional identity.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Lock size={28} className="text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h1>
          </div>

          {/* THE ERROR: designed to stay strictly on the page */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <p className="text-red-700 text-sm font-bold leading-tight">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-all font-medium bg-slate-50" placeholder="Full Name" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-all font-medium bg-slate-50" placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-all font-medium bg-slate-50" placeholder="••••••••" />
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 shadow-lg disabled:opacity-70">
              {loading ? 'Verifying...' : 'Sign In'} {!loading && <ChevronRight size={20} />}
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
