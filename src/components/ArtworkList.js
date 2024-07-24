import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ArtworkList.css'; 

const ArtworkList = ({ searchTerm }) => {
  const [artworks, setArtworks] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0); 

  // Ref for debounce timer
  const debounceTimer = useRef(null);

  useEffect(() => {
    // Function to fetch artworks from the API
    const fetchArtworks = async () => {
      setLoading(true); 
      try {
        let url = 'https://api.artic.edu/api/v1/artworks';

        // Applying search query or selected category filter
        if (searchTerm || selectedCategory) {
          url += `/search?q=${encodeURIComponent(searchTerm ? searchTerm : selectedCategory)}`;
        }

        // Fetch artworks from API based on current page and limit
        const response = await axios.get(url, {
          params: {
            limit: 10,
            page: currentPage,
          },
        });

        let fetchedArtworks = response.data.data;

        // If searchTerm or selectedCategory is provided, fetch detailed artwork information
        if (searchTerm || selectedCategory) {
          const artworkIds = fetchedArtworks.map((artwork) => artwork.id);
          const artworkDetails = await Promise.all(
            artworkIds.map(async (id) => {
              const artworkUrl = `https://api.artic.edu/api/v1/artworks/${id}`;
              const artworkResponse = await axios.get(artworkUrl);
              return artworkResponse.data.data;
            })
          );
          fetchedArtworks = artworkDetails; 
        }

        setArtworks(fetchedArtworks); 
        setTotalPages(response.data.pagination.total_pages); 
        setLoading(false); 

      } catch (error) {
        console.error('Error fetching artworks:', error);
        setError(error); 
        setLoading(false); 
      }
    };

    // Clear previous debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer to delay fetching artworks
    debounceTimer.current = setTimeout(() => {
      fetchArtworks();
    }, 800); 

    return () => {
      // Cleanup: Clear debounce timer on component unmount
      clearTimeout(debounceTimer.current);
    };

  }, [searchTerm, selectedCategory, currentPage]); 

  // Function to handle next page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); 
    }
  };

  // Function to handle previous page navigation
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); 
    }
  };

  // Function to handle category filter change
  const handleCategoryChange = async (event) => {
    setSelectedCategory(event.target.value); 
    setCurrentPage(1); 
  };

  // If data is still loading, display loading message
  if (loading) return <p>Loading...</p>;

  // If there's an error fetching artworks, display error message
  if (error) return <p>Error loading artworks: {error.message}</p>;

  // Render the artworks list
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col">
          <div className="mb-3">
            <label htmlFor="categoryFilter" className="form-label">Filter by Category:</label>
            <select
              id="categoryFilter"
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Select Category...</option>
              <option value="Painting">Painting</option>
              <option value="Sculpture">Sculpture</option>
              <option value="Print">Print</option>
              <option value="Photograph">Photograph</option>
              <option value="Textile">Textile</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {artworks.map(({ id, title, image_id }) => (
          <div key={id} className="col mb-4">
            <div className="card h-100 border-0">
              <Link to={`/artwork/${id}`} className="text-decoration-none text-dark">
                <div className="data">
                  <img
                    src={`https://www.artic.edu/iiif/2/${image_id}/full/800,/0/default.jpg`}
                    className="card-img-top"
                    alt={title}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{title}</h5>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination navigation */}
      <nav className="mt-4" aria-label="Pagination">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handlePrevPage}>Previous</button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">{currentPage} of {totalPages}</span>
          </li>
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handleNextPage}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ArtworkList;
