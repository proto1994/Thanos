import { isFunction } from '../util/isFunction';

export class Subscription {

}

export function isSubscription(value) {
  return value instanceof Subscription || (value && 'closed' in value && isFunction(value.remove) && 
    isFunction(value.add) && isFunction(value.unsubscribe)
  );
}