import React, { useState, useEffect } from "react";
import axios from "axios";

const CountryCityPopulation = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [ageGroups, setAgeGroups] = useState([
    { id: 1, label: "Old" },
    { id: 2, label: "Young" },
    { id: 3, label: "Child" },
  ]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [femalePopulation, setFemalePopulation] = useState("");
  const [malePopulation, setMalePopulation] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchCountries();
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

  const handleCountrySelect = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    fetchCities(countryId); // Fetch cities based on selected country
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !selectedCountry ||
      !selectedCity ||
      !selectedAgeGroup ||
      !femalePopulation ||
      !malePopulation
    ) {
      setError("All fields are required.");
      return;
    }

    const formData = {
      country_id: selectedCountry,
      city_id: selectedCity,
      age_group: selectedAgeGroup,
      female_population: femalePopulation,
      male_population: malePopulation,
    };

    axios
      .post("http://localhost:8000/api/population", formData)
      .then((response) => {
        setSuccessMessage("Population data saved successfully!");
        setError("");
        // Reset form
        setSelectedCountry("");
        setSelectedCity("");
        setSelectedAgeGroup("");
        setFemalePopulation("");
        setMalePopulation("");
        setCities([]); // Reset cities list
      })
      .catch((error) => {
        setError("There was an error submitting the data.");
        setSuccessMessage("");
      });
  };

  return (
    <div className="container">
      <h2>Country, City, Age Group & Population</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {/* Country Dropdown */}
      <div className="mb-3">
        <label htmlFor="country">Select Country:</label>
        <select
          id="country"
          className="form-control"
          value={selectedCountry}
          onChange={handleCountrySelect}
        >
          <option value="">Select Country</option>
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
            <option value="">Select City</option>
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
          <option value="">Select Age Group</option>
          {ageGroups.map((ageGroup) => (
            <option key={ageGroup.id} value={ageGroup.label}>
              {ageGroup.label}
            </option>
          ))}
        </select>
      </div>

      {/* Female Population Input */}
      <div className="mb-3">
        <label htmlFor="femalePopulation">Enter Female Population:</label>
        <input
          type="number"
          id="femalePopulation"
          className="form-control"
          value={femalePopulation}
          onChange={(e) => setFemalePopulation(e.target.value)}
          placeholder="Enter female population"
        />
      </div>

      {/* Male Population Input */}
      <div className="mb-3">
        <label htmlFor="malePopulation">Enter Male Population:</label>
        <input
          type="number"
          id="malePopulation"
          className="form-control"
          value={malePopulation}
          onChange={(e) => setMalePopulation(e.target.value)}
          placeholder="Enter male population"
        />
      </div>

      {/* Submit Button */}
      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default CountryCityPopulation;
