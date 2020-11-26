export default function logger({getState}) {
  return (next) => (action) => {
    console.log('logger before: ', getState())
    next(action)
    console.log('logger after: ', getState())
  }
}