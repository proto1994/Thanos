import ReactReduxContext from "./Context";


export default function connectAdvanced(
  selectorFactory,
  {
    getDisplayName = (name) => `ConnectAdvanced(${name})`,
    methodName = 'connectAdvanced',
    renderCountProps = undefined,
    shouldHandleStateChanges = true,
    storeKey = 'store',
    withRef = false,
    forwardRef = false,
    context = ReactReduxContext,
    ...connectOptions
  } = {}
) {

  const Context = context

  return function wrapWithConnect(WrappedComponent) {
    const wrappedComponentName = 
      WrappedComponent.dispalyName;
  }

}