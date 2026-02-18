/* eslint-disable no-restricted-globals */

self.onmessage = () => {
  self.postMessage({
    type: "error",
    error: "Local challenge worker is disabled. Use /api/challenge/run sandbox endpoint.",
  });
};
