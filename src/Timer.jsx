import React, { useState, useEffect } from "react";
import "./Timer.css";
import alarmSound from "./assets/Hungry03-mp3/Hungry03-1.mp3"; // アラーム音ファイルを追加

const Timer = () => {
  const defaultSecond = 10;
  const [time, setTime] = useState(defaultSecond);
  const [isRunning, setIsRunning] = useState(false);

  const alarmAudio = new Audio(alarmSound);

  // タイマーの動作
  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      alarmAudio.play(); // 0秒になったらアラーム音を鳴らす
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  // タイマーの表示をフォーマット（MM:SS）
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="timer-screen">
      <h2>{formatTime(time)}</h2>
      <div className="timer-buttons">
        <button onClick={() => setTime(time + 10)}>+ 10s</button>
        <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "⏸ Stop" : "▶ Start"}</button>
        <button onClick={() => setTime(time - 5)}>- 5s</button>
        <button onClick={() => setTime(defaultSecond)}>🔄 Reset</button>
      </div>
    </div>
  );
};

export default Timer;
