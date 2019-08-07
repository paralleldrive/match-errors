const { describe, Try } = require('riteway');

const handleErrors = require('./index.js');

describe('Tests', async assert => {
  assert({
    given: 'no arguments',
    should: 'run',
    actual: true,
    expected: true
  });
});

// handleErrors = (handlers, error) => Void
// auto-curried version:
// handleErrors = handlers => e => Void

describe('Match Errors', async assert => {
  // const messages = [];
  // const log = message => messages.push(message);
  const error = new Error('Something is wrong.');
  const result = Try(handleErrors, {}, error);

  assert({
    given: 'no error handlers',
    should: 'rethrow the error',
    actual: result.message,
    expected: error.message
  });

  {
    const messages = [];
    const log = message => messages.push(message);
    const error = new Error('SomethingWrong: Something is wrong.');

    Try(
      handleErrors,
      {
        SomethingWrong: log
      },
      error
    );

    assert({
      given: 'a matching error handler',
      should: 'run the matching error handler',
      actual: messages.length,
      expected: 1
    });
  }

  {
    const messages = [];
    const log = message => messages.push(message);
    const error = new Error('SomethingWrong: Something is wrong.');
    const WrongHandler = () => {
      throw new Error('Wrong handler called!');
    };

    Try(
      handleErrors,
      {
        WrongHandler,
        SomethingWrong: log
      },
      error
    );

    assert({
      given: 'multiple handlers',
      should: 'call the matching handler and not call other handlers',
      actual: messages.length,
      expected: 1
    });
  }

  {
    const messages = [];
    const log = message => messages.push(message);
    const error = new Error('SomethingWrong: Something is wrong.');
    const WrongHandler = () => {
      throw new Error('Wrong handler called!');
    };

    const resultError = Try(
      handleErrors,
      {
        SomethingWrong: log,
        WrongHandler
      },
      error
    );

    assert({
      given: 'multiple handlers with matching handler first',
      should: 'call the matching handler and not throw',
      actual: resultError,
      expected: undefined
    });
  }

  {
    const WrongHandler = () => {
      throw new Error('Wrong handler called!');
    };
    const WrongHandler2 = () => {
      throw new Error('Wrong handler 2 called!');
    };
    const error = new Error('SomethingWrong: Something is wrong.');

    const actualError = Try(
      handleErrors,
      {
        WrongHandler,
        WrongHandler2
      },
      error
    );

    assert({
      given: 'multiple handlers with no matches',
      should: 'rethrow the error',
      actual: actualError && actualError.message,
      expected: error.message
    });
  }

  {
    const error = new Error('SomethingWrong: Something is wrong.');

    const result = Try(
      handleErrors,
      {
        SomethingWrong: () => {}
      },
      error
    );

    assert({
      given: 'a matching error handler',
      should: 'not throw an error',
      actual: result,
      expected: undefined
    });
  }

  {
    const messages = [];
    const log = message => messages.push(message);
    const error = new Error('SomethingWrong: Something is wrong.');

    const checkErrors = handleErrors({
      SomethingWrong: log
    });

    checkErrors(error);

    assert({
      given: 'handlers, partially applied',
      should: 'run the matching error function',
      actual: messages.length,
      expected: 1
    });
  }
});
