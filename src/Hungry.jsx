import React from "react";

const Hungry = (props) => {

  async function getPressure() {
    if (!props.characteristic) {
        console.log(props)
        console.error("Not connected to ESP32");
        return;
    }
    try {
        const value = await props.characteristic.readValue();
        let decoder = new TextDecoder();
        let jsonStr = decoder.decode(value);
        let jsonData;
        try {
            jsonData = JSON.parse(jsonStr);
        } catch (error) {
            console.error("JSON Parse Error:", error);
            return;
        }
        let currentPressure = jsonData.sensor
        console.info(`Pressure: ${currentPressure}`)
        document.getElementById("currentPressure").textContent=currentPressure
    } catch (error) {
        console.error("Read Error:", error);
    }
  }

  return (
    <div>
      <h2>🍴 Hungry</h2>
      <label id="currentPressure">0</label>
      <button onClick={() => getPressure()}>Get Pressure</button>
    </div>
  );
};

export default Hungry;
