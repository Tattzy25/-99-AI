import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  .container {
    display: flex;
    flex-direction: column;
    gap: 7px;
    position: relative;
    color: #333;
  }
  .container .label {
    font-size: 15px;
    padding-left: 10px;
    position: absolute;
    top: 13px;
    transition: 0.3s;
    pointer-events: none;
    color: #b23aff;
    font-weight: 600;
  }
  .input {
    width: 100%;
    height: 45px;
    border: none;
    outline: none;
    padding: 0px 7px;
    border-radius: 12px;
    color: #333;
    font-size: 15px;
    background-color: #ededed;
    box-shadow: 3px 3px 10px #d1d1d1, -1px -1px 6px #ffffff;
    transition: box-shadow 0.2s;
  }
  .input:focus {
    border: 2px solid #b23aff44;
    color: #333;
    box-shadow: 3px 3px 10px #d1d1d1, -1px -1px 6px #ffffff, inset 3px 3px 10px #d1d1d1, inset -1px -1px 6px #ffffff;
  }
  .container .input:valid ~ .label,
  .container .input:focus ~ .label {
    transition: 0.3s;
    padding-left: 2px;
    transform: translateY(-35px);
    font-size: 13px;
    color: #b23aff;
  }
  .container .input:valid,
  .container .input:focus {
    box-shadow: 3px 3px 10px #d1d1d1, -1px -1px 6px #ffffff, inset 3px 3px 10px #d1d1d1, inset -1px -1px 6px #ffffff;
  }
`;

const Input = ({ value, onChange }) => {
  return (
    <StyledWrapper>
      <div className="container">
        <input
          required
          type="text"
          name="text"
          className="input"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <label className="label">Enter text to translate</label>
      </div>
    </StyledWrapper>
  );
};

export default Input;