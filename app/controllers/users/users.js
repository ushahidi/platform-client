module.exports = function($scope) {
    $scope.title = 'Users';

    $scope.users = [

        {
            role: 'All',
            name: 'Zombie Jones',
            image: 'http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f',
            lastLogin: '1288323623006',
            lastAttempt: '1288323623006',
            attempts: '3'
        },

        {
            role: 'Admin',
            name: 'Zombie Smith',
            image: 'http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f',
            lastLogin: '1288323623006',
            lastAttempt: '1288323623006',
            attempts: '7'
        },

        {
            role: 'Member',
            name: 'Zombie Stevens',
            image: 'http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f',
            lastLogin: '1288323623006',
            lastAttempt: '1288323623006',
            attempts: '10'
        },

        {
            role: 'Guest',
            name: 'Zombie Jenkins',
            image: 'http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f',
            lastLogin: '1288323623006',
            lastAttempt: '1288323623006',
            attempts: '2'
        }

    ];

};
