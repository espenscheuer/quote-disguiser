import React from 'react'
import './App.css';
import {Link} from 'react-router-dom'


function About(props) {
    ReactGA.initialize('UA-162759087-1');
    ReactGA.pageview('/about');
    return (
        <div>
            <div>
                about text
            </div>
            <div>
                <Link className = 'header-link' to ='/'> back to the tool </Link>
            </div>
        </div>
    )
}

export default About