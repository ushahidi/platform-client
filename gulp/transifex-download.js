let dotenv       = require('dotenv'),
    fs           = require('fs'),
    Transifex    = require('transifex'),
    gutil		 = require('gulp-util');

let project_slug = 'ushahidi-v3',
    mode = 'default',
    resource = 'client-en',
    // Get languages that are at least 90% translated
    completion_threshold = 70;

function getCompletedLanguages(transifex) {
    return new Promise((resolve, reject) => {
        // Get language info
        transifex.languageSetMethods((err, languages) => {
            if (err) {
                reject();
                throw err;
            }

            // Get language stats
            transifex.statisticsMethods(project_slug, resource, (err, stats) => {
                if (err) {
                    reject();
                    throw err;
                }

                // Only download languages that have been translated past the completion threshold
                languages = languages.filter((language) => {
                    // Don't download english, since its built in
                    if (language.code === 'en') {
                        return false;
                    }

                    if (stats[language.code] !== undefined && parseInt(stats[language.code].completed) >= completion_threshold) {
                        return true;
                    }

                    return false;
                });

                resolve(languages);
            });
        });
    });
}

// Download translations
function downloadTranslations (transifex, languages, locales_dir) {
    let promises = languages.map(function (language) {
        return new Promise((resolve, reject) => {
            transifex.translationInstanceMethod(project_slug, resource, language.code, { mode: mode }, function (err, data) {
                if (err) {
                    // Not sure if we should just reject() here
                    throw err;
                }

                fs.writeFile(locales_dir + language.code.replace('_', '-') + '.json', data, (err) => {
                    if (err) {
                        throw err;
                    }
                    resolve();
                });
            });
        });
    });

    return Promise.all(promises);
}

// Save translated language list
function saveTranslationList(languages, locales_dir) {
    // Replace language code underscores with hyphens
    languages = languages.map((language) => {
        language.code = language.code.replace('_', '-');
        return language;
    });

    // Append English
    languages.push({
        rtl: false,
        pluralequation: 'language.pluralequation',
        code: 'en',
        name: 'English',
        nplurals: 2
    });

    if (process.env.APP_LANGUAGES) {
        let appLanguages = process.env.APP_LANGUAGES.split(',');
        languages = languages.filter((lang) => {
            return appLanguages.includes(lang.code);
        });
    }

    languages.sort((a, b) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
    });

    return new Promise((resolve, reject) => {
        fs.writeFile(locales_dir + 'languages.json', JSON.stringify({languages: languages}), (err) => {
            if (err) {
                throw err;
            }
            resolve();
        });
    });
}

module.exports = (locales_dir, done) => {
    let config = {};

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

    // Check if we have username/password
    if (!config.username || !config.password) {
        gutil.log(['transifex'], gutil.colors.yellow('Missing transifex username and password'));
        done();
        return;
    }

    // Create locales dir
    try {
        fs.mkdirSync(locales_dir);
    }
    catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }

    var transifex = new Transifex({
        project_slug: project_slug,
        credential: config.username + ':' + config.password
    });

    getCompletedLanguages(transifex)
    .then((languages) => {
        Promise.all([
            downloadTranslations(transifex, languages, locales_dir),
            saveTranslationList(languages, locales_dir)
        ]).then(() => {
            done();
        });
    });
};
