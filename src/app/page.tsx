'use client';

import React, { useState, useEffect } from 'react';
import { Card } from './ui/Cards';

const Home = () => {
  const [companies, setCompanies] = useState<{ name: string; price: number }[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [company2, setCompany] = useState('');

  const handleClick = () => {
    setShowDetails(!showDetails);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company2.trim()) {
      const newCompany = { name: company2.toUpperCase(), price: 0 };
      const updatedCompanies = [...companies, newCompany];
      setCompanies(updatedCompanies);
      setCompany(''); // Reset input
      setShowDetails(false); // Close form after submit
      // Store updated companies in localStorage
      localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    }
  };

  useEffect(() => {
    const storedCompanies = localStorage.getItem('companies');
    if (storedCompanies) {
      try {
        const data: { name: string; price: number }[] = JSON.parse(storedCompanies);
        if (Array.isArray(data)) {
          setCompanies(data); // Assuming item has a 'name' property
        }
      } catch (error) {
        console.error('Failed to parse local storage data', error);
      }
    }
  }, []);

  return (
    <main className="min-h-screen">
      <div className="flex flex-col">
        <ul className="ml-4 p-5">
          {companies.map((company, index) => (
            <li key={index}>
              {<Card company={company.name} />}
            </li>
          ))}
          <li className="flex flex-row">
            <button
              className="hover:cursor-pointer bg-cyan-50 hover:bg-cyan-500 rounded-full py-2 px-10 shadow-sm hover:shadow-md text-2xl font-mono"
              onClick={handleClick}
            >
              + New Company
            </button>
            {showDetails && (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="New Company"
                  value={company2}
                  onChange={(e) => setCompany(e.target.value)}
                  className="rounded-md border-2 p-2"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-50 hover:bg-cyan-500 rounded-full"
                >
                  Submit
                </button>
              </form>
            )}
          </li>
        </ul>
      </div>
    </main>
  );
};

export default Home;
