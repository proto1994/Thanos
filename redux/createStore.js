export default function createStore(reducer, preloadedState, enhancer) {
  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []
  let nextListeners = currentListeners
  let isDispatching = false

  if (typeof enhancer === 'function') {
    return enhancer(createStore)(reducer, preloadedState)
  }

  function getState() {
    return currentState
  }
  function dispatch(action) {
    isDispatching = true
    currentState = currentReducer(currentState, action)
    isDispatching = false

    const listeners = (currentListeners = nextListeners)
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]() 
    }
    return action
  }
  function subscribe(listener) {
    let isSubscribed = true
    nextListeners.push(listener)
    return function unsubscribe() {
      if (!isSubscribed) return
      isSubscribed = false
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
      currentListeners = null
    }
  }
  dispatch({
    type: 'INIT_THANOS'
  })
  return { subscribe, dispatch, getState }
}