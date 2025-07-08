"use client";
import React, { useState } from "react";
import Card from "../components/Card";
import MenuButton from "../components/MenuButton";

export default function Home() {
  const [isHost, setIsHost] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [hostCode, setHostCode] = useState("");

  const handleHost = (code) => {
    setIsHost(true);
    setIsJoined(false);
    setHostCode(code);
  };
  const handleJoin = (code) => {
    setIsHost(false);
    setIsJoined(true);
    setHostCode(code);
  };
  const handleEnd = () => {
    setIsHost(false);
    setIsJoined(false);
    setHostCode("");
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', background: 'linear-gradient(145deg, #f0f0f0 60%, #e0e0e0 100%)', overflowX: 'hidden' }}>
      <div style={{ marginTop: 48, marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <MenuButton 
          onHost={handleHost}
          onJoin={handleJoin}
          onEnd={handleEnd}
          isHost={isHost}
          isJoined={isJoined}
          hostCode={hostCode}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Card />
      </div>
    </div>
  );
}