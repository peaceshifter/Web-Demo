
import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';

export const CustomerAuth: React.FC = () => {
  const { customerLogin, customerSignup, currentStore } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');

  const themeColor = currentStore?.themeColor || 'gray';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = customerLogin(formData.email, formData.password);
      if (success) {
        navigate(redirect);
      } else {
        setError('Invalid email or password.');
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required fields.');
        return;
      }
      customerSignup(formData);
      navigate(redirect);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  if (!currentStore) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <Link to="/" className="absolute top-6 left-6 text-gray-500 hover:text-black flex items-center gap-2 font-medium">
         <ArrowLeft size={20} /> Back to Store
      </Link>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
        {/* Header */}
        <div className={`bg-${themeColor}-600 p-8 text-center text-white`}>
           <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
           <p className="opacity-90">{isLogin ? 'Sign in to access your orders' : 'Join us for exclusive offers'}</p>
        </div>

        <div className="p-8">
           {error && (
             <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium mb-6 border border-red-100">
               {error}
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-4">
             {!isLogin && (
               <>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                   <div className="relative">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                     <input 
                       name="name"
                       required={!isLogin}
                       className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                       placeholder="John Doe"
                       onChange={handleChange}
                     />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                   <input 
                       name="phone"
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                       placeholder="+1 (555) 000-0000"
                       onChange={handleChange}
                   />
                </div>
               </>
             )}

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
               <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   name="email"
                   type="email"
                   required
                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                   placeholder="you@example.com"
                   onChange={handleChange}
                 />
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
               <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   name="password"
                   type="password"
                   required
                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                   placeholder="••••••••"
                   onChange={handleChange}
                 />
               </div>
             </div>

             <button 
               type="submit" 
               className={`w-full bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 mt-4`}
             >
               {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={20} />
             </button>
           </form>

           <div className="mt-6 text-center">
             <button 
                onClick={() => setIsLogin(!isLogin)}
                className={`text-${themeColor}-600 font-bold hover:underline text-sm`}
             >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
