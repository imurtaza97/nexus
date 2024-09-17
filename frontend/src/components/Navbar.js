import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="border-white bg-white drop-shadow-md">
            <div className="flex flex-wrap items-center justify-between p-4 md:w-auto md:mx-10 ">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="/images/dark_logo.png" className="h-9" alt="Logo" />
                </Link>
                <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none" aria-controls="navbar-solid-bg" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="hidden w-full md:flex md:block md:w-auto" id="navbar-solid-bg">
                    <ul className="flex flex-col font-light mt-4 ml-5 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent md:items-center">
                        <li>
                            <Link to="/" className="block py-2 px-3 md:p-0 rounded hover:text-customPrimary" aria-current="page">Home</Link>
                        </li>
                        <li>
                            <Link href="#" className="block py-2 px-3 md:p-0 rounded hover:text-customPrimary">Services</Link>
                        </li>
                        <li>
                            <Link href="#" className="block py-2 px-3 md:p-0 rounded hover:text-customPrimary">About</Link>
                        </li>
                        <li>
                            <Link href="#" className="block py-2 px-3 md:p-0 rounded hover:text-customPrimary">Contact</Link>
                        </li>
                    </ul>
                    <div className="flex justify-center ml-5 md:block md:w-auto">
                        <Link to="/signin" className="inline py-2 px-3 m-3 bg-customPrimary hover:bg-customPrimaryHover focus:ring-4 focus:outline-none focus:ring-blue-200 text-white rounded md:border-0">Login</Link>
                        <Link to="/signup" className="inline py-2 px-3 m-3 bg-customPrimary hover:bg-customPrimaryHover focus:ring-4 focus:outline-none focus:ring-blue-200 text-white rounded md:border-0">Signup</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
