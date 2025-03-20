import React, { useState, useEffect } from "react";
import "./App.css";
import Timer from "./Timer.jsx";
import Hungry from "./Hungry.jsx";
import Map from "./Map.jsx";

let characteristic;

const App = () => {
  const [screen, setScreen] = useState("home");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function connectToESP32() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [import.meta.env.VITE_optionalServicesId],
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(import.meta.env.VITE_optionalServicesId);
      characteristic = await service.getCharacteristic(import.meta.env.VITE_characteristicId);

      console.log("Connected to ESP32S3!");
      alert("Connected to ESP32S3!");
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Connection Error");
    }
  }

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return (
          <div>
            <div className="home-container">
              <h1 className="digital-clock">{time.toLocaleTimeString("ja-JP", { hour12: false })}</h1>
            </div>
            <button onClick={() => connectToESP32()}>Connect</button>
          </div>
        );
      case "timer":
        return <Timer />;
      case "hungry":
        return <Hungry characteristic={characteristic} />;
      case "map":
        return <Map characteristic={characteristic} />;
      // default:
      //   return <Home />;
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
