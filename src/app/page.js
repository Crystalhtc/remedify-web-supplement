"use client"
"use client"
import React, { useState, useEffect, useCallback } from 'react';
import styles from "./page.module.css";
import Header from "./components/Header/Header";

export default function Home() {
  const [originalDrugData, setOriginalDrugData] = useState([]);
  const [drugProducts, setDrugProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const ITEMS_PER_PAGE = 10;
  const MAX_PAGINATION_BUTTONS = 5;

  const fetchDrugData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch FDA Drug Label API
      const response = await fetch('https://api.fda.gov/drug/label.json?limit=1000');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      // Transform API data to extract required fields from openfda
      const transformedDrugData = data.results.map(drug => {
        // Safely access openfda data with fallbacks
        const openfda = drug.openfda || {};
        
        return {
          generic_name: openfda.generic_name?.[0] || 'N/A',
          route: openfda.route?.[0] || 'N/A',
          brand_name: openfda.brand_name?.[0] || 'N/A',
          manufacturer_name: openfda.manufacturer_name?.[0] || 'N/A',
          id: drug.id || Math.random().toString()
        };
      }).filter(drug => 
        // Filter out entries with 'N/A' in all fields
        drug.generic_name !== 'N/A' || 
        drug.route !== 'N/A' || 
        drug.brand_name !== 'N/A' || 
        drug.manufacturer_name !== 'N/A'
      );

      setOriginalDrugData(transformedDrugData);

      // Filter drugs based on current search term
      const filteredDrugs = transformedDrugData.filter(drug => 
        drug.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Calculate total pages
      const newTotalPages = Math.ceil(filteredDrugs.length / ITEMS_PER_PAGE);
      setTotalPages(newTotalPages);

      // Adjust current page if it's beyond the new total pages
      const adjustedPage = Math.min(currentPage, newTotalPages);
      setCurrentPage(adjustedPage);

      // Paginate the filtered drugs
      const startIndex = (adjustedPage - 1) * ITEMS_PER_PAGE;
      const paginatedDrugs = filteredDrugs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      setDrugProducts(paginatedDrugs);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching drug data:', error);
      setError(error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrugData();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching

    // Filter drugs based on brand name
    const filteredDrugs = originalDrugData.filter(drug => 
      drug.brand_name.toLowerCase().includes(term.toLowerCase())
    );

    // Calculate total pages
    const newTotalPages = Math.ceil(filteredDrugs.length / ITEMS_PER_PAGE);
    setTotalPages(newTotalPages);

    // Paginate the filtered drugs
    const paginatedDrugs = filteredDrugs.slice(0, ITEMS_PER_PAGE);

    setDrugProducts(paginatedDrugs);
  };

  // Calculate pagination buttons
  const getPaginationButtons = () => {
    let startPage, endPage;
    
    // If total pages are less than or equal to MAX_PAGINATION_BUTTONS
    if (totalPages <= MAX_PAGINATION_BUTTONS) {
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate the range of buttons to show
      const halfButtons = Math.floor(MAX_PAGINATION_BUTTONS / 2);
      
      if (currentPage <= halfButtons) {
        // If current page is near the start
        startPage = 1;
        endPage = MAX_PAGINATION_BUTTONS;
      } else if (currentPage + halfButtons >= totalPages) {
        // If current page is near the end
        startPage = totalPages - MAX_PAGINATION_BUTTONS + 1;
        endPage = totalPages;
      } else {
        // Current page is in the middle
        startPage = currentPage - halfButtons;
        endPage = currentPage + halfButtons;
      }
    }

    return Array.from(
      { length: Math.max(0, endPage - startPage + 1) }, 
      (_, i) => startPage + i
    );
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    // Paginate the filtered drugs for the new page
    const filteredDrugs = originalDrugData.filter(drug => 
      drug.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (newPage - 1) * ITEMS_PER_PAGE;
    const paginatedDrugs = filteredDrugs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    setDrugProducts(paginatedDrugs);
  };

  // Placeholder Loading Component
  const LoadingPlaceholder = () => (
    <tr>
      {[1,2,3,4].map((col) => (
        <td key={col} className={styles.loadingCell}>
          <div className={styles.loadingAnimation}></div>
        </td>
      ))}
    </tr>
  );

  // Error Handling Component
  const ErrorDisplay = () => (
    <div className={styles.errorContainer}>
      <p>Error Loading Drug Data</p>
      <p>{error ? error.message : 'An unknown error occurred'}</p>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.nav}>
        <Header />
      </div>
      
      <main className={styles.main}>
        {/* Error Handling */}
        {error && <ErrorDisplay />}

        <div className={styles.searchContainer}>
          <p className={styles.searchText}>Search by Brand Name:</p>
          <form className={styles.search}>
            <input 
              className={styles.searchBar} 
              type="text" 
              placeholder="Type medication brand name" 
              name="search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Generic Name</th>
                <th>Route</th>
                <th>Brand Name</th>
                <th>Manufacturer</th>
              </tr>
            </thead>
            <tbody>
              {isLoading 
                ? Array(ITEMS_PER_PAGE).fill().map((_, index) => (
                    <LoadingPlaceholder key={index} />
                  ))
                : drugProducts.map((drug) => (
                    <tr key={drug.id}>
                      <td>{drug.generic_name}</td>
                      <td>{drug.route}</td>
                      <td>{drug.brand_name}</td>
                      <td>{drug.manufacturer_name}</td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        
          <div className={styles.paginationContainer}>
            {/* Previous button */}
            {currentPage > 1 && (
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                className={styles.paginationButton}
              >
                {'<'}
              </button>
            )}

            {/* Pagination Buttons */}
            {getPaginationButtons().map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`${styles.paginationButton} ${currentPage === page ? styles.activePage : ''}`}
              >
                {page}
              </button>
            ))}

            {/* Next button */}
            {currentPage < totalPages && (
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                className={styles.paginationButton}
              >
                {'>'}
              </button>
            )}
          </div>
        

        {/* Show total results */}
        <div className={styles.resultsInfo}>
          Total Results: {originalDrugData.filter(drug => 
            drug.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
          ).length}
        </div>
      </main>
    </div>
  );
}