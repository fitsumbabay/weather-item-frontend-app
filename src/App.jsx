import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ItemManager from "./components/ItemManager";
import Weather from "./components/Weather";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="container">
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/weather">Weather</Link>
            <Link to="/items">Items</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<h2>Welcome to the Weather and Item App</h2>} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/items" element={<ItemManager />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;














