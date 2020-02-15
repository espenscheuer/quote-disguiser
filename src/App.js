import React, {useState, useEffect} from 'react';
import './App.css';


function App() {
  const [text, setText] = useState("")
  const [textContent, setTextContent] = useState('');

  async function updateText(e) {
    await console.log(fetch(`/api`))
	  setText(e.target.value);
  };

  useEffect(() => {
    let generatedHTML = [];
    text.split(' ').forEach((word, index) => {
      const id = `word-${index}`;
      let styles = {};
      
      if (word.startsWith('c')) {
        styles['color'] = 'red';  
      }
      generatedHTML.push(<><span key={id} style={styles}>{word}</span>{' '}</>);
    });
    setTextContent(generatedHTML);
  }, [text]);

  return (
    <div>
      <textarea value={text} onChange={updateText}></textarea>
      <div className="text-content">{textContent}</div>
    </div>
  )
}

export default App;
