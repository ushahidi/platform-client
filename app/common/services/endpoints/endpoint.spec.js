import Endpoint from './endpoint';
import angular from 'angular';
import ngResource from 'angular-resource';
import ngCache from 'angular-cache';

describe('Endpoint service', () => {
  let endpoint, $httpBackend, $rootScope;

  beforeEach(() => {
    let appModule = angular.module('endpointModule', [
        ngResource,
        ngCache
      ])
      .name;

    return window.module(appModule);
  });

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');
    let CacheFactory = $injector.get('CacheFactory');
    let $resource = $injector.get('$resource');
    let $q = $injector.get('$q');

    CacheFactory.destroyAll();

    endpoint = new Endpoint('tags', 'http://backend/tags/:id', {}, {}, $resource, CacheFactory, $q);
  }));

  describe('.get()', () => {
    it('should return data from $http', (done) => {
      $httpBackend.expectGET('http://backend/tags/1')
        .respond({
          id: 1,
          url: 'http://backend/tags/1',
          tag: "A tag!"
        });

      let tag = endpoint.get({id : 1}, (cbData) => {
        expect(cbData.id).toEqual(1);
        done();
      });

      $httpBackend.flush();

      expect(tag.id).toEqual(1);
    });

    it('should return data from cache after first request', (done) => {
      $httpBackend.expectGET('http://backend/tags/2')
        .respond({
          id: 2,
          url: 'http://backend/tags/2',
          tag: "A tag!"
        });

      let tagResponse1 = endpoint.get({id : 2});
      $httpBackend.flush();

      let tagResponse2 = endpoint.get({id : 2}, (cbData) => {
        expect(cbData.id).toEqual(2);
        done();
      });

      $rootScope.$apply();

      expect(tagResponse2.id).toEqual(2);
    });

    it('should always load data from $http if `fresh: true`', (done) => {
      // Setup the backend
      $httpBackend.expectGET('http://backend/tags/2')
        .respond({
          id: 2,
          url: 'http://backend/tags/2',
          tag: "A tag!"
        });

      // Load up tag 2
      let tagResponse1 = endpoint.get({id : 2});
      // Return a result from the backend
      $httpBackend.flush();
      // And verify that result
      expect(tagResponse1.tag).toEqual('A tag!');

      // Set up the backend for *reloading* tag 2
      $httpBackend.expectGET('http://backend/tags/2')
        .respond({
          id: 2,
          url: 'http://backend/tags/2',
          tag: "An updated tag"
        });

      // Load it again, and make sure we ask for it 'fresh'
      let tagResponse2 = endpoint.get({id : 2}, (cbData) => {
        // Check that the callback gets call too!
        expect(cbData.id).toEqual(2);
        // And mark this test DONE
        done();
      }, { fresh: true });

      // Return some responses
      $httpBackend.flush();

      // Check that we got an updated response, not the same tag again
      expect(tagResponse2.tag).toEqual('An updated tag');
    });

    it('should return a $promise which is resolved with the API response', (done) => {
      $httpBackend.expectGET('http://backend/tags/2')
        .respond({
          id: 2,
          url: 'http://backend/tags/2',
          tag: "A tag!"
        });

      let tagResponse1 = endpoint.get({id : 2});

      expect(tagResponse1.$promise).toEqual(jasmine.any(Object));
      expect(tagResponse1.$promise.then).toEqual(jasmine.any(Function));
      tagResponse1.$promise.then((cbResponse) => {
        expect(cbResponse.id).toBe(2);
        done();
      });

      $httpBackend.flush();
    });

    it('should return a $promise which is resolved from the cache', (done) => {
      $httpBackend.expectGET('http://backend/tags/2')
        .respond({
          id: 2,
          url: 'http://backend/tags/2',
          tag: "A tag!"
        });

      let tagResponse1 = endpoint.get({id : 2});

      $httpBackend.flush();

      let tagResponse2 = endpoint.get({id : 2});

      expect(tagResponse2.id).toEqual(2);
      expect(tagResponse2.$promise).toEqual(jasmine.any(Object));
      expect(tagResponse2.$promise.then).toEqual(jasmine.any(Function));

      tagResponse2.$promise.then((cbResponse) => {
        expect(cbResponse.id).toBe(2);
        done();
      });

      $rootScope.$apply();
    });

    it('should not create multiple duplicate requests at once', () => {
      $httpBackend.expectGET('http://backend/tags/2')
        .respond({
          id: 2,
          url: 'http://backend/tags/2',
          tag: "A tag!"
        });

      let tagResponse1 = endpoint.get({id : 2});
      let tagResponse2 = endpoint.get({id : 2});

      $httpBackend.flush();

      expect(tagResponse1.id).toEqual(2);
      expect(tagResponse2.id).toEqual(2);
    });
  });

  describe('.update()', () => {
    it('should update the cache on save', () => {
      $httpBackend.expectPUT('http://backend/tags/7', {
          tag: "a tag!"
        })
        .respond({
          id: 7,
          url: 'http://backend/tags/2',
          tag: "a tag!"
        });

      endpoint.update({id : 7}, {
        tag: "a tag!"
      });

      $httpBackend.flush();

      let tag = endpoint.get({id : 7});

      expect(tag.tag).toBe("a tag!");
      expect(tag.id).toBe(7);
    });
  });

  describe('.save()', () => {
    it('should update the cache on save', () => {
      $httpBackend.expectPOST('http://backend/tags', {
          tag: "a tag!"
        })
        .respond({
          id: 10,
          url: 'http://backend/tags/2',
          tag: "a tag!"
        });

      endpoint.save({
        tag: "a tag!"
      });

      $httpBackend.flush();

      let tag = endpoint.get({id : 10});

      expect(tag.tag).toBe("a tag!");
      expect(tag.id).toBe(10);
    });
  });

  describe('.delete()', () => {
    it('should clear the cache on delete', (done) => {

      $httpBackend.expectDELETE('http://backend/tags/2')
        .respond({
          id: 2,
          url: 'http://backend/tags/2',
          tag: "a tag!"
        });

      endpoint.delete({ id: 2 });

      $httpBackend.flush();

      $httpBackend.expectGET('http://backend/tags/2')
        .respond(404);

      let tag = endpoint.get({ id : 2 });

      tag.$promise.then(() => {
        fail("Tag was returned but should have 404'd");
        done();
      }, () => {
        done();
      })
      .catch(angular.noop);

      $httpBackend.flush();
    });
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});
