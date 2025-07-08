"use client";
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
  background: #e0e0e0e0;
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

  const handleReRecord = async () => {
    setTranscript('');
    setTranslated('');
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
          onClick={handleMicClick}
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

// --- Add utility functions for STT, TTS, and Ably integration ---
async function streamSTT(audioBlob) {
  // Replace with actual OpenRouter API (Gemma 3n) call
  // Example: send audioBlob to OpenRouter endpoint, receive transcript
  // Return transcript string
  throw new Error('streamSTT not implemented');
}

async function textToSpeech(text, lang, voiceId = null) {
  // ElevenLabs API endpoint for TTS
  const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || 'default'}`;
  const body = JSON.stringify({
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75
    },
    output_format: "mp3",
    // Optionally add language if needed by API
  });
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json"
    },
    body
  });
  if (!response.ok) throw new Error("TTS API error");
  // ElevenLabs returns audio as a binary stream
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

async function sendToAbly(payload) {
  // Replace with actual Ably integration
  // Example: send payload (text/audio) to Ably channel
  throw new Error('sendToAbly not implemented');
}