// ArtworkDetails.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ArtworkDetails.css'; 
import CommentsForm from './Comments'; 

const ArtworkDetails = () => {
  const { id } = useParams(); 
  const [artwork, setArtwork] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [showCommentsForm, setShowCommentsForm] = useState(false); 

  // useEffect hook to fetch artwork details from API
  useEffect(() => {
    const fetchArtworkDetails = async () => {
      setLoading(true); 
      try {
        // Fetch artwork details from API using Axios
        const response = await axios.get(`https://api.artic.edu/api/v1/artworks/${id}`);
        setArtwork(response.data.data); 
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching artwork details:', error);
        setError(error); 
        setLoading(false); 
      }
    };

    fetchArtworkDetails(); 
  }, [id]); 

  // Conditional rendering based on loading and error states
  if (loading) return <p>Loading...</p>; 
  if (error) return <p>Error loading artwork details: {error.message}</p>; 
  if (!artwork) return <p>No artwork details found.</p>; 

  // Destructure artwork object for easier access to properties
  const {
    title,
    artist_display,
    date_display,
    main_reference_number,
    dimensions,
    image_id 
  } = artwork;

  // Function to handle showing the comments form
  const handleShowCommentsForm = () => {
    setShowCommentsForm(true); 
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12 text-center">
          <img
            src={`https://www.artic.edu/iiif/2/${image_id}/full/845,325/0/default.jpg`}
            className="img-fluid rounded artwork-image"
            alt={title}
          />
        </div>
      </div>

      {/* Artwork details section */}
      <div className="row mt-4">
        <div className="col-md-6 offset-md-3">
          <h1>{title}</h1>
          <p className="fw-bold">Artist: {artist_display}</p>
          <p>Date: {date_display}</p>
          <hr />
          <p>Main Reference Number: {main_reference_number}</p>
          <hr />
          <p>Dimensions: {dimensions}</p>
          <hr />

          {/* Navigation links */}
          <Link to="/" className="btn btn-outline-primary mt-3">Back to Artwork List</Link>
          <button className="btn btn-outline-primary mt-3" onClick={handleShowCommentsForm}>
            Leave a Comment
          </button>
          <hr />

          {/* Render CommentsForm component if showCommentsForm is true */}
          {showCommentsForm && <CommentsForm artworkId={id} />}
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetails;
