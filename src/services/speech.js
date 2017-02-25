const Synthesis = window.speechSynthesis;
const Utterance = window.SpeechSynthesisUtterance;

const lang = 'ja-JP';

export default function speak(text) {
  const phrase = new Utterance();

  const voices = Synthesis.getVoices().filter((voice) => voice.lang == lang);
  if (voices.length > 1) {
    phrase.voice = voices[1];
  }

  phrase.text = text + '。';
  phrase.lang = lang;
  phrase.rate = 1;

  Synthesis.cancel();
  Synthesis.speak(phrase);
};
