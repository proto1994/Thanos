export const timeoutProvider = {
  setTimeout(...args) {
    const { delegate } = timeoutProvider;
    return (delegate && delegate.setTimeout || setTimeout)(args);
  },
  clearTimeout(handle) {
    const { delegate } = timeoutProvider;
    return (delegate && delegate.clearTimeout || clearTimeout)(handle);
  },
  delegate: undefined
}