var dotenv       = require('dotenv'),
    fs           = require('fs'),
    Transifex    = require('transifex'),
    gutil		 = require('gulp-util');

module.exports = function (locales_dir) {
    var project_slug = 'ushahidi-v3',
        mode = 'default',
        resource = 'client-en',
        // Get languages that are at least 90% translated
        completion_threshold = 70,
        config = {};

    // Try to load user's ~/.transifexrc config
    // see http://docs.transifex.com/client/config/
    try {
        config = dotenv.parse(fs.readFileSync(process.env.HOME + '/.transifexrc'));
    } catch (e) {
        // silently skip
    }

    // Try to load username/password from env
    config.username = config.username || process.env.TX_USERNAME;
    config.password = config.password || process.env.TX_PASSWORD;

    if (!config.username || !config.password) {
        gutil.log(gutil.colors.yellow('Missing transifex username and password'));
    }

    var transifex = new Transifex({
        project_slug: project_slug,
        credential: config.username + ':' + config.password
    });

    // Get language info
    transifex.languageSetMethods(function (err, data) {
        if (err) {
            throw err;
        }

        try {
            fs.mkdirSync(locales_dir);
        }
        catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }

        // Get language stats
        transifex.statisticsMethods(project_slug, resource, function (err, stats) {
            if (err) {
                throw err;
            }

            // Only download languages that have been translated past the completion threshold
            data = data.filter(function (language) {
                if (stats[language.code] !== undefined && parseInt(stats[language.code].completed) >= completion_threshold) {
                    return true;
                }

                return false;
            });

            // Download translations
            data.forEach(function (language) {
                transifex.translationInstanceMethod(project_slug, resource, language.code, { mode: mode }, function (err, data) {
                    if (err) {
                        throw err;
                    }

                    fs.writeFileSync(locales_dir +
                                     // Replace underscore with hyphen
                                     language.code.replace('_', '-') +
                                     '.json', data);
                });
            });


            // Replace language code underscores with hyphens
            var languages = data.map(function (language) {
                language.code = language.code.replace('_', '-');
                return language;
            });

            // Save translated language list
            fs.writeFileSync(locales_dir + 'languages.json', JSON.stringify({languages: languages}));

        });
    });
};
