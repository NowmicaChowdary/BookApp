// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ArtworkList from './components/ArtworkList';
import ArtworkDetails from './components/ArtworkDetails';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <Router>
      <div className="App">
        {/* Navbar with search functionality */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <a className="navbar-brand" href="/">Artwork App</a>
            <div className="collapse navbar-collapse">
              <form className="d-flex ms-auto">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search by title..."
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </form>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<ArtworkList searchTerm={searchTerm} />} />
          <Route path="/artwork/:id" element={<ArtworkDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
