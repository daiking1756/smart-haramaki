import React, { useState } from "react";
import "./App.css";
import Home from './Home.jsx'
import Timer from './Timer.jsx'
import Hungry from './Hungry.jsx'
import Map from './Map.jsx'

const App = () => {
  const [screen, setScreen] = useState("home");

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <Home />;
      case "timer":
        return <Timer />;
      case "hungry":
        return <Hungry />;
      case "map":
        return <Map />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="watch-container">
      <div className="watch-face">
        <div className="screen">{renderScreen()}</div>
        <div className="buttons">
          <button onClick={() => setScreen("home")}>🏠</button>
          <button onClick={() => setScreen("timer")}>⏰️</button>
          <button onClick={() => setScreen("hungry")}>🍴</button>
          <button onClick={() => setScreen("map")}>🗺️</button>
        </div>
      </div>
    </div>
  );
};

export default App;
