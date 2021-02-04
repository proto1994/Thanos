import { useReducer, useRef } from "react";
import ReactReduxContext from "./Context";
import { Subscription } from "./Subscription";

const EMPTY_ARRAY = []
const NO_SUBSCRIPTION_ARRAY = [null, null]

const initStateUpdates = () => [null, 0]

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
      WrappedComponent.dispalyName || WrappedComponent.name || 'Component';
    
    const displayName = getDisplayName(wrappedComponentName);

    const selectorFactoryOptions = {
      ...connectOptions,
      getDisplayName,
      methodName,
      renderCountProps,
      shouldHandleStateChanges,
      storeKey,
      displayName,
      wrappedComponentName,
      WrappedComponent,
    }

    const { pure } = connectOptions

    function createChildSelector(store) {
      return selectorFactory(store.dispatch, selectorFactoryOptions);
    }

    const usePureOnlyMemo = pure ? useMemo : (callback) => callback()

    function ConnectFunction(props) {
      const [
        propsContext,
        ReactReduxForwardRef,
        wrapperProps,
      ] = useMemo(() => {
        const { ReactReduxForwardRef, ...wrapperProps } = props;
        return [props.context, ReactReduxForwardRef, wrapperProps];
      }, [props])

      const ContextToUse = useMemo(() => {
        return propsContext && 
          propsContext.Consumer && 
          isContextConsumer(<propsContext.Consumer />)
          ? propsContext
          : Context
      }, [propsContext, Context])

      const contextValue = useContext(ContextToUse);

      const didStoreComeFromProps = 
        Boolean(props.store) &&
        Boolean(props.store.getState) &&
        Boolean(props.store.dispatch);

      const didStoreComeFromContext = 
        Boolean(contextValue) && Boolean(context.store);

      const store = didStoreComeFromProps ? props.store : contextValue.store;

      const childPropsSelector = useMemo(() => {
        return createChildSelector;
      }, [store])
      
      const [subscription, notifyNestedSubs] = useMemo(() => {
        if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY

        const subscription = new Subscription(
          store, 
          disStoreComeFromProps ? null : contextValue.subscription
        )
        const notifyNestedSubs = subscription.notifyNestedSubs.bind(subscription)
        return [subscription, notifyNestedSubs]
      }, [store, didStoreComeFromProps, contextValue])

      const overriddenContextValue = useMemo(() => {
        if (didStoreComeFromProps) {
          return contextValue
        }

        return {
          ...contextValue,
          subscription,
        }
      }, [didStoreComeFromProps, contextValue, subscription])

      const [
        [previousStateUpdateResult],
        forceComponentUpdateDispatch,
      ] = useReducer(storeStateUpdatesReducer, EMPTY_ARRAY, initStateUpdates)

      if (previousStateUpdateResult && previousStateUpdateResult.error) {
        throw previousStateUpdateResult.error;
      }

      const lastChildProps = useRef()
      const lastWrapperProps = useRef()
      const childPropsFromStoreUpdate = useRef()
      const renderIsScheduled = useRef(false)

      const actualChildProps = usePureOnlyMemo(() => {
        if (
          childPropsFromStoreUpdate.current &&
          wrapperProps === lastWrapperProps.current
        ) {
          return childPropsFromStoreUpdate.current;
        }

        return childPropsSelector(store.getState(), wrapperProps)
      }, [store, previousStateUpdateResult, wrapperProps])

    }

  }

}