# Angular HttpFactory

![](https://circleci.com/gh/gocardless/ng-http-factory.png?circle-token=:circle-token)

Remove boilerplate from `$http` calls without changing the return values and
config API.


## Differences between `$resource` and `HttpFactory`

Like `$resource`, it takes a object of actions and returns a object
with functions that call `$http` with any passed config.

Similarly, url templating is supported, interpolation differs in
that it is always done using `config.params` `$resource` will use `config.data`
or `config.params` depending on the request methid. `config.interceptor` logic works
just like `$resource`.

It differs from `$resource` in that it always returns promises, like
`$http`, and therefore does not return resource 'instances'.

There are no default actions specified.


## `HttpFactory.create`

`$http` config can be passed in the following ways:
- `create` takes default config as the first argument, if a second argument is
  not supplied it is assumed that the first argument is actions, which are
  always required.
- The actions object will extend the default config
- Calling the resulting action function will extend the action object config,
  which in turn extends the default config


Example:
```javascript
var defaultHttp = HttpFactory.create({
  url: '/default/params',
  method: 'GET'
}, {
  action: {
    url: '/will/overwrite/default/params'
  }
}

defaultHttp.action({
  url: '/overwrites/action/url'
});

// GET /overwrites/action/url
```

Everything except `config.intercetor` and `config.params`
are passed straight into `$http(config)` without any modification.

### url interpolation (config.params and config.url)

If a `config.url` is encountered with a `:{String}` it is assumed to be a url
param that should be interpolated using `config.params`.

Any params that match `config.params` will be used when interpolating the `url`
and stripped before `params` are passed to `$http`.

The logic for url interpolation is basically copied from `ngResource`.


## Copyright and license

Copyright 2013 GoCardless, Inc under the MIT license.
