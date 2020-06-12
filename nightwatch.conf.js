module.exports = {
    src_folders: ['test'],
    page_objects_path: './test/ui/pageObjects',
    test_settings: {
        default: {
            selenium_host: '127.0.0.1',
            launch_url: 'http://172.17.0.1:3000',
            globals: {
                super_admin_access_token: null,
                super_admin_username: 'admin',
                super_admin_password: 'admin',
                admin_username: 'testadmin@ushahidi.com',
                admin_password: 'admin123'
            },
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                chromeOptions: {
                    args: ['disable-gpu'],
                    w3c: false
                }
            }
        }
    }
};
