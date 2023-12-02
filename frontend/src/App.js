import React from 'react';
import axios from 'axios';
import './App.css';
import ProgressionPathTree from './components/ProgressionPathTree';

function handleSubmit(event) {
  const text = document.querySelector('#char-input').value

  axios.get(`/uppercase_text?text=${text}`).then(({data}) => {
      document.querySelector('#uppercase-text').textContent = `${data.uppercase_text}`
    })
    .catch(err => console.log(err))
}

function App() {
  // Placeholder data for the tree
  const treeData = {
    name: "Root",
    children: [
      { name: "Child 1" },
      { name: "Child 2", children: [{ name: "Grandchild" }] }
    ]
  };

  return (
    <div className="App">
      {/* Existing content */}
      {/* <div>
        <label htmlFor='char-input'>Make this text uppercase: </label>
        <input id='char-input' type='text' />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div>
        <h3 id='uppercase-text'></h3>
      </div> */}
      <div>Hello World!</div>

      {/* ProgressionPathTree component */}
      <div>
        <ProgressionPathTree data={treeData} />
      </div>
    </div>
  );
}

export default App;
