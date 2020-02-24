import React, {useState, useEffect} from 'react';
import './App.css';
import Helmet from 'react-helmet';
import { Button } from 'antd';


function App() {
  const [text, setText] = useState('');
  const [original, setOriginal] = useState('');
  const [quote, setQuote] = useState(false)
	const [found, setFound] = useState('');
	const [textContent, setTextContent] = useState('');
  const [btnText, setBtnText] = useState('Set Quote')

	const onegram = require('./1_gram_json.json');

	const updateText = e => {
		setText(e.target.value);
		if ('' === e.target.value) {
			setOriginal('');
			setFound('');
		}
	};

	const apiRequest = async () => {
		setOriginal(text);
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
			if (value !== 'No results found') {
				setFound(
					<>
						<blockquote>{(value + " on the first page")}</blockquote>
						<iframe
							src={`https://google.com/search?igu=1&q="${escape(text)}"`}
							title="Search results"
						/>
					</>
				);
			} else {
				setFound(
					<>
						<blockquote>{("Quote Found: " + value)}</blockquote>
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
      let test = word.toLowerCase();
      test = test.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")
      if (test in onegram) {
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
		<div className="content">
			<Helmet>
				<html lang="en" />
				<title>Differential Privacy Checker</title>
				<meta name="robots" content="noindex, nofollow" />
			</Helmet>
      <h1>
        Differential Privacy
      </h1>
      <p>
        Enter the quote you would like to obfuscate
      </p>
      
			<div className="input">
      {!quote && <textarea className="text-input" value={original} onChange={(e) => {setOriginal(e.target.value); setText(e.target.value)}} />}
      {quote && <blockquote>{original}</blockquote>}
        <button type = "primary"
          onClick={(e) => {
            setText(original) 
            if(!quote) {
              setBtnText("Edit Quote")
              
              e.target.style.backgroundColor = "lightGray"
            } else {
              setBtnText("Set Quote")
              e.target.style.backgroundColor = '#1467ff'
            }
            
            setQuote(!quote)}}>
					{btnText}
				</button>
			</div>
      {text && quote && (
				<div>
					<p>Now edit the quote, prioritizing the most unique words (in red) and check to see if the original quote appears in a google search</p>
					<textarea className="text-input" value={text} onChange={updateText} />
				</div>
			)}
			{(textContent.length > 0 && text && quote) && (
				<div>
					<h3>Highlighted Quote</h3>
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
		</div>
	);
}

export default App;
