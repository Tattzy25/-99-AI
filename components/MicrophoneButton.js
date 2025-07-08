import React from 'react';
import styled from 'styled-components';

const MicBtn = styled.button`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #ededed;
  box-shadow: 8px 8px 18px #d1d1d1, -8px -8px 18px #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 10px;
  transition: box-shadow 0.2s;
  &:active {
    box-shadow: 2px 2px 8px #d1d1d1, -2px -2px 8px #ffffff;
  }
`;

const MicIcon = styled.span`
  font-size: 32px;
  color: #b23aff;
  user-select: none;
`;

const MicrophoneButton = ({ onClick, recording, voiceLevel = 0, statusColor = '#b23aff' }) => (
  <MicBtn
    onClick={onClick}
    aria-label={recording ? "Stop recording" : "Start voice input"}
    style={{
      background: recording ? '#b23aff22' : '#ededed',
      boxShadow: recording
        ? `0 0 ${12 + voiceLevel * 12}px ${statusColor}`
        : '8px 8px 18px #d1d1d1, -8px -8px 18px #ffffff',
      transition: 'box-shadow 0.2s, background 0.2s'
    }}
  >
    <MicIcon style={{ color: statusColor, filter: recording ? 'drop-shadow(0 0 6px ' + statusColor + ')' : 'none', transition: 'color 0.2s, filter 0.2s' }}>
      {recording ? '🔴' : '🎤'}
    </MicIcon>
  </MicBtn>
);

export default MicrophoneButton;