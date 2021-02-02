import React, { useMemo, useEffect } from 'react';
import { Subscription } from './Subscription';

import { ReactReduxContext } from './Context';

export default function Provider({ store, context, children, }) {
	const contextValue = useMemo(() => {
		const subscription = new Subscription(store);

		console.log(subscription, 'contextValue')
		subscription.onStateChange = subscription.notifyNestedSubs;
		return {
			store, 
			subscription,
		}
	}, [store])

	const previousState = useMemo(() => store.getState(), [store]);

	useEffect(() => {
		const { subscription } = contextValue;
		subscription.trySubscribe();
		console.log(subscription, 'useEffect')
		if (previousState != store.getState()) {
			subscription.notifyNestedSubs();
		} 

		return () => {
			subscription.tryUnsubscribe();
			subscription.onStateChange = null;
		}

	}, [contextValue, previousState])

	const Context = context || ReactReduxContext;

	return <Context.Provider value={contextValue}>{children}</Context.Provider>

}