import React, {useState} from 'react';
import ContentEditable from "react-contenteditable";
import './App.css';


function App() {
  const [text, setText] = useState("<p>type here </p>")

  function handleChange(evt) {
    var s = String(evt.target.value)
    var a = s.split(" ")
    var a1 = a.map(str=>{
      if(str.includes("c")) {
        var color = "red"
      } else {
        color = "black"
      }
      return `<span style="color:${color};">${str}</span>`
    })
    console.log(String(a1))

    setText(String(a1));
  }

  return(
  <ContentEditable
        html={text} // innerHTML of the editable div
        disabled={false} // use true to disable edition
        onChange={handleChange} // handle innerHTML change
      />
  )
}

export default App;
