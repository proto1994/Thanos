import { isFunction } from '../util/isFunction';
import { isSubscription } from './subscription';
import { noop } from '../util/noop';
import { config } from './config';

import { reportUnhandledError } from './reportUnhandledError';

export class Subscriber {
  static create(next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  }

  isStopped = false;

  destination = null;

  constructor(destination) {
    super()
    if (destination) {
      this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(this);
      }
    } else {
      this.destination = EMPTY_OBSERVER;
    }
  }


}




export class SafeSubscriber extends Subscriber {
  constructor(observerOrNext, error, complete) {
    super();
    let next;
    if (isFunction(observerOrNext)) {
      next = observerOrNext;
    } else if (observerOrNext) {
      ({ next, error, complete } = observerOrNext);
      let context;
      if (this && config.useDeprecatedSynchronousErrorHandling) {
        context = Object.create(observerOrNext);
        context.unsubscribe = () => this.unsubscribe();
      } else {
        context = observerOrNext;
      }

      next = next && next.bind(context);
      error = error && error.bind(context);
      complete = complete && complete(context);
    } 

    this.destination = {
      next: next ? maybeWrapForDeprecatedSyncErrorHandling(next, this) : noop,
      error: maybeWrapForDeprecatedSyncErrorHandling(error ? error : defaultErrorHandler, this),
      complete: complete ? maybeWrapForDeprecatedSyncErrorHandling(complete, this) : noop
    }

  }
}

function maybeWrapForDeprecatedSyncErrorHandling(handler, instance) {
  return config.useDeprecatedSynchronousErrorHandling 
}


function defaultErrorHandler(err) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    throw err;
  }

  reportUnhandledError(err);
}

export const EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop,
}