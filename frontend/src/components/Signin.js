import React, { useState, useEffect } from 'react'
import { useAlert } from '../contexts/AlertContext';
import { Link, useNavigate } from 'react-router-dom';
import { useLoading } from '../contexts/LoadingContext';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { addAlert } = useAlert();
  const { showLoading, hideLoading, setLoadingProgress } = useLoading();
  const { user, loading } = useUser();  // Use user context
  const navigate = useNavigate();

  useEffect(() => {
    // Only proceed once loading is complete
    if (!loading) {
      if (user) {  // If the user is authenticated
        const { isPaid, isSubscriptionActive } = user;

        if (!isPaid) {
          navigate('/setup');
        } else if (!isSubscriptionActive) {
          navigate('/renew');
        } else {
          navigate('/dashboard');
        }
      }
    }
  }, [user, loading, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Password validation function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading();

    if (!email) {
      setLoadingProgress(20); // Email validation stage
      addAlert('error', 'Please enter Email to proceed.');
      hideLoading();
      return;
    }

    if (!validatePassword(password)) {
      setLoadingProgress(30); // Password validation stage
      addAlert('error', 'Password must be at least 6 characters and include a letter, number, and special character.');
      hideLoading();
      return;
    }

    try {
      setLoadingProgress(50); // After validation
      const response = await axios.post('/api/login', { email, password });

      setLoadingProgress(80); // After successful response
      localStorage.setItem('authToken', response.data.token);
      // Redirect the user to the appropriate page after login
      navigate('/dashboard');
      setLoadingProgress(100); // Complete
    } catch (error) {
      setLoadingProgress(70); // Handle error
      let errorMessage = 'An unexpected error occurred. Please try again later.';

      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.request) {
        // No response received
        errorMessage = 'No response from server.';
      } else {
        // Error setting up request
        errorMessage = error.message || errorMessage;
      }

      addAlert('error', errorMessage);
    } finally {
      hideLoading();
    }
  }
  return (
    <div>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <a href="/" className="flex justify-center items-center mb-6 text-2xl font-semibold text-gray-900 ">
                <img src="/images/dark_logo.png" className="h-9" alt="Logo" />
              </a>
              <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Sign in
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
                  <div className="relative my-2">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                    </div>
                    <input type="text" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full ps-10 p-2.5" placeholder="johanb9@gmail.com" autoComplete='' value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                  <div className="relative my-2">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rectangle-ellipsis"><rect width="20" height="12" x="2" y="6" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" /></svg>
                    </div>
                    <input type={showPassword ? "text" : "password"} id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full ps-10 p-2.5" placeholder="••••••••" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute text-sm inset-y-0 m-2 end-0 flex items-center ps-3.5"
                    >
                      {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-customPrimaryHover" required="" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500">Remember me</label>
                    </div>
                  </div>
                  <a href="/" className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</a>
                </div>
                <button type="submit" className="text-white bg-customPrimary hover:bg-customPrimaryHover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-2" >SignIn</button>
                <p className="text-sm font-light text-gray-500">
                  Don’t have an account yet? <Link to="/signup" className="font-medium text-primary-600 hover:underline">Sign up</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Signin
