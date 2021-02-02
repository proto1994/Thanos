function defaultNoopBatch(callback) {
  callback();
}

let batch = defaultNoopBatch;

export const setBatch = newBatch => (batch = newBatch);

export const getBatch = () => batch;