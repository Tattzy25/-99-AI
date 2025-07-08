"use client";
import React, { useState } from 'react';
import Input from './Input';
import Output from './Output';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  .radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 1rem;
    background: linear-gradient(145deg, #e6e6e6, #ffffff);
    box-sizing: border-box;
    box-shadow:
      5px 5px 15px rgba(0, 0, 0, 0.15),
      -5px -5px 15px rgba(255, 255, 255, 0.8);
    padding: 0.5rem;
    width: 300px;
    font-size: 14px;
    gap: 0.5rem;
  }
  .radio-inputs .radio {
    flex: 1 1 auto;
    text-align: center;
    position: relative;
  }
  .radio-inputs .radio input {
    display: none;
  }
  .radio-inputs .radio .name {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 0.7rem;
    border: none;
    padding: 0.7rem 0;
    color: #2d3748;
    font-weight: 500;
    font-family: inherit;
    background: linear-gradient(145deg, #ffffff, #e6e6e6);
    box-shadow:
      3px 3px 6px rgba(0, 0, 0, 0.1),
      -3px -3px 6px rgba(255, 255, 255, 0.7);
    transition: all 0.2s ease;
    overflow: hidden;
  }
  .radio-inputs .radio input:checked + .name {
    background: linear-gradient(145deg, #3b82f6, #2563eb);
    color: white;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow:
      inset 2px 2px 5px rgba(0, 0, 0, 0.2),
      inset -2px -2px 5px rgba(255, 255, 255, 0.1),
      3px 3px 8px rgba(59, 130, 246, 0.3);
    transform: translateY(2px);
  }
  .radio-inputs .radio:hover .name {
    background: linear-gradient(145deg, #f0f0f0, #ffffff);
    transform: translateY(-1px);
    box-shadow:
      4px 4px 8px rgba(0, 0, 0, 0.1),
      -4px -4px 8px rgba(255, 255, 255, 0.8);
  }
  .radio-inputs .radio:hover input:checked + .name {
    transform: translateY(1px);
  }
  .radio-inputs .radio input:checked + .name {
    animation: select 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 64px 32px 32px 32px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 0; /* remove card shape for full screen */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;


const SquareButton = styled.button`
  width: 100px;
  height: 100px;
  border: 2px solid #888888;
  outline: none;
  background-color: #e0e0e0e0;
  border-radius: 20px;
  box-shadow:
    -1px -1px 10px #bebebe,
    -1px -1px 10px #bebebe,
    -1px 1px 10px #bebebe,
    3px 10px 12px rgba(0, 0, 0, 0.2);
  transition: 0.3s ease-in-out;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin: 0 8px;
  padding: 0;
  &:hover {
    transform: scale(1.1);
    box-shadow:
      -3px -15px 20px #ffffff,
      -3px -10px 10px #ffffff,
      -10px 0px 15px #ffffff,
      5px 15px 15px rgba(0, 0, 0, 0.3);
  }
  &:active {
    transform: scale(0.95);
    box-shadow: none;
  }
`;

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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
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
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [voiceLabOpen, setVoiceLabOpen] = useState(false);

  return (
    <MenuWrapper>
      <BButton onClick={() => setOpen((v) => !v)} aria-label="Open menu">
        <BIcon>B</BIcon>
      </BButton>
      {open && (
        <ModalOverlay>
          <ModalContent>
            <button style={{position:'absolute',top:16,left:16,zIndex:10,background:'none',border:'none',fontSize:32,cursor:'pointer'}} onClick={()=>setOpen(false)} aria-label="Back">←</button>
            <StyledWrapper>
              <div className="radio-inputs">
                <label className="radio">
                  <input defaultChecked name="radio" type="radio" />
                  <span className="name">HOST</span>
                </label>
                <label className="radio">
                  <input name="radio" type="radio" />
                  <span className="name">JOIN</span>
                </label>
                <label className="radio">
                  <input name="radio" type="radio" />
                  <span className="name">END</span>
                </label>
                <label className="radio">
                  <input name="radio" type="radio" />
                  <span className="name">SOLO</span>
                </label>
              </div>
            </StyledWrapper>
            <div style={{width:'90%',maxWidth:400,margin:'32px auto 0 auto'}}>
              <Input value={inputValue} onChange={setInputValue} />
              <Output value={outputValue} />
            </div>
            <div style={{display:'flex',gap:18,marginTop:32,justifyContent:'center'}}>
              <SquareButton>
                <SquareButtonContent>
                  <GradientIcon>
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="settings-gradient" x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#5EE7DF"/>
                          <stop offset="0.5" stop-color="#B490CA"/>
                          <stop offset="1" stop-color="#F7797D"/>
                        </linearGradient>
                      </defs>
                      <circle cx="16" cy="16" r="14" stroke="url(#settings-gradient)" stroke-width="4" fill="none"/>
                      <circle cx="16" cy="16" r="6" fill="url(#settings-gradient)"/>
                    </svg>
                  </GradientIcon>
                  <span style={{color:'#111',fontWeight:700,fontSize:18}}>SETTINGS</span>
                </SquareButtonContent>
              </SquareButton>
              <SquareButton onClick={()=>{setVoiceLabOpen(true);setOpen(false);}}>
                <SquareButtonContent>
                  <GradientIcon>
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="voicelab-gradient" x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#5EE7DF"/>
                          <stop offset="0.5" stop-color="#B490CA"/>
                          <stop offset="1" stop-color="#F7797D"/>
                        </linearGradient>
                      </defs>
                      <rect x="6" y="10" width="20" height="12" rx="6" stroke="url(#voicelab-gradient)" stroke-width="4" fill="none"/>
                      <rect x="12" y="6" width="8" height="20" rx="4" fill="url(#voicelab-gradient)"/>
                    </svg>
                  </GradientIcon>
                  <span style={{color:'#111',fontWeight:700,fontSize:18}}>VOICE LAB</span>
                </SquareButtonContent>
              </SquareButton>
              <SquareButton>
                <SquareButtonContent>
                  <GradientIcon>
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="other-gradient" x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#5EE7DF"/>
                          <stop offset="0.5" stop-color="#B490CA"/>
                          <stop offset="1" stop-color="#F7797D"/>
                        </linearGradient>
                      </defs>
                      <rect x="8" y="14" width="16" height="4" rx="2" fill="url(#other-gradient)"/>
                      <rect x="8" y="22" width="16" height="4" rx="2" fill="url(#other-gradient)"/>
                      <rect x="8" y="6" width="16" height="4" rx="2" fill="url(#other-gradient)"/>
                    </svg>
                  </GradientIcon>
                  <span style={{color:'#111',fontWeight:700,fontSize:18}}>OTHER</span>
                </SquareButtonContent>
              </SquareButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
      {voiceLabOpen && (
        <ModalOverlay>
          <ModalContent>
            <button style={{position:'absolute',top:16,left:16,zIndex:10,background:'none',border:'none',fontSize:32,cursor:'pointer'}} onClick={()=>{setVoiceLabOpen(false);setOpen(true);}} aria-label="Back">←</button>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:24,width:'100%',marginTop:32}}>
              <SquareButton>
                <SquareButtonContent>
                  <GradientIcon>
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="clone-gradient" x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#5EE7DF"/>
                          <stop offset="0.5" stop-color="#B490CA"/>
                          <stop offset="1" stop-color="#F7797D"/>
                        </linearGradient>
                      </defs>
                      <rect x="8" y="8" width="16" height="16" rx="8" stroke="url(#clone-gradient)" stroke-width="4" fill="none"/>
                      <rect x="14" y="14" width="4" height="4" rx="2" fill="url(#clone-gradient)"/>
                    </svg>
                  </GradientIcon>
                  <span style={{color:'#111',fontWeight:700,fontSize:18}}>CLONE VOICE</span>
                </SquareButtonContent>
              </SquareButton>
              <SquareButton>
                <SquareButtonContent>
                  <GradientIcon>
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="saved-gradient" x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#5EE7DF"/>
                          <stop offset="0.5" stop-color="#B490CA"/>
                          <stop offset="1" stop-color="#F7797D"/>
                        </linearGradient>
                      </defs>
                      <rect x="6" y="10" width="20" height="12" rx="6" stroke="url(#saved-gradient)" stroke-width="4" fill="none"/>
                      <rect x="12" y="14" width="8" height="4" rx="2" fill="url(#saved-gradient)"/>
                    </svg>
                  </GradientIcon>
                  <span style={{color:'#111',fontWeight:700,fontSize:18}}>SAVED VOICES</span>
                </SquareButtonContent>
              </SquareButton>
              <SquareButton>
                <SquareButtonContent>
                  <GradientIcon>
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="library-gradient" x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#5EE7DF"/>
                          <stop offset="0.5" stop-color="#B490CA"/>
                          <stop offset="1" stop-color="#F7797D"/>
                        </linearGradient>
                      </defs>
                      <rect x="8" y="8" width="16" height="16" rx="4" stroke="url(#library-gradient)" stroke-width="4" fill="none"/>
                      <rect x="12" y="12" width="8" height="8" rx="2" fill="url(#library-gradient)"/>
                    </svg>
                  </GradientIcon>
                  <span style={{color:'#111',fontWeight:700,fontSize:18}}>VOICE LIBRARY</span>
                </SquareButtonContent>
              </SquareButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </MenuWrapper>
  );
};

export default MenuButton;
const GradientIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  svg {
    width: 32px;
    height: 32px;
    display: block;
  }
`;
const SquareButtonContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;