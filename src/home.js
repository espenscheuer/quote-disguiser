import React, {useState, useEffect} from 'react';
import './App.css';
import { Link} from 'react-router-dom'

function Home() {
    const [text, setText] = useState('');
    const [original, setOriginal] = useState('');
    const [quote, setQuote] = useState(false)
    const [found, setFound] = useState('');
    const [textContent, setTextContent] = useState('');
    const [btnText, setBtnText] = useState('Set Quote')

	const onegram = require('./1_gram_json.json');

  const changeBtn = () => {
    setText(original)
		if(!quote) {
      setBtnText("Edit Quote")
    } else {
      setBtnText("Set Quote")
    }
    setQuote(!quote)
	};

	const updateText = e => {
		setText(e.target.value);
		if ('' === e.target.value) {
			setFound('');
		}
	};

	const apiRequest = async () => {
		setFound('');
		const response = await fetch('/api/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"original" : '"' + original + '"',
				"text" : '"' + text + '"',
			}),
        });
		response.text().then(value => {
            console.log(value)
            console.log(typeof(value))
			if (value !== "Nothing Found you're good!") {
				setFound(
					<>
						<blockquote>{value}</blockquote>
						<iframe
							src={`https://google.com/search?igu=1&q="${escape(text)}"`}
							title="Search results"
						/>
					</>
				);
			} else {
				setFound(
					<>
						<blockquote>{value}</blockquote>
						<iframe
							src={`https://google.com/search?igu=1&q="${escape(text)}"`}
							title="Search results"
						/>
					</>
				);
			}
		});
  };
  
  useEffect(() => {
    let generatedHTML = [];
    let words = text.split(' ');
    words.forEach((word, index) => {
      const id = `word-${index}`;
      let styles = {};
      let included = original.includes(word)
      let test = word.toLowerCase();
      test = test.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")
      if (test in onegram && included) {
        if(onegram[test] >= 10000) {
          styles['color'] = 'gray';  
        } else if(onegram[test] >= 5000) {
          styles['color'] = '	#ff9a00';
        } else if(onegram[test] >= 1000) {
          styles['color'] = '#ff5a00'
        } else {
          styles['color'] = '#ff0000'
        }
      }
      generatedHTML.push(<><span key={id} style={styles}>{word}</span>{' '}</>);
    });
    setTextContent(generatedHTML);
  }, [text]);
    return (
        <div>
        <p>
          Enter the quote you would like to obfuscate.
        </p>
        <div className="input"> 
        {!quote && <textarea className="text-input" value={original} 
        onChange={(e) => {setOriginal(e.target.value); setText(e.target.value)}}
        onKeyPress={e => {
          if(e.key==='Enter'){
            changeBtn()
          }
        }} />}
        {quote && <blockquote>{original}</blockquote>}
          <button type = "primary" pressed = {btnText}
            onClick={changeBtn}>
            {btnText}
          </button>
        </div>
      {quote && (
          <div>
            <p>Now edit the quote, prioritizing the most unique words (in red) and check to see if the original quote appears in a google search.</p>
            <textarea className="text-input" value={text} onChange={updateText} 
            onKeyPress={e => {
              if(e.key==='Enter'){
                apiRequest()
              }
            }}/>
          </div>
        )}
        {quote && (
          <div>
            <h3>Highlighted Quote</h3>
            <p>Text highlighting is based on word uniqueness, something you can read more about in the info page.</p>
            <blockquote>{textContent}</blockquote>
            <button className="button" onClick={apiRequest}>
            Check Quote
            </button>
          </div>
        )}
        {found && quote && (
          <div className="found">
            <h3>Google Result</h3>
            {found}
          </div>
        )}
        <br></br>
        <Link className = 'header-link' to ='/about'>read more about the tool </Link>
        </div>
    )
}

export default Home