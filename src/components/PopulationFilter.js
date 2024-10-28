import React, { useState, useEffect } from "react";
import axios from "axios";

const PopulationFilter = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [ageGroups, setAgeGroups] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [malePopulation, setMalePopulation] = useState("");
  const [femalePopulation, setFemalePopulation] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchCountries();
    fetchAgeGroups();
  }, []);

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

  const fetchCities = (countryId) => {
    axios
      .get(`http://localhost:8000/api/countries/${countryId}/cities`)
      .then((response) => {
        setCities(response.data);
        setSelectedCity(""); // Reset selected city when country changes
      })
      .catch((error) => {
        console.error("There was an error fetching the cities!", error);
      });
  };

  const fetchAgeGroups = () => {
    // Fetch age groups from a predefined list or your backend
    setAgeGroups([
      { id: 1, label: "Old" },
      { id: 2, label: "Young" },
      { id: 3, label: "Child" },
    ]);
  };

  const handleCountrySelect = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    fetchCities(countryId); // Fetch cities based on selected country
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const filterData = {
      country_id: selectedCountry,
      city_id: selectedCity,
      age_group: selectedAgeGroup,
      male_population: malePopulation,
      female_population: femalePopulation,
    };

    axios
      .get("http://localhost:8000/api/population", { params: filterData })
      .then((response) => {
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the filtered data!", error);
      });
  };

  return (
    <div className="container">
      <h2>Population Filter</h2>

      <form onSubmit={handleFilterSubmit}>
        {/* Country Dropdown */}
        <div className="mb-3">
          <label htmlFor="country">Select Country:</label>
          <select
            id="country"
            className="form-control"
            value={selectedCountry}
            onChange={handleCountrySelect}
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* City Dropdown */}
        {selectedCountry && (
          <div className="mb-3">
            <label htmlFor="city">Select City:</label>
            <select
              id="city"
              className="form-control"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Age Group Dropdown */}
        <div className="mb-3">
          <label htmlFor="ageGroup">Select Age Group:</label>
          <select
            id="ageGroup"
            className="form-control"
            value={selectedAgeGroup}
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
          >
            <option value="">All Age Groups</option>
            {ageGroups.map((ageGroup) => (
              <option key={ageGroup.id} value={ageGroup.label}>
                {ageGroup.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button className="btn btn-primary" type="submit">
          Filter
        </button>
      </form>

      {/* Display Filtered Results */}
      <div className="mt-4">
        <h3>Filtered Population Data</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Country</th>
              <th>City</th>
              <th>Age Group</th>
              <th>Female Population</th>
              <th>Male Population</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.country.name}</td>
                  <td>{item.city.name}</td>
                  <td>{item.age_group}</td>
                  <td>{item.female_population}</td>
                  <td>{item.male_population}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PopulationFilter;
