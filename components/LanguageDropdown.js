import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const DropdownWrapper = styled.div`
  position: relative;
  width: 120px;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #ededed;
  box-shadow: 5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:active {
    box-shadow: inset 5px 5px 10px #d1d1d1, inset -5px -5px 10px #ffffff;
  }
`;

const Dropdown = styled.select`
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  background: #f7f7f7;
  font-size: 1rem;
  outline: none;
  margin: 0 8px;
`;

const Flag = styled.span`
  margin-right: 8px;
`;

const Label = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 8px;
  background: #ededed;
  border-radius: 12px;
  box-shadow: 5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff;
  z-index: 10;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background: rgba(178, 58, 255, 0.1);
  }
`;

const LanguageDropdown = ({ selected, onChange, languages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang) => {
    onChange(lang);
    setIsOpen(false);
  };

  if (!languages || languages.length === 0 || !selected) {
    return <DropdownWrapper><DropdownButton disabled>Loading...</DropdownButton></DropdownWrapper>;
  }

  return (
    <DropdownWrapper ref={dropdownRef}>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        <Flag>{selected.flag}</Flag>
        <Label>{selected.label}</Label>
      </DropdownButton>
      {isOpen && (
        <DropdownContent>
          {languages.map((lang) => (
            <DropdownItem
              key={lang.code}
              onClick={() => handleSelect(lang)}
            >
              <Flag>{lang.flag}</Flag>
              <Label>{lang.label}</Label>
            </DropdownItem>
          ))}
        </DropdownContent>
      )}
    </DropdownWrapper>
  );
};

export default LanguageDropdown;