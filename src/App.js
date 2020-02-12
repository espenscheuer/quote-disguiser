import React, {useState} from 'react';
import ContentEditable from "react-contenteditable";
import './App.css';


function App() {
  const [text, setText] = useState("")

  function handleChange(evt) {
    var s = String(evt.target.value)
    var a = s.split('><')
    var a1 = a.map(str=>{
      if(str.includes('>')) {
        str = str.slice(str.indexOf('>') + 1, str.indexOf('</'))
      }
      var a2 = str.split(" ").map((str2, key) =>{
        if(str2.includes("c")) {
          var color = "red"
        } else {
          color = "black"
        }
        if(key > 0) {
          str2 = " " + str2 
        }
        if(str2 !== " " && str2) {
          return `<span style="color:${color};">${str2}</span>`
        } else {
          return ''
        }
      })
      return a2.join('')
    })
    console.log((a1).join(''))
    s = a1.join('')

    console.log("final = " + s)
    setText(s)
  }

  return(
  <ContentEditable className = "input"
        html={text} // innerHTML of the editable div
        disabled={false} // use true to disable edition
        onChange={handleChange} // handle innerHTML change
      />
  )
}

export default App;
