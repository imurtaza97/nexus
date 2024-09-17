import React, { useState, useEffect } from 'react';
import { Country, State } from 'country-state-city';
import { currencies } from 'currencies.json';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAlert } from '../contexts/AlertContext';
import { format } from 'date-fns';
import timezones from 'timezones-list';
import axios from 'axios';
import { useLoading } from '../contexts/LoadingContext';
import { useUser } from '../contexts/UserContext';  // Import UserContext

const Setup = () => {
    const [step, setStep] = useState(1);
    const [plans, setPlans] = useState([]);
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [pin, setPin] = useState('');
    const [isGst, setIsGst] = useState(false);
    const [gstin, setGstin] = useState('');
    const [timeZone, setTimeZone] = useState('');
    const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
    const [currency, setCurrency] = useState('');
    const [theme, setTheme] = useState('Light');
    const [selectedPlan, setSelectedPlan] = useState('');
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const { addAlert } = useAlert();
    const { showLoading, hideLoading, setLoadingProgress } = useLoading();
    const { user } = useUser();

    useEffect(() => {
        if (!user) {
            // If user is not available in the context, redirect to signup
            navigate('/signup');
        } else if (user.isPaid) {
            // If user has already paid, redirect to dashboard
            navigate('/dashboard');
        }

        const allCountries = Country.getAllCountries();
        setCountries(allCountries);

        const fetchPlansData = async () => {
            try {
                const response = await axios.get('/api/plans');
                setPlans(response.data);
            } catch (error) {
                let errorMessage = 'An unexpected error occurred. Not Able to Fatch Plans!';

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
            }
        };
        fetchPlansData();
    }, [navigate, user, addAlert]);

    const handleCountryChange = (event) => {
        const selectedCountry = event.target.value;
        setCountry(selectedCountry);
        const relatedStates = State.getStatesOfCountry(selectedCountry);
        setStates(relatedStates);
        setState('');
    };

    const dateFormats = {
        'MM/DD/YYYY': 'MM/dd/yyyy',
        'DD/MM/YYYY': 'dd/MM/yyyy',
        'YYYY/MM/DD': 'yyyy/MM/dd',
        'YYYY-MM-DD': 'yyyy-MM-dd',
        'MM-DD-YYYY': 'MM-dd-yyyy',
        'DD-MM-YYYY': 'dd-MM-yyyy',
        'YYYY.MM.DD': 'yyyy.MM.dd',
        'DD.MM.YYYY': 'dd.MM.yyyy'
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrev = () => {
        setStep(step - 1);
    };

    const handleIsGst = (event) => {
        setIsGst(event.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Submit form data to backen
        showLoading();
        await submitForm();
    }

    const submitForm = async () => {
        setLoadingProgress(50);
        // Check for missing required fields
        if (!address || !country || !state || !pin) {
            addAlert('error', 'Please complete all steps and choose a plan.');
            hideLoading();
            return;
        }

        // Check if GSTIN is required and provided
        if (isGst === true && !gstin) {
            addAlert('error', 'Please enter your GSTIN.');
            hideLoading();
            return;
        }

        try {
            // Send setup data to backend
            setLoadingProgress(80);
            const response = await axios.post('/api/setup/', {
                address,
                country,
                state,
                pin,
                isGst,
                gstin,
                timeZone,
                dateFormat,
                currency,
                theme,
                selectedPlan
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Set the token in the Authorization header
                }
            });

            // Handle successful response
            const message = typeof response.data.message === 'object' ? JSON.stringify(response.data.message) : response.data.message;
            addAlert('success', message);

            // Set isSetupComplete flag in local storage
            localStorage.setItem('isSetupComplete', 'true');

            // Check if setup is complete and handle payment
            const isSetupComplete = localStorage.getItem('isSetupComplete') === 'true';
            if (isSetupComplete) {
                handlePayment();
            } else {
                addAlert('error', 'Setup is not complete. Please finish all required steps before processing payment.');
            }
            setLoadingProgress(100);
        } catch (error) {
            setLoadingProgress(70);
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

    const getCurrentDate = () => {
        const now = new Date();
        // Adjust for timezone offset
        const formatString = dateFormats[dateFormat] || 'yyyy-MM-dd';
        return format(now, formatString);
    };

    const getPlanAmount = () => {
        const selectedPlanObj = plans.find(plan => plan._id === selectedPlan);
        return selectedPlanObj ? selectedPlanObj.price : 0;
    };

    const handlePayment = async () => {
        try {
            showLoading();
            setLoadingProgress(50);
            const price = getPlanAmount();
            const selectedPlanId = selectedPlan; // This should hold the ID of the selected plan

            const response = await axios.post('/api/create-order', {
                amount: price, // Replace with the selected plan's price
                planId: selectedPlanId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const { orderId, amount, currency, paymentToken } = response.data;

            // Store the paymentToken in localStorage
            localStorage.setItem('paymentToken', paymentToken);

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Add your Razorpay key id
                amount: amount.toString(), // Amount in paise
                currency: currency,
                name: "Your Company Name",
                description: "Payment for selected plan",
                order_id: orderId,
                handler: async (response) => {
                    try {
                        const paymentToken = localStorage.getItem('paymentToken');

                        await axios.post('/api/verify-payment', {
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            paymentToken
                        }, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            responseType: 'blob' // Important for file download
                        });
                        setLoadingProgress(80);
                        navigate('/dashboard');
                        addAlert('success', 'Payment Successful!');
                        localStorage.removeItem('paymentToken');
                        localStorage.setItem('isSetupComplete', '');

                        setLoadingProgress(100);
                    } catch (error) {
                        setLoadingProgress(70);
                        let errorMessage = 'Payment verification failed. Please try again or contact us for assistance.';

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

                        addAlert('error', errorMessage);;
                    }
                },
                prefill: {
                    name: user?.userName || '',
                    email: user?.email || '',
                    contact: user?.contact || ''
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
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

            addAlert('error', errorMessage);;
        } finally {
            hideLoading();
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    return (
        <>
            <header className='flex w-full justify-between items-center h-14'>
                <img src="/images/dark_logo.png" className="h-9 m-1" alt="Logo" />

                <div className='m-3'>
                    <button type="button" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300" aria-expanded="false" onClick={toggleDropdown}>
                        <span className="sr-only">Open user menu</span>
                        <img className="w-8 h-8 rounded-full" src="https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg" alt="user" />
                    </button>
                    <div className={`absolute top-7 right-1 z-50 my-6 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow ${dropdownOpen ? '' : 'hidden'}`}>
                        <div className="px-4 py-3">
                            <span className="block text-sm text-gray-900">{user?.user?.organization?.name || 'Organization'}</span>
                            <span className="block text-sm text-gray-500 truncate">{user?.user?.userName || 'Username'}</span>
                        </div>
                        <ul className="py-2" aria-labelledby="user-menu-button">
                            <li>
                                <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
            <div className='flex flex-col items-center py-20 bg-slate-100 h-navbarMinus'>
                {/* Steps */}
                <h2 className='font-bold text-xl m-2'>Setting Up Your Account</h2>
                <ol className="flex justify-center items-center w-full text-sm font-medium text-center text-gray-500  sm:text-base md:max-w-xl">
                    <li className="flex md:w-full items-center text-customPrimary sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10">
                        <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                            <span className="me-2">1</span>
                            Personal <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                        </span>
                    </li>
                    <li className={`flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ${step >= 2 ? 'text-customPrimary' : ''}`}>
                        <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                            <span className="me-2">2</span>
                            Account <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                        </span>
                    </li>
                    <li className={`flex items-center ${step === 3 ? 'text-customPrimary' : ''}`}>
                        <span className="me-2">3</span>
                        Confirmation
                    </li>
                </ol>
                {/* Form */}
                <div className='w-full bg-white rounded-lg shadow sm:max-w-md p-5 m-5'>
                    {step === 1 && <div>
                        {/* Organization Addresss Input */}
                        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Address</label>
                        <div className="relative my-2">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                            </div>
                            <input type="text" id="address" name="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full ps-10 p-2.5 " placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </div>
                        {/* Country and State selection Input */}
                        <div className='flex justify-between'>
                            <div className='w-full p-1'>
                                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 ">Country</label>
                                <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={country} onChange={handleCountryChange}>
                                    <option value="">Choose a country</option>
                                    {countries.map((c) => (
                                        <option key={c.isoCode} value={c.isoCode}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='w-full p-1'>
                                <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900 ">State</label>
                                <select id="state" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={state} onChange={(e) => setState(e.target.value)}>
                                    <option value="">Choose a State</option>
                                    {states.map((s) => (
                                        <option key={s.isoCode} value={s.isoCode}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Pincode Input */}
                        <label htmlFor="pincode" className="block mb-2 text-sm font-medium text-gray-900">Pincode</label>
                        <div className="relative my-2">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin"><path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" /></svg>
                            </div>
                            <input type="text" id="pincode" name="pincode" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full ps-10 p-2.5 " placeholder="Pincode" value={pin} onChange={(e) => setPin(e.target.value)} required />
                        </div>
                        {/* GST Checkbox */}
                        <div className="flex items-start my-2">
                            <div className="flex items-center h-5">
                                <input
                                    id="gst"
                                    aria-describedby="gst"
                                    type="checkbox"
                                    onChange={handleIsGst}
                                    checked={isGst} // Make checkbox controlled by state    
                                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-customPrimaryHover"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="gst" className="font-medium text-gray-900">
                                    Is your business gst registered?
                                </label>
                            </div>
                        </div>
                        {/* GSTIN Input */}
                        {isGst === true && (
                            <div className="relative my-2">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hash"><line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" /></svg>
                                </div>
                                <input type="text" id="GSTIN" name="GSTIN" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full ps-10 p-2.5" placeholder="GSTIN" value={gstin} onChange={(e) => setGstin(e.target.value)} required={isGst} />
                            </div>
                        )}
                    </div>
                    }
                    {step === 2 && <div>
                        {/* TimeZone */}
                        <div className='w-full p-1'>
                            <label htmlFor="timezone" className="block mb-2 text-sm font-medium text-gray-900">Timezone</label>
                            <select id="timezone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
                                <option>Choose a TimeZone</option>
                                {timezones.map((t) => (
                                    <option key={t.tzCode} value={t.tzCode}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Date Fromate */}
                        <div className='w-full p-1'>
                            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900">Date Format</label>
                            <select id="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
                                <option value="">Choose a Date Format</option>
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                                <option value="YYYY.MM.DD">YYYY.MM.DD</option>
                                <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                            </select>
                        </div>
                        {/* Currency */}
                        <div className='w-full p-1'>
                            <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900">Currency</label>
                            <select id="currency" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                <option>Choose a Currency</option>
                                {currencies.map((currency) => (
                                    <option key={currency.code} value={currency.code}>
                                        {currency.code} {currency.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Theme */}
                        <div className='w-full p-1'>
                            <label htmlFor="theme" className="block mb-2 text-sm font-medium text-gray-900 ">Theme</label>
                            <select id="theme" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={theme} onChange={(e) => setTheme(e.target.value)} >
                                <option>Choose a theme</option>
                                <option value="Light">Light</option>
                                <option value="Dark">Dark</option>
                            </select>
                        </div>
                    </div>
                    }
                    {step === 3 && <div>
                        {/* Select Plan */}
                        <div className='w-full p-1'>
                            <label htmlFor="plans" className="block mb-2 text-sm font-medium text-gray-900">Select Plans</label>
                            <select id="plans" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
                                <option value="">Choose a Plan</option>
                                {plans.map(plan => (
                                    <option key={plan._id} value={plan._id}>
                                        {plan.name} {plan.price}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedPlan && (
                            <div>
                                <div className='flex w-full justify-between my-2'>
                                    <label className='text-sm font-semibold text-gray-900'>Name:</label>
                                    <label className='text-sm font-light text-gray-900'> {plans.find(plan => plan._id === selectedPlan)?.name || 'No plan selected'}</label>
                                </div>
                                <div className='flex w-full justify-between my-2'>
                                    <label className='text-sm font-semibold text-gray-900'>Start Date:</label>
                                    <label className='text-sm font-light text-gray-900'>{getCurrentDate()}</label>
                                </div>
                                <div className='flex w-full justify-between my-2'>
                                    <label className='text-sm font-semibold text-gray-900'>Validity:</label>
                                    <label className='text-sm font-light text-gray-900'> {plans.find(plan => plan._id === selectedPlan)?.duration || 'No plan selected'} Days</label>
                                </div>
                                <div className='flex w-full justify-between my-2'>
                                    <label className='text-sm font-semibold text-gray-900'>Amount:</label>
                                    <label className='text-sm font-semibold text-gray-900'>Rs.{plans.find(plan => plan._id === selectedPlan)?.price || 'No plan selected'}/-</label>
                                </div>
                            </div>
                        )}
                    </div>
                    }
                    <div className='flex justify-between'>
                        <button type="button" className={`text-white bg-customPrimary hover:bg-customPrimaryHover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-2 ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handlePrev} disabled={step === 1}>Prev</button>
                        {step < 3 ? (
                            <button
                                type="button"
                                className="text-white bg-customPrimary hover:bg-customPrimaryHover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-2"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="text-white bg-customPrimary hover:bg-customPrimaryHover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-2"
                                onClick={handleSubmit}// Disable button if payment is verified
                            >
                                Pay Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>

    )
}

export default Setup
