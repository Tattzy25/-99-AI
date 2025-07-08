import React from 'react';
import styled from 'styled-components';

const SwapBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ededed;
  box-shadow: 4px 4px 12px #d1d1d1, -4px -4px 12px #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 22px;
  transition: box-shadow 0.2s;
  &:active {
    box-shadow: 1px 1px 4px #d1d1d1, -1px -1px 4px #ffffff;
  }
`;

const SwapIcon = styled.span`
  display: inline-block;
  font-size: 24px;
  color: #b23aff;
  user-select: none;
`;

const SwapButton = ({ onClick }) => (
  <SwapBtn onClick={onClick} aria-label="Swap languages">
    <SwapIcon>&#8646;</SwapIcon>
  </SwapBtn>
);

export default SwapButton;