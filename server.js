import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as deepl from 'deepl-node';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DEEPL_AUTH_KEY = process.env.DEEPL_API_KEY;
const translator = new deepl.Translator(DEEPL_AUTH_KEY);

app.use(cors());
app.use(bodyParser.json());

app.post('/api/translate', async (req, res) => {
  const { text, sourceLang, targetLang } = req.body;
  if (!DEEPL_AUTH_KEY) return res.status(500).json({ error: 'DeepL API key not set' });
  try {
    const result = await translator.translateText(text, sourceLang, targetLang);
    res.json({ translatedText: result.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});