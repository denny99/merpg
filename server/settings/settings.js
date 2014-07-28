/**
 * Created by Denny on 28.07.2014.
 */

/**
 * get DB object with dbName
 * @param dbName name of required DB
 * @returns {*|Renderer|Passport|Server|app}
 */
exports.getDB = function (dbName) {
    console.log("loading: " + dbName);
    var nano;
    nano = require('nano')('https://' + (config.db_login.auth_key + ':' + config.db_login.auth_secret).toString('base64') + '@merpg.cloudant.com');
    return nano.use(config.db_list[dbName]);

};