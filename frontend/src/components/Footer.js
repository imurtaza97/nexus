import React from 'react';
import {Link} from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="flex flex-col items-center bg-customPrimary text-center text-surface">
      <div className="flex flex-col md:flex-row w-full md:items-center justify-around p-10">
        <ul className='flex flex-col text-white md:text-start m-2'>
          <li className='font-bold p-1'>SUPPORT</li>
          <li className='text-sm p-1'><Link to="" className='hover:underline'>Terms & Conditions</Link></li>
          <li className='text-sm p-1'><Link to="" className='hover:underline'>Privacy Policy</Link></li>
          <li className='text-sm p-1'><Link to="" className='hover:underline'>Jobs</Link></li>
          <li className='text-sm p-1'><Link to="" className='hover:underline'>FAQ</Link></li>
        </ul>

        <ul className='flex flex-col text-white md:text-start m-2'>
          <li className='font-bold p-1'>MENU</li>
          <li className='text-sm p-1'><Link to="" className='hover:underline'>Home</Link></li>
          <li className='text-sm p-1'><Link to="" className='hover:underline'>Services</Link></li>
          <li className='text-sm p-1'><Link to="" className='hover:underline'>About</Link></li>
          <li className='text-sm p-1'><Link to="" className='hover:underline'>Contact</Link></li>
        </ul>

        <div className='container md:max-w-80'>
          <div className="my-2
           flex justify-center md:justify-start space-x-2">
            <Link
              to="#!"
              type="button"
              className="rounded-full bg-transparent p-3 font-medium uppercase leading-normal text-surface transition duration-150 ease-in-out text-white hover:bg-customPrimaryHover focus:outline-none focus:ring-0"
              data-twe-ripple-init>
              <span className="[&>svg]:h-5 [&>svg]:w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 320 512">
                  <path
                    d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                </svg>
              </span>
            </Link>

            <Link
              to="#!"
              type="button"
              className="rounded-full bg-transparent p-3 font-medium uppercase leading-normal text-surface transition duration-150 ease-in-out text-white hover:bg-customPrimaryHover focus:outline-none focus:ring-0"
              data-twe-ripple-init>
              <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 512 512">
                  <path
                    d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                </svg>
              </span>
            </Link>

            <Link
              to="/"
              type="button"
              className="rounded-full bg-transparent p-3 font-medium uppercase leading-normal text-surface transition duration-150 ease-in-out text-white hover:bg-customPrimaryHover focus:outline-none focus:ring-0"
              data-twe-ripple-init>
              <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 448 512">
                  <path
                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </span>
            </Link>
          </div>
          <form className="max-w-md mx-auto">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-customPrimaryHover focus:border-customPrimaryHover" placeholder="Search ..." required />
              <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-customPrimary hover:bg-customPrimaryHover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full bg-customPrimaryHover p-4 text-white text-center">
        © 2023 Copyright by
        <a href="https://tw-elements.com/"> Nexus</a>
      </div>
    </footer>
  )
}

export default Footer
