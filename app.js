import React from 'react'
import { render } from 'react-dom'
import Provider from './react-redux/Provider';
import { 
  createStore,
  combineReducers,
  compose,
  applyMiddleware,
 } from './redux'
import logger from './redux-logger'
const initState = {
  count: 0
}
const ADD = 'ADD';
const reducer = (state = initState, action) => {
  switch(action.type) {
    case ADD:
      return {
        ...state,
        count: action.count
      }
    default:
      return state
  }
}
const rootReducer = combineReducers({
  app: reducer
})
const store = createStore(rootReducer, initState, applyMiddleware(logger))
store.subscribe(() => {
  console.log(store.getState())
})


function Child() {
  return (
    <div onClick={() => {
      store.dispatch({
        type: ADD,
        count: 4
      })
    }}>
      hello, child
    </div>
  )
}

function App() {
  return (
    <Provider
      store={store}
    >
      <Child />
    </Provider>
  )
}


render(<App />, document.getElementById('app'))