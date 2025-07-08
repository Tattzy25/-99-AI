import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import LanguageDropdown from "./LanguageDropdown";
import Input from "./Input";
import Output from "./Output";
import MicrophoneButton from "./MicrophoneButton";
import SwapButton from "./SwapButton";

const CardWrapper = styled.div`
  width: 420px;
  max-width: 95vw;
  border-radius: 36px;
  background: #ededed;
  box-shadow: 15px 15px 30px #d1d1d1, -15px -15px 30px #ffffff;
  padding: 36px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  @media (max-width: 600px) {
    width: 98vw;
    padding: 24px 6px 24px 6px;
  }
`;

const LangRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
`;

const SwapBtnWrapper = styled.div`
  margin: 0 12px;
`;

const InputSection = styled.div`
  width: 100%;
  margin-bottom: 18px;
`;

const OutputSection = styled.div`
  width: 100%;
  margin-bottom: 24px;
`;

const MicWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

async function translateText(text, sourceLang, targetLang) {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, sourceLang, targetLang })
  });
  if (!response.ok) throw new Error('Translation failed');
  const data = await response.json();
  return data.translatedText;
}

const Card = () => {
  const [languages, setLanguages] = useState([]);
  const [fromLang, setFromLang] = useState(null);
  const [toLang, setToLang] = useState(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('Idle');
  const [status, setStatus] = useState('Idle');
  const [statusColor, setStatusColor] = useState('#b23aff');
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translated, setTranslated] = useState('');
  const [playing, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const handleTranslate = async () => {
    setStatus('Translating...');
    setStatusColor('#673ab7');
    try {
      const translatedText = await translateText(input, fromLang.code, toLang.code);
      setTranslated(translatedText);
      setOutput(translatedText);
      setStatus('Done');
      setStatusColor('#009688');
    } catch (err) {
      setStatus('Translation error');
      setStatusColor('#f44336');
    }
  };

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const res = await fetch('/api/languages');
        const data = await res.json();
        const mapped = data.languages.map(l => ({
          code: l.language,
          label: l.name || l.language,
          flag: '',
        }));
        setLanguages(mapped);
        setFromLang(mapped.find(l => l.code === 'EN') || mapped[0]);
        setToLang(mapped.find(l => l.code === 'FR') || mapped[1]);
      } catch (e) {
        setLanguages([]);
      }
    }
    fetchLanguages();
  }, []);

  return (
    <CardWrapper>
      <LangRow>
        <LanguageDropdown selected={fromLang} onChange={setFromLang} languages={languages} />
        <SwapBtnWrapper>
          <SwapButton onClick={() => {
            const temp = fromLang;
            setFromLang(toLang);
            setToLang(temp);
          }} />
        </SwapBtnWrapper>
        <LanguageDropdown selected={toLang} onChange={setToLang} languages={languages} />
      </LangRow>
      <InputSection>
        <Input value={input} onChange={setInput} />
        <button style={{marginTop:8}} onClick={handleTranslate}>Translate</button>
      </InputSection>
      <OutputSection>
        <Output value={output} />
      </OutputSection>
      <MicWrapper>
        <MicrophoneButton
          onClick={() => {}}
          recording={recording}
          voiceLevel={voiceLevel}
          statusColor={statusColor}
        />
      </MicWrapper>
      {/* Add additional controls and status display as needed */}
    </CardWrapper>
  );
};

export default Card;