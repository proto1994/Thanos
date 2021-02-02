import ConnectAdvanced from './ConnectAdvanced';
import shallowEqual from './shallowEqual';
import defaultMapStateToPropsFactories from './mapStateToProps';

function match(arg, factories, name) {
  for (let i = factories.length - 1; i >= 0; i--) {
    const result = factories[i](arg);
    if (result) return result;
  }
  return (dispatch, options) => {
    throw new Error(
      `Invalid value of type ${typeof arg} for ${name} argument when connecting component ${
        options.wrappedComponentName
      }.`
    )
  }
}

function strictEqual(a, b) {
  return a === b;
}

export function createConnect({
  connectHOC = ConnectAdvanced,
  mapStateToPropsFactories = defaultMapStateToPropsFactories,
  mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
  mergePropsFactories = defaultMergePropsFactories,
  selectorFactory = defaultSelectorFactory
} = {}) {
  console.log(mapStateToPropsFactories)

  /**
   * connect((state) => {
   *    return state.xxx;
   * })
   */
  return function connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    {
      pure = true,
      areStatesEqual = strictEqual,
      areOwnPropsEqual = shallowEqual,
      areStatePropsEqual = shallowEqual,
      areMergedPropsEqual = shallowEqual,
      ...extraOptions
    }
  ) {

    const initMapStateToProps = match(
      mapStateToProps, 
      mapStateToPropsFactories, 
      'mapStateToProps'
    );
    
    return connectHOC(selectorFactory, {
      methodName: 'connect',
      getDisplayName: name => `Connect(${name})`,
      shouldeHandleStateChanges: Boolean(mapStateToProps),

      initMapStateToProps,
      pure,
      areStatesEqual,
      areOwnPropsEqual,
      areStatePropsEqual,
      areMergedPropsEqual,
      ...extraOptions,
    })
  }
}

export default createConnect();


