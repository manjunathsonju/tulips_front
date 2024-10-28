import React, { useState, useEffect } from "react";
import axios from "axios";

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cities, setCities] = useState([]);
  const [newCountry, setNewCountry] = useState("");
  const [newCity, setNewCity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch countries from the backend
  const fetchCountries = () => {
    axios
      .get("http://localhost:8000/api/countries")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the countries!", error);
      });
  };

  // Fetch cities based on the selected country
  const fetchCities = (countryId) => {
    axios
      .get(`http://localhost:8000/api/countries/${countryId}/cities`)
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the cities!", error);
      });
  };

  // Handle country selection and fetch cities
  const handleCountrySelect = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    fetchCities(countryId);
  };

  // Add new country
  const addCountry = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/countries", { name: newCountry })
      .then((response) => {
        setCountries([...countries, response.data]);
        setNewCountry("");
        setError("");
      })
      .catch((err) => {
        setError("Error adding country, it may already exist.");
      });
  };

  // Add new city
  const addCity = (e) => {
    e.preventDefault();
    if (!selectedCountry) {
      setError("Please select a country first.");
      return;
    }

    axios
      .post("http://localhost:8000/api/cities", {
        name: newCity,
        country_id: selectedCountry,
      })
      .then((response) => {
        setCities([...cities, response.data]);
        setNewCity("");
        setError("");
      })
      .catch((err) => {
        setError("Error adding city.");
      });
  };

  return (
    <div className="container">
      <h2>Country and City Management</h2>

      {/* Add Country Form */}
      <form onSubmit={addCountry}>
        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Add Country
          </label>
          <input
            type="text"
            className="form-control"
            id="country"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
            placeholder="Enter country name"
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">
          Add Country
        </button>
      </form>

      {/* Country Dropdown */}
      <div className="mt-4">
        <label>Select Country:</label>
        <select
          className="form-control"
          onChange={handleCountrySelect}
          value={selectedCountry}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add City Form */}
      {selectedCountry && (
        <form className="mt-3" onSubmit={addCity}>
          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              Add City
            </label>
            <input
              type="text"
              className="form-control"
              id="city"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="Enter city name"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add City
          </button>
        </form>
      )}

      {/* City List */}
      <ul className="list-group mt-3">
        {cities.map((city) => (
          <li key={city.id} className="list-group-item">
            {city.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryList;
