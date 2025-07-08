# Bridgit-AI Translator Card

This project implements a neumorphic translator card UI as described, using reusable components for language selection, input, output, and microphone button. The layout adapts for both desktop and mobile, and clicking the 'B' icon opens a menu popup.

## Features
- Two language dropdowns (left and right)
- Swap button in the center
- Input field for text
- Output field for translation state
- Microphone button below
- 'B' menu button at the top
- Responsive neumorphic design

## Getting Started
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the development server:
   ```bash
   pnpm run start
   ```

## File Structure
- `src/components/Card.js` - Main translator card
- `src/components/Input.js` - Input field
- `src/components/LanguageDropdown.js` - Language selector
- `src/components/MenuButton.js` - 'B' menu button
- `src/components/MicrophoneButton.js` - Microphone button
- `src/components/Output.js` - Output display
- `src/components/SwapButton.js` - Swap button
- `src/App.js` - App entry point
- `src/index.js` - React entry point

## Design
- Neumorphic style inspired by [neumorphism.io](https://neumorphism.io/)
- UI components inspired by [uiverse.io](https://uiverse.io/)

## Next Steps
- Integrate ElevenLabs and Ably for voice and real-time features
- Connect translation API endpoints as specified
- Implement menu popup logic for the 'B' button
- Add accessibility and performance optimizations

---

Avi & Anush — Building empires together.
