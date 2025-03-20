import { useState, useEffect } from "react";
import "./Map.css";

const Map = (props) => {
  const [direction, setDirection] = useState(0);
  const [isGuiding, setIsGuiding] = useState(false);

  async function sendAngleAndMoter(angle, moterState) {
    console.log("sendAngleAndMoter func");
    console.log(props.characteristic);
    if (!props.characteristic) {
      console.error("Not connected to ESP32");
      return;
    }
    try {
      let jsonData = JSON.stringify({ angle: angle, moter: moterState });
      let encoder = new TextEncoder();
      await props.characteristic.writeValue(encoder.encode(jsonData));

      console.log("Sent JSON:", jsonData);
    } catch (error) {
      console.error("Write Error:", error);
    }
  }

  useEffect(() => {
    // デバイスの向きを取得
    const handleOrientation = (event) => {
      let alpha = event.alpha; // デバイスの回転角度（0°〜360°）
      if (alpha !== null && isGuiding) {
        setDirection(alpha);
        sendAngleAndMoter(alpha, "on");
      } else {
        sendAngleAndMoter(0, "off");
      }
    };

    // イベントリスナーを追加
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      // コンポーネントがアンマウントされたらリスナー削除
      window.removeEventListener("deviceorientation", handleOrientation);
      sendAngleAndMoter(0, "off");
    };
  }, [isGuiding]);

  return (
    <div className="compass-container">
      <div className="guide-button">
        <button onClick={() => setIsGuiding(!isGuiding)}>{isGuiding ? "⏸ Stop" : "▶ Start"}</button>
      </div>
      <input className="spot-name" type="text" placeholder="your destination" />
      {/* <input type="number" min="0" max="360" value={Math.round(direction)} onChange={(e) => setDirection(Number(e.target.value))} /> */}
      <div className="compass" style={{ transform: `rotate(${direction}deg)` }}>
        ➤
      </div>
      <p>方角: {Math.round(direction)}°</p>
    </div>
  );
};

export default Map;
