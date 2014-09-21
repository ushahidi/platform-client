module.exports = ['$scope', function($scope) {
	$scope.title = 'Posts';
	$scope.posts = [{
		'id': '1',
		'url': 'http://ushahidi-platform.dev/api/v2/posts/1',
		'parent': null,
		'user': null,
		'form': {
			'id': '1',
			'url': 'http://ushahidi-platform.dev/api/v2/forms/1'
		},
		'type': 'report',
		'title': 'Test post',
		'slug': null,
		'content': 'Testing post',
		'status': 'published',
		'created': '1970-01-01T00:00:00+00:00',
		'updated': null,
		'locale': 'en_us',
		'values': {
			'last_location_point': [{
				'id': '1',
				'value': {
					'lon': 12.123,
					'lat': 21.213
				}
			}, {
				'id': '7',
				'value': {
					'lon': 12.223,
					'lat': 21.313
				}
			}],
			'missing_status': [{
				'id': '1',
				'value': 'believed_missing'
			}],
			'links': [{
				'id': '11',
				'value': 'http://google.com'
			}, {
				'id': '12',
				'value': 'http://ushahidi.com'
			}]
		},
		'tags': [{
			'id': '3',
			'url': 'http://ushahidi-platform.dev/api/v2/tags/3'
		}],
		'allowed_methods': {
			'get': true,
			'post': true,
			'put': true,
			'delete': true
		}
	}, {
		'id': '9999',
		'url': 'http://ushahidi-platform.dev/api/v2/posts/9999',
		'parent': null,
		'user': null,
		'form': {
			'id': '1',
			'url': 'http://ushahidi-platform.dev/api/v2/forms/1'
		},
		'type': 'report',
		'title': 'another report',
		'slug': null,
		'content': 'Some description',
		'status': 'published',
		'created': '1970-01-01T00:00:00+00:00',
		'updated': null,
		'locale': 'en_us',
		'values': {
			'last_location_point': [{
				'id': '3',
				'value': {
					'lon': 10.123,
					'lat': 26.213
				}
			}]
		},
		'tags': [

		],
		'allowed_methods': {
			'get': true,
			'post': true,
			'put': true,
			'delete': true
		}
	}];
}];
