import React, { useState, useEffect } from "react";
import "./Hungry.css";
import burpSound from "./assets/burp.mp3"; // アラーム音ファイルを追加

const Hungry = (props) => {
  const [fullness, setFullness] = useState(10); // 満腹度 0～100%
  const [isEating, setIsEating] = useState(false);
  const [isBurp, setIsBurp] = useState(false);

  const getStomachColor = () => {
    if (fullness >= 90) return "#8B0000"; // 濃い赤
    if (fullness >= 70) return "#FF6347"; // 赤
    if (fullness >= 50) return "#FFA500"; // オレンジ
    if (fullness >= 30) return "#FFD700"; // 黄色
    return "#4CAF50"; // 緑
  };

  const burpAudio = new Audio(burpSound);

  async function getPressure() {
    if (!props.characteristic) {
      console.log(props);
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
      let currentPressure = jsonData.sensor;
      console.info(`Pressure: ${currentPressure}`);

      setFullness(convertPressure2Fullness(currentPressure));
    } catch (error) {
      console.error("Read Error:", error);
    }
  }

  function convertPressure2Fullness(pressure) {
    return Math.abs(Math.trunc(pressure / 40.95) - 100);
  }

  function burp() {
    setIsBurp(true);
    burpAudio.play();
    setTimeout(() => setIsBurp(false), 1000); // 1秒後に消す
  }

  useEffect(() => {
    let timer;
    if (isEating) {
      setInterval(() => {
        getPressure();
      }, 1000);
      if (fullness > 80) {
        burp();
        console.info("burp!!!!!!");
      }
    } else {
      setIsEating(false);
    }
    return () => clearInterval(timer);
  }, [isEating, fullness]);

  return (
    <div>
      満腹度: {fullness}
      <button onClick={() => setIsEating(!isEating)}>{isEating ? "⏸ Stop" : "▶ Start"}</button>
      <div className="stomach-screen">
        <div className="stomach">
          <div className="stomach-content" style={{ height: `${fullness}%`, background: getStomachColor() }} />
        </div>
        {isBurp && <div className="burp-effect">💨</div>}
      </div>
    </div>
  );
};

export default Hungry;
