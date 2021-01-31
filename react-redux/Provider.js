import React, { useMemo, useState } from 'react';
import { Subscription } from '../rxjs/Subscription';

import { ReactReduxContext } from './Context';

function Provider({ store, context, children, }) {
	const contextValue = useMemo(() => {
		const subscription = new Subscription(store);
		subscription.onStateChange = subscription.notifyNestedSubs;
		return {
			store, 
			subscription,
		}
	}, [store])
}