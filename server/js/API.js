/**
 * Created by Denny on 28.07.2014.
 */
var settings = require('../settings/settings');
var tables = settings.getDB("tables");
var monsters = settings.getDB("monsters");
var characters = settings.getDB("characters");
var items = settings.getDB("items");

API = function() {
    /**
     * Returns a table from table db
     * @param tablename name of requested table
     * @param fn callback function, gets result as param
     */
    this.getTable = function (tablename, fn) {
        //get requested table
        tables.get(tablename, {}, function (err,body) {
            if (!err) {
                fn(body);
            }
            else {
                console.log(err);
                fn(err.status_code);
            }
        })
    };

    /**
     * Returns a monster from monster db
     * @param monsterName name of requested monster
     * @param fn callback function, gets result as param
     */
    this.getMonster = function (monsterName, fn) {
        //get requested monster
        monsters.get(monsterName, {}, function (err,body) {
            if (!err) {
                fn(body);
            }
            else {
                console.log(err);
                fn(err.status_code);
            }
        })
    };

    /**
     * Returns a character from character db
     * @param characterName name of requested character
     * @param fn callback function, gets result as param
     * @param player id of owner
     */
    this.getCharacter = function (characterName, player, fn) {
        //get requested character
        //TODO needs to be replaced
        characters.get(characterName, {}, function (err,body) {
            if (!err) {
                fn(body);
            }
            else {
                console.log(err);
                fn(err.status_code);
            }
        })
    };

    /**
     * Returns a item from item db
     * @param itemname name of requested item
     * @param fn callback function, gets result as param
     */
    this.getItem = function (itemname, fn) {
        //get requested item
        items.get(itemname, {}, function (err,body) {
            if (!err) {
                fn(body);
            }
            else {
                console.log(err);
                fn(err.status_code);
            }
        })
    };

    /**
     * Inserts a monster into monster db
     * @param monster monster json to insert
     * @param fn callback
     */
    this.insertMonster = function(monster, fn) {
        monsters.insert(monster, {}, function (err, body) {
            if (err) {
                fn(err.status_code);
            }
            else {
                fn(200);
            }
        });
    };

    /**
     * Inserts a character into character db
     * @param character character json to insert
     * @param fn callback
     */
    this.insertCharacter = function(character, fn) {
        characters.insert(character, {}, function (err, body) {
            if (err) {
                fn(err.status_code);
            }
            else {
                fn(200);
            }
        });
    };

    /**
     * inserts an item into item db
     * @param item item json to insert
     * @param fn callback
     */
    this.insertItem = function(item, fn) {
        items.insert(item, {}, function (err, body) {
            if (err) {
                fn(err.status_code);
            }
            else {
                fn(200);
            }
        });
    };

    /**
     * deletes a monster from monster db
     * @param monsterName name of requested monster
     * @param fn callback
     */
    this.deleteMonster = function (monsterName, fn) {
        //get requested monster
        monsters.get(monsterName, {}, function (err,body) {
            if (!err) {
                monsters.destroy(body._id, body._rev, function() {
                    if (err) {
                        fn(err.status_code)
                    }
                    else {
                        fn(200);
                    }
                })
            }
            else {
                console.log(err);
                fn(err.status_code);
            }
        })
    };

    /**
     * deletes a character from character db
     * @param characterName name of requested character
     * @param fn callback
     */
    this.deleteCharacter = function (characterName, fn) {
        //get requested character
        characters.get(characterName, {}, function (err,body) {
            if (!err) {
                characters.destroy(body._id, body._rev, function() {
                    if (err) {
                        fn(err.status_code)
                    }
                    else {
                        fn(200);
                    }
                })
            }
            else {
                console.log(err);
                fn(err.status_code);
            }
        })
    };

    /**
     * deletes a item from item db
     * @param itemName name of requested item
     * @param fn callback
     */
    this.deleteItem = function (itemName, fn) {
        //get requested item
        items.get(itemName, {}, function (err,body) {
            if (!err) {
                items.destroy(body._id, body._rev, function() {
                    if (err) {
                        fn(err.status_code)
                    }
                    else {
                        fn(200);
                    }
                })
            }
            else {
                console.log(err);
                fn(err.status_code);
            }
        })
    };

    /**
     * list all item names of given type
     * @param type filter option
     * @param fn callback
     */
    this.listItem = function(type, fn) {
        db.view("getItems", "listItems", {key: type}, function(err, body) {
            if (!err) {
                var result = [];
                body.rows.forEach(function (doc) {
                    result.push(doc.value);
                });

                fn(result)
            }
            else {
                console.log(err);
                fn(err.status_code);
            }
        })
    };

    /**
     * list all table names of given type
     * @param type filter option
     * @param fn callback
     */
    this.listTable = function(type, fn) {
        db.view("getTables", "listTables", {key: type}, function(err, body) {
            if (!err) {
                var result = [];
                body.rows.forEach(function (doc) {
                    result.push(doc.value);
                });

                fn(result)
            }
            else {
                console.log(err);
                fn(err.status_code);
            }
        })
    };

    /**
     * list all monster names
     * @param fn callback
     */
    this.listMonsters = function(fn) {
        db.view("getMonsters", "listMonsters", {}, function(err, body) {
            if (!err) {
                var result = [];
                body.rows.forEach(function (doc) {
                    result.push(doc.value);
                });

                fn(result)
            }
            else {
                console.log(err);
                fn(err.status_code);
            }
        })
    };

    /**
     * list all character names filtered by paramter
     * @param player if given only characters of this player will be listed
     * @param fn callback
     */
    this.listCharacters = function(player, fn) {
        var param = {};
        var view = "listCharacters";
        if (player != characters) {
            param = {key: player};
            view += "OfPlayer";
        }
        db.view("getCharacters", view, param, function(err, body) {
            if (!err) {
                var result = [];
                body.rows.forEach(function (doc) {
                    result.push(doc.value);
                });

                fn(result)
            }
            else {
                console.log(err);
                fn(err.status_code);
            }
        })
    };
};

exports.API = new API();