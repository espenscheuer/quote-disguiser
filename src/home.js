import React, {useState, useEffect} from 'react';
import ReactGA from 'react-ga';
import './App.css';
import {Link} from 'react-router-dom'
import uniqid from 'uniqid';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';

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
  const [offset, setOffset] = useState({});

  const onegram = require('./1_gram_json.json');
  const twogram = require('./2_gram_json.json');

  useEffect(() => {
    // Update the document title using the browser API
    document.addEventListener('scroll', (e) => {
      setLabel('');
    })
  });

  const changeBtn = () => {
    let val = original.length
    setText(original)
		if(!quote) {
      setBtnText("Edit Quote")
      apiRequest()
      ReactGA.event({
        category: "Set Original",
        action: "User Set Original Text",
        value : val
      });
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
    let diff = findDiff(text, original)
    setFound('');
    ReactGA.event({
      category: "Check Text",
      action: "User Checked Text",
      value: diff
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

  const createLabel = (word, classNames, el) => {
    if(classNames.includes(textClasses.gray)){
      setLabel(" common ")
    } else if(classNames.includes(textClasses.orange)){
      setLabel("uncommon")
    } else if(classNames.includes(textClasses.darkOrange)){
      setLabel("rare")
    } else if(classNames.includes(textClasses.red)){
      setLabel("very rare")
    } else { 
      setLabel("not in original")
    }
    setOffset({"top" : el.getBoundingClientRect().top,"left": el.getBoundingClientRect().left, "width" : el.getBoundingClientRect().width}) 
  };

  function findDiff(s, t) {
    var d = []; //2d matrix

    // Step 1
    var n = s.length;
    var m = t.length;

    if (n === 0) return m;
    if (m === 0) return n;

    //Create an array of arrays in javascript (a descending loop is quicker)
    for (var i = n; i >= 0; i--) d[i] = [];

    // Step 2
    for (var i = n; i >= 0; i--) d[i][0] = i;
    for (var j = m; j >= 0; j--) d[0][j] = j;

    // Step 3
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);

        // Step 4
        for (var j = 1; j <= m; j++) {

            //Check the jagged ld total so far
            if (i === j && d[i][j] > 4) return n;

            var t_j = t.charAt(j - 1);
            var cost = (s_i === t_j) ? 0 : 1; // Step 5

            //Calculate the minimum
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;

            if (b < mi) mi = b;
            if (c < mi) mi = c;

            d[i][j] = mi; // Step 6

            //Damerau transposition
            if (i > 1 && j > 1 && s_i === t.charAt(j - 2) && s.charAt(i - 2) === t_j) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }
    // Step 7
    return d[n][m];
}
  
  useEffect(() => {
    let generatedHTML = [];
    let updatingIndexes = [];
    let words = text.trim().split(' ');
    words.forEach((word, index) => {
      const id = uniqid();

      let textColorClass = '';
      let textUnderlineClass = '';

      let included = original.includes(word)
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

          if(index % 2 === 0) {
            textUnderlineClass = `${textUnderlineClass}1`
          }

          updatingIndexes.push({
            index: indexToUpdate,
            textUnderlineClass,
          });

        }
      }

      const classNames = `${textColorClass} ${textUnderlineClass}`;
      generatedHTML.push(<span key={id} onMouseEnter={(e)=> {createLabel(word, classNames, e.target)}} onMouseLeave={() => {setLabel('')}} className={classNames}>{word} </span>);
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
            <br></br>
            <p>Now substitute synonyms for a few unique words (in red) and see if the quote still appears in a google search. Text highlighting is based on word uniqueness from common (gray) to very rare (red).</p>
            <br></br>
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
            {label && <div className = "hover" style={{"top" : offset.top - 35,"left": (offset.left + offset.width/2 - (label.length * 3.3 + 10))}}>{label}</div>}
            
            {found && quote && (
              <div>
                {google && 
                <div className = "msg">
                  <ClearIcon style={{height : "30px", width: "30px", marginRight: "10px", color: "#FA4659" }} />
                  <p> Keep Editing! The original quote appeared on the first page of a google search</p>
                </div>}
                {!google && 
                <div className = "msg">
                  <CheckIcon style={{height : "30px", width: "30px", marginRight: "10px", color: "#2EB872" }} />
                  <p> You're good! The original quote did not appear on the first page of a google search</p> 
                  </div>}
              </div>
            )}
            <blockquote>{textContent}</blockquote>
            <button className="button" onClick={apiRequest}>
            Check Quote
            </button>
          </div>
        )}
        {found && quote && (
          <div className="found">
            <br></br>
            {found}
          </div>
        )}
        <br></br>
        <Link className = 'header-link' to ='/about'>read more about the tool </Link>
        </div>
    )
}

export default Home