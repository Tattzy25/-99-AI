import React, { useState } from 'react';
import styled from 'styled-components';
import LanguageDropdown from "./LanguageDropdown.js";
import Input from "./Input.js";
import Output from "./Output.js";
import MicrophoneButton from "./MicrophoneButton.js";
import SwapButton from "./SwapButton.js";
import apiService from "../apiService.js";

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

const languages = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'sw', label: 'SW', flag: '🌍' }
];

const Card = () => {
  const [languages, setLanguages] = useState([]);
  const [fromLang, setFromLang] = useState(null);
  const [toLang, setToLang] = useState(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('Idle');
  const [status, setStatus] = useState('Idle');
  const [statusColor, setStatusColor] = useState('#b23aff');
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [hostCode, setHostCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translated, setTranslated] = useState('');
  const [playing, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isHostOrJoined, setIsHostOrJoined] = useState(false);
  const mediaStreamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);

  const handleMicClick = async () => {
    if (recording) {
      setRecording(false);
      setStatus('Processing...');
      setStatusColor('#ff9800');
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
    } else {
      setRecording(true);
      setStatus('Listening...');
      setStatusColor('#4caf50');
      setTranscript('');
      setTranslated('');
      setAudioUrl(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let animationFrameId;
        const updateVoiceLevel = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setVoiceLevel(avg / 128);
          if (recording) {
            animationFrameId = requestAnimationFrame(updateVoiceLevel);
          } else {
            setVoiceLevel(0);
            audioContext.close();
          }
        };
        updateVoiceLevel();
        const mediaRecorder = new window.MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        let audioChunks = [];
        mediaRecorder.ondataavailable = async (e) => {
          if (e.data.size > 0) {
            audioChunks.push(e.data);
            setStatus('Recording...');
            setStatusColor('#b23aff');
            // Stream audio chunk to STT API (Gemma 3n)
            try {
              const transcriptText = await streamSTT(e.data);
              if (transcriptText) handleTranscript(transcriptText);
            } catch (err) {
              setStatus('STT error');
              setStatusColor('#f44336');
            }
          }
        };
        mediaRecorder.onstop = async () => {
          setStatus('Transcribing...');
          setStatusColor('#2196f3');
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          try {
            const transcriptText = await streamSTT(audioBlob);
            if (transcriptText) handleTranscript(transcriptText);
          } catch (err) {
            setStatus('STT error');
            setStatusColor('#f44336');
          }
        };
        mediaRecorder.start(250);
      } catch (err) {
        setRecording(false);
        setStatus('Mic error');
        setStatusColor('#f44336');
        alert('Microphone access denied or unavailable.');
      }
    }
  };

  const handleTranscript = async (text) => {
    setTranscript(text);
    setInput(text);
    setStatus('Translating...');
    setStatusColor('#673ab7');
    try {
      const translatedText = await translateText(text, fromLang.code, toLang.code);
      setTranslated(translatedText);
      setOutput(translatedText);
      setStatus('Speaking...');
      setStatusColor('#009688');
      try {
        const ttsUrl = await textToSpeech(translatedText, toLang.code);
        setAudioUrl(ttsUrl);
        if (ttsUrl) {
          const audio = new Audio(ttsUrl);
          setPlaying(true);
          audio.play();
          audio.onended = () => setPlaying(false);
        }
      } catch (err) {
        setStatus('TTS error');
        setStatusColor('#f44336');
      }
    } catch (err) {
      setStatus('Translation error');
      setStatusColor('#f44336');
    }
  };

  const handleSend = () => {
    setStatus('Sending...');
    setStatusColor('#ff9800');
    if (isHostOrJoined && transcript && audioUrl) {
      sendToAbly(hostCode, { transcript, translated, audioUrl, lang: toLang.code });
    }
  };

  const handleReRecord = () => {
    setTranscript('');
    setTranslated('');
    setAudioUrl(null);
    setInput('');
    setOutput('Idle');
    setStatus('Idle');
    setStatusColor('#b23aff');
  };

  const handleSwap = () => {
    const prevFrom = fromLang;
    setFromLang(toLang);
    setToLang(prevFrom);
  };

  React.useEffect(() => {
    async function loadLanguages() {
      try {
        const apiKey = process.env.REACT_APP_DEEPL_API_KEY;
        const langs = await fetchDeepLLanguages(apiKey);
        setLanguages(langs);
        setFromLang(langs[0]);
        setToLang(langs[1]);
      } catch (e) {
        setLanguages([]);
      }
    }
    loadLanguages();
  }, []);

  return (
    <CardWrapper>
      <LangRow>
        <LanguageDropdown selected={fromLang} onChange={setFromLang} languages={languages} />
        <SwapBtnWrapper>
          <SwapButton onClick={handleSwap} />
        </SwapBtnWrapper>
        <LanguageDropdown selected={toLang} onChange={setToLang} languages={languages} />
      </LangRow>
      <InputSection>
        <Input value={input} onChange={setInput} />
      </InputSection>
      <OutputSection>
        <Output value={output} />
      </OutputSection>
      <div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',marginBottom:8}}>
        <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <MicrophoneButton onClick={handleMicClick} recording={recording} voiceLevel={voiceLevel} statusColor={statusColor} />
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none'}}>
            <svg width="80" height="80">
              <circle cx="40" cy="40" r="32" fill="none" stroke={statusColor} strokeWidth={4+voiceLevel*8} opacity={recording?0.5:0.2} style={{filter:'blur(2px)'}} />
            </svg>
          </div>
        </div>
      </div>
      <div style={{width:'100%',textAlign:'center',marginBottom:8}}>
        <span style={{fontWeight:600,color:statusColor,transition:'color 0.2s'}}>{status}</span>
      </div>
      {isHostOrJoined && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
          <button onClick={handleSend} style={{ display: transcript ? 'block' : 'none' }}>Send</button>
          <button onClick={handleReRecord} style={{ display: transcript ? 'block' : 'none' }}>Re-record</button>
        </div>
      )}
      {isHost && hostCode && (
        <div style={{marginTop:12,textAlign:'center',fontWeight:600,fontSize:18,color:'#b23aff'}}>
          Share this code: <span style={{fontFamily:'monospace',background:'#fff',padding:'2px 8px',borderRadius:8}}>{hostCode}</span>
        </div>
      )}
    </CardWrapper>
  );
};

export default Card;
;