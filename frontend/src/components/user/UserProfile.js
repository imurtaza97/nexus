import React from 'react'
import { Link } from 'react-router-dom'


const UserProfile = () => {
    return (
        <div className='flex flex-col w-full md:w-3/4 2xl:w-2/3'>
            <nav className="flex w-full" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-customPrimary">
                            <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <Link to="/profile" className="ms-1 text-sm font-medium text-gray-700 hover:text-customPrimary md:ms-2">Profile</Link>
                        </div>
                    </li>
                </ol>
            </nav>
            
            <div className='flex flex-col p-3 md:flex-row gap-4 w-full'>
                <form className='flex-1 p-5 bg-white border border-gray-200 rounded-lg shadow'>
                    <div className=''>
                        <p className='text-sm font-bold'>Your Photo</p>
                    </div>
                    <div className='flex flex-col items-center p-5'>
                        <span className="w-24 h-24 rounded-full bg-customPrimaryHover flex items-center justify-center text-white text-lg mb-3">
                            M
                        </span>
                        <span className='flex items-center text-sm text-zinc-700 hover:text-zinc-400'>
                            <Link to="#" className='flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                <p className='ml-2'>Delete</p>
                            </Link>
                        </span>
                    </div>
                    <div className='flex flex-col justify-center items-center text-center bg-gray-50 border border-dashed border-customPrimary w-full rounded-md h-64 aspect-w-4 aspect-h-4'>
                        <span className='flex text-customPrimary text-sm m-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                        </span>
                        <p className='text-sm m-3'>No Photo Uploaded</p>
                    </div>
                    <div className='flex justify-end p-3'>
                        <button className='text-customPrimary ring-1 ring-customPrimary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>Cancel</button>
                        <button className="text-white bg-customPrimary hover:bg-customPrimaryHover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ms-2">Submit</button>
                    </div>
                </form>

                <form className='flex-1 p-5 bg-white border border-gray-200 rounded-lg shadow md:mr-4'>
                    <div className=''>
                        <p className='text-sm font-bold'>Personal Information</p>
                    </div>
                    <div className='flex flex-col md:flex-row gap-4 py-3'>
                        <div className='flex-1'>
                            <label htmlFor="Name" className='text-sm'>Name</label>
                            <input type="text" id="name" name="name" value="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full p-2.5" placeholder="Name" required disabled />
                        </div>
                        <div className='flex-1'>
                            <label htmlFor="Designation" className='text-sm'>Designation</label>
                            <input type="text" id="Designation" name="Designation" value="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full p-2.5" placeholder="Owner" required disabled />
                        </div>
                    </div>
                    <div className='py-3'>
                        <label htmlFor="Phone" className='text-sm'>Phone</label>
                        <input type="text" id="phone" name="phone" value="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full p-2.5" placeholder="Phone" required disabled />
                        <span className='block mt-1 text-xs text-red-500'>
                            <Link to="#">Not Verified</Link>
                        </span>
                    </div>
                    <div className='py-3'>
                        <label htmlFor="Email" className='text-sm'>Email</label>
                        <input type="text" id="email" name="email" value="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full p-2.5" placeholder="Email" required disabled />
                        <span className='block mt-1 text-xs text-red-500'>
                            <Link to="#">Not Verified</Link>
                        </span>
                    </div>
                    <div className='py-3'>
                        <label htmlFor="Address" className='text-sm'>Address</label>
                        <textarea id="address" name="address" value="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover block w-full p-2.5" placeholder="Address" required disabled />
                    </div>
                    <div className='flex justify-end p-3'>
                        <button className='text-customPrimary ring-1 ring-customPrimary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>Cancel</button>
                        <button className="text-white bg-customPrimary hover:bg-customPrimaryHover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ms-2">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserProfile
