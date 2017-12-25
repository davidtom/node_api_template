// Function to be used to remove all properties from an object except those
// that are on the whiteList; similar usage to Rails' strong params
module.exports = function permitProperties(rawObj, whiteList) {
    let safeObj = {};
    whiteList.forEach(function (property) {
        if (rawObj[property]) {
            safeObj[property] = rawObj[property];
        }
    });
    return safeObj;
};