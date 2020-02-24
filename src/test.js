  useEffect(() => {
    let generatedHTML = [];
    let words = text.split(' ');
    words.forEach((word, index) => {
      const id = `word-${index}`;
      let styles = {};
      if(index !== 0) {
        let two = words[index - 1] + '_' + word
        two = two.toLowerCase()
        two = two.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")

        if(two in twogram) {
          styles['textDecoration'] = 'underline'
          if(twogram[two] > 5000) {
            styles['textDecorationColor'] =  'gray'
          } else if(twogram[two] > 1000) {
            styles['textDecorationColor'] =  'yellow'
          } else if(twogram[two] > 500) {
            styles['textDecorationColor'] =  'orange'
          } else {
            styles['textDecorationColor'] =  'red'
          }
        }
      }
      let test = word.toLowerCase();
      test = test.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")
      if (test in onegram) {
        if(onegram[test] >= 10000) {
          styles['color'] = 'gray';  
        } else if(onegram[test] >= 5000) {
          styles['color'] = 'yellow';
        } else if(onegram[test] >= 1000) {
          styles['color'] = 'orange'
        } else {
          styles['color'] = 'red'
        }
      }
      generatedHTML.push(<><span key={id} style={styles}>{word}</span>{' '}</>);
    });
    setTextContent(generatedHTML);
  }, [text]);
