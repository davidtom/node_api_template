module.exports = {
    // User data to be used by server functions only
    projections: {
        privateUser: {
        },
        // User data safe to respond to API requests with
        publicUser: {
            _id: true,
            firstName: true,
            lastName: true,
            roles: true
        }
    }
};
