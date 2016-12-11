# Kanji-Press

A game of kanji-based words.

<img width="311" src="https://cloud.githubusercontent.com/assets/381895/21077171/922f71c4-bf42-11e6-81a3-0ac6e5684e2c.png">

### Credits
The word lists are taken from https://en.wiktionary.org/wiki/Appendix:JLPT

Copy the words like this:

```
copy(JSON.stringify(
  (document.querySelector('#mw-content-text ul')
    .textContent
    .split('\n')
    .map((word) => word.split(' -'))
    .map((pair) => [ pair[0].split(', ')[0], pair[0].split(', ')[1] || '', pair[1] ])
    .filter((word) => word[1])
  ), null, 2))
```
