import React, {useState, useEffect} from 'react';
import './App.css';


function App() {
  const [text, setText] = useState("")
  const [textContent, setTextContent] = useState("");
  const [original, setOriginal] = useState('')



  let onegram = (require('./1_gram_json.json'))
  let twogram = (require('./2_gram_json.json'))


  function updateText(e) {
	  setText(e.target.value);
  };

  async function apiRequest() {
    let r = await fetch("/api/index.py?original=" + escape(original.trim()) + '?text=' + escape(text.trim()))
    r = await r.text()
    console.log(r)
  }

  useEffect(() => {
    let generatedHTML = [];
    let words = text.split(' ');
    words.forEach((word, index) => {
      const id = `word-${index}`;
      let styles = {};
      if(index !== 0) {
        let two = words[index - 1] + '_' + word
        two = two.toLowerCase()
        if(two in twogram) {
          if(twogram[two] > 5000) {
            styles['textDecoration'] = 'underline'
            styles['textDecorationColor'] =  'gray'
          } else if(twogram[two] > 1000) {
            styles['textDecoration'] = 'underline'
            styles['textDecorationColor'] =  'yellow'
          } else if(twogram[two] > 500) {
            styles['textDecoration'] = 'underline'
            styles['textDecorationColor'] =  'orange'
          } else {
            styles['textDecoration'] = 'underline'
            styles['textDecorationColor'] =  'red'
          }
        }
      }
      let test = word.toLowerCase();
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

  return (
    <div>
      <div className = "input">
      <textarea className= "text-input" value={text} onChange={updateText}></textarea>
      <button className = "button" onClick={() => {setOriginal(text)}} type="primary"> 
      Set Quote
      </button>
      <button className = "button" onClick={apiRequest} type="primary"> 
      Check Quote
      </button>
      </div>
      <div> Original Quote:</div>
      {original && <div>{original}</div>}
      <div> Highlighted Quote:</div>
      <div className="text-content">{textContent}</div>
    </div>
  )
}

export default App;
