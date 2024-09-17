import React, { useState, useEffect, useRef } from 'react';
import countryData from 'country-json/src/country-by-flag';
import countryCodes from 'country-json/src/country-by-calling-code';
import PropTypes from 'prop-types';

const PhoneInputWithDropdown = ({ phone, countryCode, onPhoneChange, onCountryCodeChange }) => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    onCountryCodeChange(country.calling_code);
    setDropdownOpen(false);
    setSearchText('');
  };

  const handlePhoneChange = (e) => {
    onPhoneChange(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value.toLowerCase());
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => Math.min(prevIndex + 1, filteredCountries.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCountries[highlightedIndex]) {
        handleCountrySelect(filteredCountries[highlightedIndex]);
      }
    }
  };

  const filteredCountries = countryCodes.filter(country => {
    const countryName = country.country.toLowerCase();
    const countryCode = String(country.calling_code).toLowerCase();
    return countryName.includes(searchText) || countryCode.includes(searchText);
  });

  const selectedCountryData = countryData.find(c => c.country === selectedCountry.country) || { flag_base64: '' };

  return (
    <div className="relative flex items-center my-2">
      <button
        id="dropdown-phone-button"
        className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <img src={selectedCountryData.flag_base64} alt="Flag" className="h-4 w-4 me-2" />
        +{selectedCountry.calling_code} <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" d="m1 1 4 4 4-4" /></svg>
      </button>
      {dropdownOpen && (
        <div ref={dropdownRef} id="dropdown-phone" className="absolute z-10 max-h-60 overflow-y-scroll overflow-hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-64">
          <div className="p-2">
            <input
              type="text"
              className="block w-full px-3 py-1.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-customPrimaryHover focus:border-customPrimaryHover"
              placeholder="Search by name or code..."
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              ref={searchInputRef}
            />
          </div>
          <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdown-phone-button">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className={`inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${highlightedIndex === index ? 'bg-gray-200' : ''}`}
                    onClick={() => handleCountrySelect(country)}
                  >
                    <span className="inline-flex items-center">
                      <img src={countryData.find(c => c.country === country.country)?.flag_base64 || ''} alt="Flag" className="h-4 w-4 me-2" />
                      {country.country} (+{country.calling_code})
                    </span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
      <div className="relative w-full">
        <input
          type="text"
          id="phone-input"
          name="phone"
          aria-describedby="helper-text-explanation"
          className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-0 border border-gray-300 focus:ring-customPrimaryHover focus:border-customPrimaryHover"
          placeholder="123-456-7890"
          value={phone}
          onChange={handlePhoneChange}
        />
      </div>
    </div>
  );
};

PhoneInputWithDropdown.propTypes = {
  phone: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  onPhoneChange: PropTypes.func.isRequired,
  onCountryCodeChange: PropTypes.func.isRequired,
};

export default PhoneInputWithDropdown;
