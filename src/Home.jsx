import React from "react";
import Map from './Map.jsx'

const Home = (props) => {
  async function connectToESP32() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['e6d55b55-2eb5-4da8-8ddf-79e85b24ae10']
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('e6d55b55-2eb5-4da8-8ddf-79e85b24ae10');
        props.characteristic = await service.getCharacteristic('fd859f24-f1b7-4d9d-a098-2d28d9635c85');

        console.log("Connected to ESP32S3!");
        alert("Connected to ESP32S3!");
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Connection Error");
    }
  }

  return (
    <div>
      <h2>🏠️ Home</h2>
      <button onClick={() => connectToESP32()}>Connect</button>
    </div>
  );
};

export default Home;
