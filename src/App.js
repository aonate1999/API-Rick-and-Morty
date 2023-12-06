// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCharacters, setTotalCharacters] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://rickandmortyapi.com/api/character', {
        params: { page, name: searchTerm },
      });

      const charactersWithImages = response.data.results.map((character) => ({
        id: character.id,
        name: character.name,
        species: character.species,
        status: character.status,
        image: character.image,
      }));

      setCharacters(charactersWithImages);
      setTotalCharacters(response.data.info.count);
      setError(null);
    } catch (error) {
      setError('Error al obtener datos. Por favor, intenta nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="app-container">
      <h1>Personajes de Rick and Morty</h1>
      <p>Hecho por Antony Yabuky Oñate Olivares</p>
      <p>
        Datos proporcionados por{' '}
        <a href="https://rickandmortyapi.com/" target="_blank" rel="noopener noreferrer">
          The Rick and Morty API
        </a>
      </p>
      <div className="search-bar">
        <label htmlFor="search">Buscar:</label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <p>Total de personajes: {totalCharacters}</p>
      <div className="character-container">
        {characters.map((character) => (
          <div key={character.id} className="character-card">
            <img src={character.image} alt={character.name} />
            <strong>{character.name}</strong>
            <p>{character.species}</p>
            <p>{character.status}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>
          Anterior
        </button>
        <button onClick={handleNextPage}>Siguiente</button>
      </div>
    </div>
  );
}

export default App;
