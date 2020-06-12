const fetch = require('node-fetch');

/**
 *
 * @param title
 * @param content
 * @param access_token
 * @returns {Promise<Response>}
 */
exports.createPost = async function (
    {title, content, access_token}
) {
    const body = {
        'title': title,
        'content': content,
        'locale': 'en_US',
        'values': {},
        'completed_stages': [],
        'published_to': [],
        'post_date': '2020-03-12T03:20:31.616Z',
        'allowed_privileges': [
            'read',
            'search'
        ],
        'form': {
            'id': 1,
            'url': process.env.BACKEND_URL + '/api/v3/forms/1',
            'parent_id': null,
            'name': 'Basic Post',
            'description': 'Post with a location',
            'color': null,
            'type': 'report',
            'disabled': false,
            'created': '2020-03-12T03:18:21+00:00',
            'updated': null,
            'hide_author': false,
            'hide_time': false,
            'hide_location': false,
            'require_approval': false,
            'everyone_can_create': true,
            'targeted_survey': false,
            'can_create': [],
            'tags': [],
            'allowed_privileges': [
                'read',
                'search'
            ]
        }

    };

    return await fetch(
        process.env.BACKEND_URL + '/api/v3/posts',
        {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + access_token
            }
        }
    ).then(function (res) {
        if (res.status === 204) {
            return res
        } else {
            throw Error('could not create post')
        }
    });

};
