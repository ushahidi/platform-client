module.exports = [
    '$q',
    '$http',
    '_',
    'Util',
    '$translate',
    'MediaEndpoint',
    'Notify',
function (
    $q,
    $http,
    _,
    Util,
    $translate,
    MediaEndpoint,
    Notify
) {
    var MediaEditService = {
        saveMedia: function (medias, post) {
            var deferred = $q.defer();
            var calls = [];
            // Loop over medias and check for changes
            _.each(medias, function (media, key) {
                // Check if media needs to be updated
                if (media.changed) {
                    // Check if new media or if the media file has changed
                    // otherwise just update the caption
                    if (!media.id && media.deleted) {
                        post.values[key][0] = null;
                    // Check if a new file was uploaded
                    }else if (media.file) {
                        calls.push(MediaEditService.uploadFile(media).then(function (media) {
                            post.values[key][0] = media ? media.id : null;
                        }));
                    // Otherwise update the media as it has changed
                    } else {
                        // Remove irrelevant fields
                        delete media.changed;
                        calls.push(MediaEditService.update(media).then(function (media) {
                            post.values[key][0] = media ? media.id : null;
                        }));
                    }
                }
            });
            // Wait for all media updates to complete
            // then resolve the promise and continue
            // saving the post
            $q.all(calls).then(function () {
                deferred.resolve(post);
            });
            return deferred.promise;
        },
        deleteMedia: function (mediaId) {
            if (mediaId) {
                return MediaEndpoint.delete({id: mediaId}).$promise;
            }
            // Return a promise anyway if there is no media to delete
            return $q.when();
        },
        update: function (media) {
            var deferred = $q.defer();

            MediaEndpoint.update(media).$promise.then(function (media) {
                deferred.resolve(media);
            }, function (error) {
                Notify.apiErrors(error);
                // We warn the user about image errors but
                // we continue to save the post
                deferred.resolve({});
            });
            return deferred.promise;
        },
        uploadFile: function (media) {
            var deferred = $q.defer();
            // Delete current file
            this.deleteMedia(media.id).then(function () {
                var formData = new FormData();

                formData.append('file', media.file);

                if (media.caption) {
                    formData.append('caption', media.caption);
                }

                $http.post(
                    Util.apiUrl('/media'),
                    formData,
                    {
                        headers: {
                            'Content-Type': undefined
                        }
                    }
                ).then(function (response) {
                    media.id = response.data.id;
                    deferred.resolve(media);
                }, function (error) {
                    Notify.apiErrors(error);
                    // We warn the user about image errors but
                    // we continue to save the post
                    deferred.resolve({});
                });
            }, function (error) {
                Notify.apiErrors(error);
                // We warn the user about image errors but
                // we continue to save the post
                deferred.resolve({});
            });

            return deferred.promise;
        }
    };

    return Util.bindAllFunctionsToSelf(MediaEditService);
}];
