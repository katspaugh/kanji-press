/**
 * Speak a piece of text
 *
 * @param {string} text
 * @param {string} lang
 */
export default function speak(text) {
  const lang = 'ja-JP';

  speechSynthesis.cancel();

  let speech = new SpeechSynthesisUtterance();

  const voice = speechSynthesis.getVoices().filter(voice => {
    return !voice.localService && voice.lang.startsWith(lang);
  })[0];
  if (voice) speech.voice = voice;

  speech.text = text + '。';
  speech.lang = lang;
  speech.rate = 1;
  speechSynthesis.speak(speech);
}

speak('');
