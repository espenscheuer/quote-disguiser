import React from 'react'
import './App.css';
import {Link} from 'react-router-dom'


function About(props) {
    
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