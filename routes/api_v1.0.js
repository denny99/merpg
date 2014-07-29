/**
 * Created by Denny on 28.07.2014.
 */

var express = require('express');
var router = express.Router();

var apiConfig = require('../server/js/API');

/* set apiConfig.API routes. */

router.get('/api_v1.0/get/:type/:name', function(req, res) {
    switch (req.params.type) {
        case "item":
            apiConfig.API.getItem(req.params.name, function (item) {
                res.send(item);
            });
            break;
        case "monster":
            apiConfig.API.getMonster(req.params.name, function (monster) {
                res.send(monster);
            });
            break;
        case "table":
            apiConfig.API.getTable(req.params.name, function (table) {
                res.send(table);
            });
            break;
        default:
            res.send(404, {err: "Command not supported"});
            break;
    }
});

router.get('/api_v1.0/get/character/:playerID/:name', function(req, res) {
    apiConfig.API.getCharacter(req.params.name, req.params.playerID, function (character) {
        res.send(character);
    });
});


router.get('/api_v1.0/delete/character/:playerID/:name', function(req, res) {
    apiConfig.API.deleteCharacter(req.params.name, function (character) {
        res.send(character);
    });
});

router.get('/api_v1.0/delete/:type/:name', function(req, res) {
    switch (req.params.type) {
        case "item":
            apiConfig.API.deleteItem(req.params.name, function (item) {
                res.send(item);
            });
            break;
        case "monster":
            apiConfig.API.deleteMonster(req.params.name, function (monster) {
                res.send(monster);
            });
            break;
        default:
            res.send(404, {err: "Command not supported"});
            break;
    }
});

router.get('/api_v1.0/insert/:type', function(req, res) {
    switch (req.params.type) {
        case "item":
            apiConfig.API.insertItem(JSON.parse(req.params.json), function (status) {
                res.send(status);
            });
            break;
        case "monster":
            apiConfig.API.insertMonster(JSON.parse(req.params.json), function (status) {
                res.send(status);
            });
            break;
        case "character":
                apiConfig.API.insertCharacter(JSON.parse(req.params.json), function (status) {
                    res.send(status);
                });
            break;
        default:
            res.send(404, {err: "Command not supported"});
            break;
    }
});

router.get('/api_v1.0/get/:type/list', function (req, res) {
    switch (req.params.type) {
        case "equipment":
        case "armor":
        case "shield":
        case "weapon":
            apiConfig.API.listItem(JSON.parse(req.params.type), function (result) {
                res.send(result);
            });
            break;
        case "monster":
            apiConfig.API.listMonsters(function (result) {
                res.send(result);
            });
            break;
        case "character":
            apiConfig.API.listCharacters(JSON.parse(req.params.type), function (result) {
                res.send(result);
            });
            break;
        case "damageTable":
        case "criticalTable":
            apiConfig.API.listTable(JSON.parse(req.params.type), function (result) {
                res.send(result);
            });
            break;
        default:
            res.send(404, {err: "Command not supported"});
            break;
    }
});

module.exports = router;