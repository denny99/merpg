/**
 * Created by Denny on 28.07.2014.
 */

var express = require('express');
var router = express.Router();

var apiConfig = require('../server/js/API');

/* set apiConfig.API routes. */

router.get('/api_v1.0/get/table/:name', function(req, res) {
    apiConfig.API.getTable(req.params.name, function (table) {
        res.send(table);
    });
});

router.get('/api_v1.0/get/monster/:name', function(req, res) {
    apiConfig.API.getMonster(req.params.name, function (monster) {
        res.send(monster);
    });
});

router.get('/api_v1.0/get/character/:playerID/:name', function(req, res) {
    apiConfig.API.getCharacter(req.params.name, req.params.playerID, function (character) {
        res.send(character);
    });
});

router.get('/api_v1.0/get/item/:name', function(req, res) {
    apiConfig.API.getItem(req.params.name, function (item) {
        res.send(item);
    });
});

router.get('/api_v1.0/delete/monster/:name', function(req, res) {
    apiConfig.API.getMonster(req.params.name, function (monster) {
        res.send(monster);
    });
});

router.get('/api_v1.0/delete/character/:playerID/:name', function(req, res) {
    apiConfig.API.getCharacter(req.params.name, req.params.playerID, function (character) {
        res.send(character);
    });
});

router.get('/api_v1.0/delete/item/:name', function(req, res) {
    apiConfig.API.getItem(req.params.name, function (item) {
        res.send(item);
    });
});

router.get('/api_v1.0/insert/item', function(req, res) {
    apiConfig.API.insertItem(JSON.parse(req.params.json), function (err) {
        res.send(err);
    });
});

router.get('/api_v1.0/insert/monster', function(req, res) {
    apiConfig.API.insertMonster(JSON.parse(req.params.json), function (err) {
        res.send(err);
    });
});

router.get('/api_v1.0/insert/character', function(req, res) {
    apiConfig.API.insertCharacter(JSON.parse(req.params.json), function (err) {
        res.send(err);
    });
});

module.exports = router;