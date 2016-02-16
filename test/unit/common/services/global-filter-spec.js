var rootPath = '../../../../';

describe('Global filter', function () {

    var $rootScope,
        GlobalFilter;

    beforeEach(function () {
        var testApp = angular.module('testApp', ['ushahidi.mock'])
        .service('GlobalFilter', require(rootPath + 'app/common/services/global-filter.js'));

        require(rootPath + 'test/unit/simple-test-app-config.js')(testApp);

        angular.mock.module('testApp');

    });

    beforeEach(inject(function (_$rootScope_, _GlobalFilter_) {
        $rootScope = _$rootScope_;
        GlobalFilter = _GlobalFilter_;
    }));

    it('should set and clear selected', function () {
        GlobalFilter.setSelected({q: 'test'});
        expect(GlobalFilter.q).toEqual('test');
    });

    it('should clear selected', function () {
        GlobalFilter.setSelected({q: 'test'});
        GlobalFilter.clearSelected();
        expect(GlobalFilter.q).toEqual('');
    });

    it('should return filter count', function () {
        GlobalFilter.setSelected({q: 'test'});
        expect(GlobalFilter.getFilterCount()).toEqual(2);
    });

    it('should return if tag selected', function () {
        GlobalFilter.setSelected({tags: [1]});
        expect(GlobalFilter.hasSelectedTags()).toBe(true);
    });

    it('should return if form selected', function () {
        GlobalFilter.setSelected({form: [1]});
        expect(GlobalFilter.hasSelectedForms()).toBe(true);
    });

    it('should return if Post stage selected', function () {
        GlobalFilter.setSelected({current_stage: [1]});
        expect(GlobalFilter.hasSelectedPostStages()).toBe(true);
    });

    it('should return of collection selected', function () {
        GlobalFilter.setSelected({set: [1]});
        expect(GlobalFilter.hasSelectedCollections()).toBe(true);
    });

    it('should return query', function () {
        GlobalFilter.setSelected({q: 'test'});
        var query = GlobalFilter.getPostQuery();
        expect(query.q).toEqual('test');
    });
});
