import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { AlertProvider } from './contexts/AlertContext';
import Dashboard from './components/user/Dashboard';
import Layout from './components/user/Layout.js';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import Signup from './components/Signup.js';
import Signin from './components/Signin.js';
import Setup from './components/Setup.js';
import Home from './components/Home.js';
import Alert from './components/Alert';
import './index.css';
import UserProfile from './components/user/UserProfile.js';
import { LoadingProvider, useLoading } from './contexts/LoadingContext.js';
import LoadingBar from './components/LoadingBar.js';
import { UserProvider } from './contexts/UserContext.js'; // import the provider

function App() {
  const location = useLocation();
  const previousLocation = useRef(location.pathname); // Track the previous location
  const { showLoading, hideLoading, setLoadingProgress } = useLoading();

  useEffect(() => {
    // Only trigger loading bar if the route has changed
    if (location.pathname !== previousLocation.current) {
      previousLocation.current = location.pathname; // Update previous location

      // Start loading bar on route change
      showLoading();
      setLoadingProgress(20); // Initial progress

      // Simulate progress during route change
      const interval = setInterval(() => {
        setLoadingProgress((prevProgress) => (prevProgress < 80 ? prevProgress + 10 : prevProgress));
      }, 200);

      // Finish loading after a slight delay to simulate page load
      return () => {
        clearInterval(interval);
        setLoadingProgress(100); // Complete the loading
        setTimeout(() => {
          hideLoading(); // Hide the loading bar
        }, 500);
      };
    }
  }, [location, showLoading, hideLoading, setLoadingProgress]);

  const showNavbarAndFooter = !['/signin', '/signup', '/setup', '/dashboard', '/profile'].includes(location.pathname);
  return (
    <div className="App">
      {showNavbarAndFooter && <Navbar />}
      <Alert /> {/* Include the Alert component here */}
      <LoadingBar />
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />

        {/* Wrap with Layout Routes*/}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/profile" element={<Layout><UserProfile /></Layout>} />
      </Routes>
      {showNavbarAndFooter && <Footer />}
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <AlertProvider>
      <LoadingProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </LoadingProvider>
    </AlertProvider>
  </Router>
);

export default AppWrapper;
