import React from "react";
import Card from "../components/Card";
import MenuButton from "../components/MenuButton";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', background: 'linear-gradient(145deg, #f0f0f0 60%, #e0e0e0 100%)', overflowX: 'hidden' }}>
      <div style={{ marginTop: 48, marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <MenuButton 
          onHost={() => {}}
          onJoin={() => {}}
          onEnd={() => {}}
          isHost={false}
          isJoined={false}
          hostCode=""
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Card />
      </div>
    </div>
  );
}
