# MatchErrors

# Status: Deprecated in favor of [error-causes](https://github.com/paralleldrive/error-causes) which uses the ES2022 error `.cause` property for matching.

Quickly match errors to the appropriate error handler. No more if/switch/else/case messes.

## Why MatchErrors?

Frequently when dealing with APIs, a call can fail in several different ways, which may require different error handlers for each one. In some languages, the problem is neatly handled using pattern matching. There is a pattern matching proposal in the works for JavaScript, but even with pattern matching, you may be tempted to handle your error dispatch in a way that is not appropriate for JavaScript. Take the following example:

```js
class UserNotFoundError extends Error {}
class PermissionDeniedError extends Error {}

const fetchUser = id => {
  if (id === '345') throw new PermissionDeniedError('PermissionDeniedError: You do not have permission to access this resource.');
  throw new UserNotFoundError('UserNotFound: The requested user id, ${ id } was not found.');
};

fetchUser('123').catch(e => {
  // This sometimes works, but can easily fail.
  // In general, you should avoid checking the class of
  // an object in any language, but JavaScript in
  // particular because prototypes are dynamic and
  // cross-realm access is common, which can both make
  // `instanceof` lie.
  if (e instanceof UserNotFoundError) {
    console.log('No user with the requested id was found.');
  } else if (e instanceof PermissionDeniedError) {
    console.log('You do not have permission to access this resource.');
  } else {
    throw e;
  }
});

fetchUser('345').catch(e => {
  // A better alternative is to tag the object with
  // a property you can inspect. In this case, we'll
  // use the error.message field to identify the error.
  if (e.message.includes('UserNotFound')) {
    console.log('No user with the requested id was found.');
  } else if (e.message.includes('PermissionDeniedError')) {
    console.log('You do not have permission to access this resource.');
  } else {
    throw e;
  }
});
```

## What is MatchErrors?

MatchErrors offers a handy solution for error branching inspired by pattern matching. With MatchErrors, our error matching can look like this:

```js
fetchUser('123').catch(
  handleErrors({
    UserNotFound: e => console.log('No user with the requested id was found.'),
    PermissionDenied: e => console.log('You do not have permission to access this resource.')
  }, e);
);
```
