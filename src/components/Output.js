import React from 'react';
import styled from 'styled-components';

const OutputWrapper = styled.div`
  width: 100%;
  min-height: 38px;
  border-radius: 10px;
  background: #ededed;
  box-shadow: 3px 3px 10px #d1d1d1, -1px -1px 6px #ffffff;
  display: flex;
  align-items: center;
  padding: 8px 14px;
  color: #888;
  font-size: 16px;
  font-weight: 500;
  margin-top: 2px;
`;

const Output = ({ value }) => {
  return <OutputWrapper>{value}</OutputWrapper>;
};

export default Output;