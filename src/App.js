import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import CountryList from "./components/CountryList";
import CountryCityPopulation from "./components/CountryCityPopulation";
import PopulationFilter from "./components/PopulationFilter";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("countryList");

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("countryList"); // Reset active tab on logout
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "countryList":
        return <CountryList />;
      case "countryCityPopulation":
        return <CountryCityPopulation />;
      case "populationFilter":
        return <PopulationFilter />;
      default:
        return <CountryList />;
    }
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <span className="navbar-brand">
                Population Information Search
              </span>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </nav>

          <div className="container mt-3">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "countryList" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("countryList")}
                >
                  Country List
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "countryCityPopulation" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("countryCityPopulation")}
                >
                  Country City Population
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "populationFilter" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("populationFilter")}
                >
                  Population Filter
                </button>
              </li>
            </ul>
            <div className="mt-3">{renderTabContent()}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
