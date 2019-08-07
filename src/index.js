const curry = (f, arr = []) => (...args) =>
  (a => (a.length === f.length ? f(...a) : curry(f, a)))([...arr, ...args]);

const handleErrors = curry(
  (
    { errorMatches = (key, error) => error.message.includes(key), ...handlers },
    error
  ) => {
    const entries = Object.entries(handlers);
    if (entries.length < 1) throw error;

    const isHandled = Object.entries(handlers).reduce(
      (isHandled, [key, handler]) => {
        if (isHandled) return isHandled;
        if (errorMatches(key, error)) {
          handler(error);
          return true;
        }
      },
      false
    );

    if (!isHandled) throw error;
  }
);

module.exports = handleErrors;
