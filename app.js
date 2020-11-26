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


store.dispatch({
  type: ADD,
  count: 3
})