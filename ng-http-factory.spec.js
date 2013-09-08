'use strict';

describe('HttpFactory', function(){
  beforeEach(module('ngHttpFactory'));

  var HttpFactory, $httpBackend;

  beforeEach(inject(function ($injector) {
    HttpFactory = $injector.get('HttpFactory');
    $httpBackend = $injector.get('$httpBackend');
  }));

  function factory(paramDefaults, actions) {
    return HttpFactory.create(paramDefaults, actions);
  }

  describe('create', function() {
    describe('config', function() {
      afterEach(function() {
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
      });

      it('configDefaults', function() {
        $httpBackend.expectGET('/test').respond(200);

        var http = factory({
          url: '/test'
        }, {
          find: { method: 'GET' }
        });

        http.find();
      });

      describe('actions config', function () {
        var http;
        beforeEach(function () {
          http = factory({
            find: { method: 'GET', url: '/other' },
          });
        });

        it('action default', function() {
          $httpBackend.expectGET('/other').respond(200);
          http.find();
        });

        it('action method', function() {
          $httpBackend.expectGET('/some').respond(200);
          http.find({
            url: '/some'
          });
        });
      });
    });

    describe('url', function() {
      it('interpolates', function() {
        $httpBackend.expectGET('/get/1/entries').respond(200);
        factory({
          find: { method: 'GET', url: '/get/:id/entries' }
        }).find({params: {id: 1}});
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
      });
    });

    describe('interceptor', function() {
      it('intercepts response', function() {
        var resp;
        $httpBackend.expectGET('').respond(200, { value: 1 });

        factory({
          find: {
            method: 'GET',
            interceptor: {
              response: function (response) {
                response.data.value += 1;
                return response.data;
              }
            }
          }
        }).find().then(function(response) {
          resp = response;
        });

        $httpBackend.flush();

        expect(resp.value).toEqual(2);
      });

      it('intercepts responseError', function() {
        var resp;
        $httpBackend.expectGET('').respond(500, { value: 1 });

        factory({
          find: {
            method: 'GET',
            interceptor: {
              responseError: function (responseError) {
                responseError.data.value += 1;
                return responseError.data;
              }
            }
          }
        }).find().then(function(response) {
          resp = response;
        });

        $httpBackend.flush();

        expect(resp.value).toEqual(2);
      });
    });
  });
});
