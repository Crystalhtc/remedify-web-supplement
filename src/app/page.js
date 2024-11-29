"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import styles from "./page.module.css";
import Header from "./components/Header/Header";

export default function Home() {
  const router = useRouter(); // Initialize router
  const [originalDrugData, setOriginalDrugData] = useState([]);
  const [drugProducts, setDrugProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const ITEMS_PER_PAGE = 10;
  const MAX_PAGINATION_BUTTONS = 5;

  // Handle row click to navigate to medication details
  const handleRowClick = (din) => {
    router.push(`/dashboard?din=${din}`);
  };

  // Enhanced filter function with DIN sorting
  const filterDrugs = (drugs, term) => {
    if (!term.trim()) return drugs.sort((a, b) => 
      parseInt(a.drug_identification_number) - parseInt(b.drug_identification_number)
    );

    const lowercaseTerm = term.toLowerCase();

    // Filter and sort drugs
    return drugs
      .filter(drug => {
        const lowercaseBrandName = drug.brand_name.toLowerCase();
        return lowercaseBrandName.includes(lowercaseTerm);
      })
      .sort((a, b) => {
        const lowercaseBrandA = a.brand_name.toLowerCase();
        const lowercaseBrandB = b.brand_name.toLowerCase();
        const lowercaseTerm = term.toLowerCase();

        // Exact match first
        if (lowercaseBrandA === lowercaseTerm) return -1;
        if (lowercaseBrandB === lowercaseTerm) return 1;

        // Starts with match next, prioritized
        const startsWithA = lowercaseBrandA.startsWith(lowercaseTerm);
        const startsWithB = lowercaseBrandB.startsWith(lowercaseTerm);

        if (startsWithA && !startsWithB) return -1;
        if (!startsWithA && startsWithB) return 1;

        // If brand names are similar, sort by DIN
        return parseInt(a.drug_identification_number) - parseInt(b.drug_identification_number);
      });
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

      // Remove specific unwanted entry
      const filteredDrugData = combinedDrugData.filter(drug => 
        !(drug.brand_name + drug.drug_identification_number + drug.pharmaceutical_form_name + drug.company_name).includes("MYSOLINE PRIMIDONE TABLETS 250MG00002631TabletAYERST VETERINARY LABORATORIES")
      );

      // Sort by DIN initially
      const sortedDrugData = filteredDrugData.sort((a, b) => 
        parseInt(a.drug_identification_number) - parseInt(b.drug_identification_number)
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
  }, [currentPage, searchTerm]);

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
                    <tr 
                      key={drug.drug_identification_number} 
                      onClick={() => handleRowClick(drug.drug_identification_number)}
                      className={styles.clickableRow}
                    >
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