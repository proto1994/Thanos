import { isFunction } from '../util/isFunction';
import { config } from './config';
import { SafeSubscriber } from './subscriber';
import { Subscription, isSubscription } from './subscription';
export class Observable {

  source = undefined;
  operator = undefined;

  constructor(subscribe) {
    if (subscribe) this._subscribe = subscribe;
  }

  static create(subscribe) {
    return new Observable(subscribe);
  }

  subscribe(observerOrNext, error, complete) {
    const subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
    const { source, operator } = this;
    subscriber.add(
      operator 
      ? operator.call(subscriber, source)
      : source || config.useDeprecatedSynchronousErrorHandling
      ? this._subscribe(subscriber)
      : this._trySubscribe(subscriber)
    )
    if (config.useDeprecatedSynchronousErrorHandling) {
      let dest = subscriber;
      while(dest) {
        if (dest.__syncError) {
          throw dest.__syncError;
        } 
        dest = dest.destination;
      }
    }
    return subscriber;
  }

  _trySubscribe(sink) {
    try {
      return this._subscribe(sink);
    } catch(err) {
      sink.error(err);
    }
  }

 

}

function isObserver(value) {
  return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete)
}

function isSubscriber(value) {
  return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value))
}