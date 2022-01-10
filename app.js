import * as React from './react'
import { render } from './react-dom'


function Child2(props) {
  return (
    <span>
      {props.text}
      <h2>{props.children}</h2>
    </span>
  )
}

function App() {
  return (
    <div onClick={() => {
      console.log('app click');
    }}>
      <Child2 text='hello world'>
        proto
      </Child2>
    </div>
  )
}

render(<App />, document.getElementById('app'))