import jlpt5 from '../../data/jlpt5.json';
import jlpt4 from '../../data/jlpt4.json';
import jlpt3 from '../../data/jlpt3.json';
import jlpt2 from '../../data/jlpt2.json';

const formatList = (list, name) => {
  return list.map(item => ({
    word: item[0],
    reading: item[1],
    meaning: item[2],
    level: name
  }));
};

const data = {
  jlpt5: formatList(jlpt5, 'N5'),
  jlpt4: formatList(jlpt4, 'N4'),
  jlpt3: formatList(jlpt3, 'N3'),
  jlpt2: formatList(jlpt2, 'N2')
};

export default {
  get(levels) {
    return Object.keys(levels)
      .filter((key) => levels[key])
      .reduce((acc, key) => acc.concat(data[key]), []);
  }
};

