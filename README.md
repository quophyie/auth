# @C8/Auth
JWT Authentication Strategy, JWT issuer and API Keys/Tokens generator.

## Usage
Check the `/examples` folder.

## API

### `new AuthStrategy(options)`
Creates a new Authentication Strategy with a secret. It exposes a series of functions that depend upon that secret.
+ `options` is an object literal containing options to control how the token is extracted from the request or verified.
    - `secretOrKey` (REQUIRED): string or buffer containing the secret (symmetric) or PEM-encoded public key (asymmetric) for verifying the token's signature;
    - `verify` (REQUIRED): is a function with the parameters `verify(jwtPayload, done)` where `jwtPayload` is an object literal containing the decoded JWT payload and `done` is a passport error first callback accepting arguments done(error, user, info);
    - `jwtFromRequest`: Function that accepts a request as the only parameter and returns either the JWT as a string or null. See Extracting the JWT from the request for more details;
    - `issuer`: If defined the token issuer (iss) will be verified against this value;
    - `audience`: If defined, the token audience (aud) will be verified against this value. This should not be setup if you're using APIKeys;
    - `algorithms`: List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"];
    - `ignoreExpiration`: if true do not validate the expiration of the token;
    - `passReqToCallback`: If true the request will be passed to the `verify` callback. i.e. `verify(request, jwt_payload, done_callback)`;

### `auth.issueToken(payload, opts, callback)`
Returns a new JWT string signed with the `AuthStrategy` instance secret.
+ `payload` (REQUIRED): the payload to be added to the token. Also a `jti` property is set to a UUID to allow for token revoking;
+ `opts`: any option accepted by [jsonwebtoken#sign](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback);
+ `callback`: if callback is not passed, the function is run synchronously and return the JWT as string;

### `auth.generateApiKey()`
Returns an object with `apiId` (32 chars alphanumeric) and `apiKey` (64 chars alphanumeric) pair.

### `auth.issueTokenForApiKey(credentials, payload, opts, callback)`
Returns a new JWT string signed with the `AuthStrategy` instance secret for the given credentials. The `credentials.apiId` is added to the payload.
+ `credentials` (REQUIRED): an object with `apiId` and `apiKey` properties;
+ `payload` (REQUIRED): the payload to be added to the token. Also a `jti` property is set to a UUID to allow for token revoking;
+ `opts`: any option accepted by [jsonwebtoken#sign](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback);
+ `callback`: if callback is not passed, the function is run synchronously and return the JWT as string;

## Tests

The following commands are available:
+ `coverage` for running code coverage with Istanbul (it shows the report at the bottom)
+ `standard` for code style checks with Standardjs
+ `test` for running Mocha tests

## Versioning
This module adheres to [semver](http://semver.org/) versioning. That means that given a version number MAJOR.MINOR.PATCH, we increment the:

1. MAJOR version when we make incompatible API changes,
2. MINOR version when we add functionality in a backwards-compatible manner, and
3. PATCH version when we make backwards-compatible bug fixes.

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

## License
The MIT License

Copyright (c) 2016 C8 MANAGEMENT LIMITED