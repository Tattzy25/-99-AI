import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Card from './components/Card.js';
import MenuButton from './components/MenuButton.js';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: #ededed;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }
`;

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(145deg, #f0f0f0 60%, #e0e0e0 100%);
`;

const TopMenu = styled.div`
  margin-top: 36px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function App() {
  const [isHost, setIsHost] = React.useState(false);
  const [isJoined, setIsJoined] = React.useState(false);
  const [hostCode, setHostCode] = React.useState("");

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
    <AppWrapper>
      <GlobalStyle />
      <TopMenu>
        <MenuButton
          onHost={handleHost}
          onJoin={handleJoin}
          onEnd={handleEnd}
          isHost={isHost}
          isJoined={isJoined}
          hostCode={hostCode}
        />
      </TopMenu>
      <Card
        isHostOrJoined={isHost || isJoined}
        isHost={isHost}
        isJoined={isJoined}
        hostCode={hostCode}
      />
    </AppWrapper>
  );
}

export default App;