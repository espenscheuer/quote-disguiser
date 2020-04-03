import React, {useState, useEffect} from 'react';
import ReactGA from 'react-ga';
import './App.css';
import {Link} from 'react-router-dom'
import uniqid from 'uniqid';

function Home() {
    ReactGA.initialize('UA-162759087-1');
    ReactGA.pageview('/home');
    const [text, setText] = useState('');
    const [original, setOriginal] = useState('');
    const [quote, setQuote] = useState(false)
    const [found, setFound] = useState('');
    const [textContent, setTextContent] = useState('');
    const [btnText, setBtnText] = useState('Set Quote')
    const [google, setGoogle] = useState(false)
    const [version, setVersion] = useState(0);
    const [updates, setUpdates] = useState(null);
    const [label, setLabel] = useState('');

  const onegram = require('./1_gram_json.json');
  const twogram = require('./2_gram_json.json');

  const changeBtn = () => {
    ReactGA.event({
      category: "Set Original",
      action: "User Set Original Text",
    });
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

	const apiRequest = async() => {
    setFound('');
    ReactGA.event({
      category: "Check Text",
      action: "User Checked Text",
      value: Math.abs(original.length - text.length)
    });
		const response = await fetch('/api/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				original,
				text,
			}),
		});
		response.text().then(value => {
			if (value !== 'No results found') {
        setGoogle(true)
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
        setGoogle(false)
				setFound(
					<iframe
						src={`https://google.com/search?igu=1&q="${escape(text)}"`}
						title="Search results"
					/>
				);
			}
		});
  };
  
  const textClasses = {
    gray: 'text-gray',
    orange: 'text-orange',
    darkOrange: 'text-dark-orange',
    red: 'text-red',

    uGray: 'u-gray',
    uOrange: 'u-orange',
    uDarkOrange: 'u-dark-orange',
    uRed: 'u-red',
  };

  const createLabel = (word, classNames) => {
    if(classNames.includes(textClasses.gray)){
      setLabel(word + ": common")
    } else if(classNames.includes(textClasses.orange)){
      setLabel(word + ": uncommon")
    } else if(classNames.includes(textClasses.darkOrange)){
      setLabel(word + ": rare")
    } else if(classNames.includes(textClasses.red)){
      setLabel(word + ": very rare")
    }
  };
  
  
  useEffect(() => {
    ReactGA.event({
      category: "Edit Text",
      action: "User Edited Text",,
      value: 
    });
    let generatedHTML = [];
    let updatingIndexes = [];
    let words = text.split(' ');
    words.forEach((word, index) => {
      const id = uniqid();

      let textColorClass = '';
      let textUnderlineClass = '';

      let included = original.includes(word)
      included = true;
      let test = word.toLowerCase();
      test = test.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")

      if (test in onegram && included) {

        if(onegram[test] >= 10000) {
          textColorClass = textClasses.gray;
        } else if(onegram[test] >= 5000) {
          textColorClass = textClasses.orange;
        } else if(onegram[test] >= 1000) {
          textColorClass = textClasses.darkOrange;
        } else {
          textColorClass = textClasses.red;
        }
      }

      if (index !== 0) {
        const two = (words[index - 1].replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ") + '_' + test).toLowerCase();
        if (two in twogram) {

          const indexToUpdate = index - 1;
          
          if (twogram[two] > 5000) {
            textUnderlineClass = textClasses.uGray;
          } else if (twogram[two] > 1000) {
            textUnderlineClass = textClasses.uOrange;
          } else if (twogram[two] > 500) {
            textUnderlineClass = textClasses.uDarkOrange;
          } else {
            textUnderlineClass = textClasses.uRed;
          }

          updatingIndexes.push({
            index: indexToUpdate,
            textUnderlineClass,
          });

        }
      }

      const classNames = `${textColorClass} ${textUnderlineClass}`;
      generatedHTML.push(<span key={id} onMouseEnter={() => {createLabel(word, classNames)}} className={classNames}>{word} </span>);
    });
    setVersion(version+1);
    setTextContent(generatedHTML);
    setUpdates(updatingIndexes.length > 0 ? updatingIndexes : null);
  }, [text]);

  useEffect(() => {

    if (updates && updates.length > 0) {

      let spans = React.Children.toArray(textContent);

      updates.forEach(updateIndex => {
        const newSpan = React.cloneElement(spans[updateIndex.index], { className: `${spans[updateIndex.index].props.className} ${updateIndex.textUnderlineClass}`});
        spans[updateIndex.index] = newSpan;
      });

      setTextContent(spans);
    }

    setUpdates(null);

  }, [textContent, updates]);

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
            <p>Text highlighting is based on word uniqueness, something you can read more about in the info page.</p>
            {label && <p>{label}</p>}
            <blockquote>{textContent}</blockquote>
            <button className="button" onClick={apiRequest}>
            Check Quote
            </button>
          </div>
        )}
        {found && quote && (
          <div className="found">
            <h3>Google Result</h3>
            {google && <p>The original quote appeared on the first page of a google search</p>}
            {!google && <p>The original quote did not appear on the first page of a google search</p> }
            {found}
          </div>
        )}
        <br></br>
        <Link className = 'header-link' to ='/about'>read more about the tool </Link>
        </div>
    )
}

export default Home