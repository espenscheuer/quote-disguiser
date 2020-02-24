import React, {useState, useEffect} from 'react';
import './App.css';
import Helmet from 'react-helmet';

function App() {
	const [text, setText] = useState('');
	const [original, setOriginal] = useState('');
	const [found, setFound] = useState('');
	const [textContent, setTextContent] = useState('');
	const [version, setVersion] = useState(0);
	const [styles, setStyles] = useState({});

	const onegram = require('./1_gram_json.json');
	const twogram = require('./2_gram_json.json');

	const updateText = e => {
		setText(e.target.value);
		if ('' === e.target.value) {
			setStyles({});
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

		const words = text.split(' ');

		words.forEach((word, index) => {
			const id = `word-${version}-${index}`;

			const wordStyles = {};
			let includePrevious = false;

			if (0 !== index) {
				const two = (words[index - 1] + '_' + word).toLowerCase();
				if (two in twogram) {
					let newTextDecorationColor = 'red';
					if (twogram[two] > 5000) {
						newTextDecorationColor = 'gray';
					} else if (twogram[two] > 1000) {
						newTextDecorationColor = 'yellow';
					} else if (twogram[two] > 500) {
						newTextDecorationColor = 'orange';
					}
					wordStyles['textDecoration'] = 'underline';
					wordStyles['textDecorationColor'] = newTextDecorationColor;
					includePrevious = true;
				}
			}

			const test = word.toLowerCase();
			if (test in onegram) {
				let newColor = 'red';
				if (onegram[test] >= 10000) {
					newColor = 'gray';
				} else if (onegram[test] >= 5000) {
					newColor = 'yellow';
				} else if (onegram[test] >= 1000) {
					newColor = 'orange';
				}
				wordStyles['color'] = newColor;
			}

			generatedHTML.push(
				<span key={id} style={styles[index]}>
					{word}{' '}
				</span>
			);

			if (includePrevious) {
				setStyles({
					...styles,
					[index]: {
						// ...styles[index],
						...wordStyles,
					},
					[index - 1]: {
						// ...styles[index],
						...wordStyles,
					},
				});
			} else {
				setStyles({
					...styles,
					[index]: {
						// ...styles[index],
						...wordStyles,
					},
				});
			}
		});

		setVersion(version + 1);
		setTextContent(generatedHTML);
	}, [text]);

	// useEffect(() => {
	// 	textUpdates.forEach(update => {
	// 		textContent[update.index].props.style = {
	// 			...textContent[update.index].props.style,
	// 			...update.styles,
	// 		};
	// 	});
	// }, [textUpdates]);

	return (
		<div className="content">
			<Helmet>
				<html lang="en" />
				<title>Differential Privacy Checker</title>
				<meta name="robots" content="noindex, nofollow" />
			</Helmet>
			<div className="input">
				<textarea className="text-input" value={text} onChange={updateText} />
				{/* <button className="button" onClick={() => setOriginal(text)}>
					Set Quote
				</button> */}
				<button className="button" onClick={apiRequest}>
					Check Quote
				</button>
			</div>
			{textContent.length > 0 && (
				<div>
					<h2>Highlighted Quote</h2>
					<blockquote>{textContent}</blockquote>
				</div>
			)}
			{original && (
				<div>
					<h2>Original Quote</h2>
					<blockquote>{original}</blockquote>
				</div>
			)}
			{found && (
				<div className="found">
					<h2>Google Result</h2>
					{found}
				</div>
			)}
		</div>
	);
}

export default App;
