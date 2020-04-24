import React from 'react'
import ReactGA from 'react-ga';
import './App.css';
import {Link} from 'react-router-dom'
import logo from './logo.png'; // Tell webpack this JS file uses this image


function About(props) {
    ReactGA.initialize('UA-162759087-1');
    ReactGA.pageview('/about');
    return (
        <div>
            <div  style = {{width:"85vw", maxWidth:900}}> 
                <p>
                    Publishing quotations of internet users in research studies raises difficult questions around privacy. Multiple studies have shown that many people who write on the internet do not want their words to be reprinted in academic publications, and that most request that researchers ask their consent beforehand [1,2]. Asking for consent can often be impossible, however, given the difficulty of establishing contact with often anonymous or pseudonymous users. While some claim that people should understand that text they publish to the internet is public, they often don’t. People rarely read the terms of service of the websites they publish on [3], and don’t always intuitively understand basic privacy features of these sites4. Many writers on the internet are children, who may not be able to make informed decisions about the privacy implications of publishing online.
                </p>
                <p>
                    Internet researchers have now struggled with this problem for decades. One solution is to “disguise” verbatim quotations by altering the words contained in the original text5. Depending on the level of disguise, this can protect quotations from being recognized by a member of the author’s online community, or from being retrieved by a search engine by a curious reader. The problem of search engines has been particularly hard. One study showed that the authors of Twitter quotations in online health studies could be found with a Google search in 84% of articles sampled (68 out of 81) [6].
                </p>
                <p>
                    This problem has only gotten harder with modern search engines, which can easily identify the sources of partial quotations, or even of modified quotations with most of the worsts unchanged. That’s where Quote Disguiser comes in. Quote Disguiser lets users edit text they find online, understand which parts of that text are likely to be identifiable, and iteratively check Google’s search results on modified quotations for matches. This way, researchers can understand if their level of disguise is effective at preserving the privacy of their users.
                </p>
                <p>
                    Quote Disguiser was created by Espen Scheuer and Andrew Beers, working with Cecilia Aragon in the Human Centered Design and Engineering Department at the University of Washington.
                </p>
                <div style ={{display:"flex"}}>
                    <img src={logo} style = {{width: "30vw", minWidth: 300}} alt="Human Centered Design and Engineering at the University of Washington" />
                </div>
                <p>
                    1.	Fiesler, C. & Proferes, N. “Participant” Perceptions of Twitter Research Ethics. Soc. Media Soc. 4, 2056305118763366 (2018).
                </p>
                <p>
                    2.	Hudson, J. M. & Bruckman, A. “Go Away”: Participant Objections to Being Studied and the Ethics of Chatroom Research. Inf. Soc. 20, 127–139 (2004). 
                </p>
                <p>
                    3.	Fiesler, C., Lampe, C. & Bruckman, A. S. Reality and Perception of Copyright Terms of Service for Online Content Creation. in Proceedings of the 19th ACM Conference on Computer-Supported Cooperative Work & Social Computing 1450–1461 (Association for Computing Machinery, 2016). doi:10.1145/2818048.2819931.
                </p>
                <p>
                    4.	Proferes, N. Information Flow Solipsism in an Exploratory Study of Beliefs About Twitter. Soc. Media Soc. 3, 2056305117698493 (2017).    
                </p>
                <p>
                    5.	Bruckman, A. Studying the amateur artist: A perspective on disguising data collected in human subjects research on the Internet. Ethics Inf. Technol. 4, 217–231 (2002).    
                </p>
                <p>
                    6.	Ayers, J. W., Caputi, T. L., Nebeker, C. & Dredze, M. Don’t quote me: reverse identification of research participants in social media studies. Npj Digit. Med. 1, 1–2 (2018).    
                </p>
                <p>
                    
                </p>
            </div>
            <div>
                <Link className = 'header-link' to ='/'> back to the tool </Link>
            </div>
        </div>
    )
}

export default About