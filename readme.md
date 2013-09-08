# Angular HttpFactory

Angular.js `$http` abstraction similar to `$resource`.

What it does:
- url interpolation (same as $resource)
- response iterceptor (same as $resource)
- returns promises

What it does not do:
- return objects that will populate themselves (like $resource)

```javascript
// Example

var BillHttp = HttpFactory.create({
   method: 'GET',
   url: '/api/bills/:id'
 }, {
  find: {
    interceptor: {
      response: function(response) {
        return response.data;
      },
      responseError: function(responseError) {
        return responseError.data;
      }
    }
  },
  entries: {
    method: 'GET',
    url: '/api/submissions/:id/entries'
  }
});

BillHttp.find({params: { id: 1 }});
// GET /api/bills/1
```

## Copyright and license

Copyright 2013 GoCardless, Inc under the MIT license.
