import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';  // Import UserContext

const Layout = ({ children }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();
    const { user, loading } = useUser();

    useEffect(() => {
        if (!loading) {
          if (user) {
            const { isPaid, isSubscriptionActive } = user;
      
            if (!isPaid) {
              navigate('/setup');
            } else if (!isSubscriptionActive) {
              navigate('/renew');
            }
          } else {
            navigate('/signin');
          }
        }
      }, [user, loading, navigate]);
      

    // Function to toggle search visibility
    const handleSearchOpen = () => {
        setIsSearchOpen(!isSearchOpen);
    };
    
    return (
        <div className="">
            <nav className="fixed top-0 sm:left-60 z-40 h-16 w-full sm:w-sidbarMinus bg-white border-b border-gray-200">
                <div className="px-1 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden">
                                <span className="sr-only">Open sidebar</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-align-justify"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                            </button>
                        </div>
                        <div className="flex items-center">
                            <div className='flex items-center m-2'>
                                <button className='mx-2 hover:text-gray-500' onClick={handleSearchOpen}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                </button>
                                <button className='mx-2 hover:text-gray-500'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                                </button>
                            </div>
                            <div className="flex items-center px-4">
                                <div>
                                    <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                        <span className="sr-only">Open user menu</span>
                                        {user && user.profilePhoto ? (
                                            <img className="w-10 h-10 rounded-full" src={user.profilePhoto} alt="user" />
                                        ) : (
                                            <span className="w-10 h-10 rounded-full bg-customPrimaryHover flex items-center justify-center text-white text-lg">
                                                {user?.user?.userName?.charAt(0).toUpperCase() || ''}
                                            </span>
                                        )}
                                    </button>
                                </div>
                                <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow" id="dropdown-user">
                                    <div className="px-4 py-3" role="none">
                                        <p className="text-sm font-medium text-gray-900 truncate" role="none">
                                            {user?.user?.organization?.name || 'Organization'}
                                        </p>
                                        <p className="text-sm text-gray-900" role="none">
                                            {user?.user?.userName || 'Username'}
                                        </p>
                                    </div>
                                    <ul className="py-1" role="none">
                                        <li>
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 " role="menuitem">Profile</Link>
                                        </li>
                                        <li>
                                            <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 " role="menuitem">Settings</Link>
                                        </li>
                                        <li>
                                            <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 " role="menuitem">Sign out</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className={`fixed top-16 z-40 sm:left-60 h-15 w-full py-1 pr-5 pl-1 sm:w-sidbarMinus bg-white border-b border-gray-200 transition-all duration-500 ease-in-out overflow-hidden ${isSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                <form className="w-full mx-auto bg-white">
                    <label className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border-none rounded-lg focus:ring-0 focus:shadow-none" placeholder="Search" required />
                        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-customPrimary hover:bg-customPrimaryHover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
                    </div>
                </form>
            </div>

            <aside id="logo-sidebar" className="fixed top-0 sm:top-0 left-0 z-40 w-60 h-screen transition-transform -translate-x-full bg-customPrimaryHover sm:translate-x-0" aria-label="Sidebar">
                <Link to="https://flowbite.com" className="flex justify-center py-4">
                    <img src="/images/light_logo.png" className="h-10 me-3" alt="Logo" />
                </Link>
                <span>
                    <p className="p-4 font-semibold text-white text-sm">MENU</p>
                </span>
                <div className="h-full px-3 pb-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link to="#" className="flex items-center p-2 text-white text-md rounded-lg hover:bg-customPrimary group">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                                <span className="ms-3">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <button type="button" className="flex items-center w-full p-2 text-white text-md transition duration-75 rounded-lg hover:bg-customPrimary group" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt-text"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M14 8H8" /><path d="M16 12H8" /><path d="M13 16H8" /></svg>
                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Invoice</span>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>
                            <ul id="dropdown-example" className="hidden py-2 space-y-2">
                                <li>
                                    <Link to="#" className="flex items-center w-full p-2 text-white text-md transition duration-75 rounded-lg pl-11 group hover:bg-customPrimary">Products</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </aside>

            <div className="flex fixed top-16 p-4 sm:ml-60 w-full md:w-sidbarMinus h-navbarMinus overflow-y-auto">
                {children}
            </div>
        </div>
    )
}

export default Layout
