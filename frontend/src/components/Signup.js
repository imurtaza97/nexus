import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PhoneInputWithDropdown from './PhoneInputWithDropdown';
import { useAlert } from '../contexts/AlertContext';
import { useLoading } from '../contexts/LoadingContext';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();  // Initialize the navigate function
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { addAlert } = useAlert();
  const { showLoading, hideLoading, setLoadingProgress } = useLoading();
  const { user, loading } = useUser();  // Use user context
  // useEffect to handle user navigation based on user status
  useEffect(() => {
    if (user && !loading) {
      const { isPaid, isSubscriptionActive } = user;

      if (!isPaid) {
        navigate('/setup');
      } else if (!isSubscriptionActive) {
        navigate('/renew');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate]);



  const handlePhoneChange = (newPhone) => {
    setPhone(newPhone);
  };

  const handleCountryCodeChange = (newCountryCode) => {
    setCountryCode(newCountryCode.toString());
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  // Password validation function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading();
    setLoadingProgress(20);
    if (!termsAccepted) {
      addAlert('error', 'Please accept the terms and conditions to proceed.');
      hideLoading();
      return;
    }

    if (!validatePassword(password)) {
      addAlert('error', 'Password must be at least 6 characters and include a letter, number, and special character.');
      hideLoading();
      return;
    }

    const formattedPhone = `${countryCode} ${phone}`;

    try {
      setLoadingProgress(50); // After validation
      const response = await axios.post('/api/signup', {
        name,
        organizationName,
        email,
        phone: formattedPhone,
        password,
        designation,
        termsAccepted
      });
      setLoadingProgress(80);
      localStorage.setItem('authToken', response.data.token);

      // Handle successful response
      const message = typeof response.data.message === 'object' ? JSON.stringify(response.data.message) : response.data.message;
      addAlert('success', message);

      setLoadingProgress(100); // Complete
      // Redirect to the setup page
      navigate('/setup');
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
  };


  return (
    <div className="flex w-full flex-wrap">
      <div className="flex w-full flex-col md:w-1/2 lg:w-1/3">
        <div className="my-auto flex flex-col justify-center px-6 pt-8 sm:px-24 md:justify-start md:px-8 md:pt-0 lg:px-12">
          <Link to="/" className="flex justify-center items-center space-x-3 rtl:space-x-reverse">
            <img src="/images/dark_logo.png" className="h-9" alt="Flowbite Logo" />
          </Link>
          <p className="text-center text-3xl font-bold">Welcome</p>
          <p className="mt-2 text-center">SignUp to Get Started.</p>

          <form className="max-w-lg m-5" onSubmit={handleSubmit}>
            {/* Name Input */}
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
            <div className="relative my-2">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lucide lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" /></svg>
              </div>
              <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full ps-10 p-2.5" placeholder="Johan Berry" required />
            </div>

            {/* Organization Name Input */}
            <label htmlFor="organizationName" className="block mb-2 text-sm font-medium text-gray-900">Organization Name</label>
            <div className="relative my-2">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
              </div>
              <input type="text" id="organizationName" name="organizationName" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full ps-10 p-2.5" placeholder="Johan INC." required />
            </div>

            {/* Email Input */}
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
            <div className="relative my-2">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
              <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full ps-10 p-2.5" placeholder="johanb9@gmail.com" autoComplete="email" required />
            </div>

            {/* Phone Input */}
            <label htmlFor="phone-input" className="block mb-2 text-sm font-medium text-gray-900">Phone</label>
            <PhoneInputWithDropdown phone={phone} countryCode={countryCode} onPhoneChange={handlePhoneChange} onCountryCodeChange={handleCountryCodeChange} />

            {/* Password Input */}
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <div className="relative my-2">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rectangle-ellipsis"><rect width="20" height="12" x="2" y="6" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" /></svg>
              </div>
              <input type={showPassword ? "text" : "password"} id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full ps-10 p-2.5" placeholder="••••••••" autoComplete="current-password" required />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute text-sm inset-y-0 m-2 end-0 flex items-center ps-3.5"
              >
                {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>}
              </button>
            </div>

            {/* Designation Input */}
            <label htmlFor="designation" className="block mb-2 text-sm font-medium text-gray-900">Designation</label>
            <div className="relative my-2">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lucide lucide-tag"><path d="M3 7V3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4M21 14l-9 9-6-6 9-9 6 6zM2 7l6-6 6 6-6 6L2 7z" /></svg>
              </div>
              <input type="text" id="designation" name="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full ps-10 p-2.5" placeholder="Manager" required />
            </div>
            {/* Terms and Conditions Input */}
            <div className="flex items-start my-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={handleTermsChange}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-customPrimaryHover"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-900">
                  I accept the{' '}
                  <Link to="#" className="text-customPrimaryHover hover:underline">Terms and Conditions</Link>
                </label>
              </div>
            </div>

            {/* Submit Input */}
            <button type="submit" className="text-white bg-customPrimary hover:bg-customPrimaryHover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-2">Signup</button>
          </form>
          <div className="pt-10 text-center">
            <p className="whitespace-nowrap">
              Already have an account?
              <Link to="/signin" className="font-semibold underline"> Login here. </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none hidden select-none bg-black shadow-2xl md:block md:w-1/2 lg:w-2/3">
        <img className="h-screen w-full object-cover opacity-90" src="https://images.unsplash.com/photo-1598124063621-f438492d4137?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="signup-head" />
      </div>
    </div>
  );
};

export default Signup;
