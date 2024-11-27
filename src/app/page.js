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

  // Filter function to reuse across the component
  const filterDrugs = (drugs, term) => {
    return drugs.filter(drug => 
      drug.brand_name.toLowerCase().startsWith(term.toLowerCase())
    );
  };

  const fetchDrugData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch both APIs concurrently
      const [drugResponse, formResponse] = await Promise.all([
        fetch('https://health-products.canada.ca/api/drug/drugproduct/?lang=en&type=json'),
        fetch('https://health-products.canada.ca/api/drug/form/?lang=en&type=json')
      ]);

      const drugData = await drugResponse.json();
      const formData = await formResponse.json();

      // Create a form map for quick lookup by drug_code
      const formMap = formData.reduce((acc, form) => {
        acc[form.drug_code] = form.pharmaceutical_form_name;
        return acc;
      }, {});

      // Combine drug data with matched form information
      const combinedDrugData = drugData.map(drug => ({
        ...drug,
        pharmaceutical_form_name: formMap[drug.drug_code] || 'N/A'
      }));

      // Sort the combined drug data to ensure consistent order
      const sortedDrugData = combinedDrugData.sort((a, b) => 
        a.brand_name.localeCompare(b.brand_name)
      );

      setOriginalDrugData(sortedDrugData);

      // Initial filtering and pagination
      const filteredDrugs = filterDrugs(sortedDrugData, searchTerm);

      // Calculate total pages
      setTotalPages(Math.ceil(filteredDrugs.length / ITEMS_PER_PAGE));

      // Paginate the filtered drugs
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
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
    const filteredDrugs = filterDrugs(originalDrugData, term);

    // Calculate total pages
    setTotalPages(Math.ceil(filteredDrugs.length / ITEMS_PER_PAGE));

    // Paginate the filtered drugs
    const startIndex = 0; // Always start from the first page
    const paginatedDrugs = filteredDrugs.slice(startIndex, ITEMS_PER_PAGE);

    setDrugProducts(paginatedDrugs);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    // Paginate the filtered drugs for the new page
    const filteredDrugs = filterDrugs(originalDrugData, searchTerm);

    const startIndex = (newPage - 1) * ITEMS_PER_PAGE;
    const paginatedDrugs = filteredDrugs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
      { length: endPage - startPage + 1 }, 
      (_, i) => startPage + i
    );
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

  return (
    <div className={styles.page}>
      <div className={styles.nav}>
        <Header />
      </div>
      
      <main className={styles.main}>
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
                <th>Brand Name</th>
                <th>Drug Identification Number</th>
                <th>Dosage Form</th>
                <th>Company Name</th>
              </tr>
            </thead>
            <tbody>
              {isLoading 
                ? Array(ITEMS_PER_PAGE).fill().map((_, index) => (
                    <LoadingPlaceholder key={index} />
                  ))
                : drugProducts.map((drug) => (
                    <tr key={drug.drug_identification_number}>
                      <td>{drug.brand_name}</td>
                      <td>{drug.drug_identification_number}</td>
                      <td>{drug.pharmaceutical_form_name}</td>
                      <td>{drug.company_name}</td>
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
          Total Results: {filterDrugs(originalDrugData, searchTerm).length}
        </div>
      </main>
    </div>
  );
}