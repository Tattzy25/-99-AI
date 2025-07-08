import React, { useState } from 'react';
import styled from 'styled-components';

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const BButton = styled.button`
  width: 72px;
  height: 72px;
  border-radius: 24px;
  background: #ededed;
  box-shadow: 8px 8px 18px #d1d1d1, -8px -8px 18px #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 0;
  transition: box-shadow 0.2s;
  &:active {
    box-shadow: 2px 2px 8px #d1d1d1, -2px -2px 8px #ffffff;
  }
`;

const BIcon = styled.span`
  font-size: 48px;
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  color: #b23aff;
  text-shadow: 1px 1px 0 #fff, 2px 2px 8px #b23aff99;
  user-select: none;
`;

const MenuPopup = styled.div`
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 180px;
  background: #ededed;
  border-radius: 18px;
  box-shadow: 8px 8px 18px #d1d1d1, -8px -8px 18px #ffffff;
  padding: 18px 24px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 18px;
  padding: 8px 0;
  margin: 0;
  cursor: pointer;
  width: 100%;
  text-align: left;
  &:hover {
    color: #b23aff;
  }
`;

const MenuButton = ({ onHost, onJoin, onEnd, isHost, isJoined, hostCode }) => {
  const [open, setOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [joinError, setJoinError] = useState('');

  return (
    <MenuWrapper>
      <BButton onClick={() => setOpen((v) => !v)} aria-label="Open menu">
        <BIcon>B</BIcon>
      </BButton>
      {open && (
        <MenuPopup>
          <div style={{width:'100%',display:'flex',flexDirection:'column',gap:8,marginBottom:12}}>
            <button style={{width:'100%',padding:'8px 0',borderRadius:8,background:'#b23aff',color:'#fff',fontWeight:600,border:'none',fontSize:16,cursor:'pointer'}} onClick={()=>onHost && onHost(Math.random().toString(36).substr(2,8).toUpperCase())}>Host</button>
            <button style={{width:'100%',padding:'8px 0',borderRadius:8,background:'#ededed',color:'#b23aff',fontWeight:600,border:'1px solid #b23aff',fontSize:16,cursor:'pointer'}} onClick={()=>onJoin && onJoin(inputCode)}>Join</button>
            <button style={{width:'100%',padding:'8px 0',borderRadius:8,background:'#f44336',color:'#fff',fontWeight:600,border:'none',fontSize:16,cursor:'pointer'}} onClick={onEnd}>End</button>
          </div>
          <MenuItem as="div" style={{padding:0, width:'100%'}}>
            <input
              type="text"
              placeholder="Enter code to join"
              value={inputCode}
              onChange={e => setInputCode(e.target.value.toUpperCase())}
              style={{width:'100%',padding:'6px 8px',borderRadius:8,border:'1px solid #ccc',marginBottom:4,fontSize:16}}
            />
          </MenuItem>
        </MenuPopup>
      )}
    </MenuWrapper>
  );
};

export default MenuButton;