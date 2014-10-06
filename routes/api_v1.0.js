/**
 * Created by Denny on 28.07.2014.
 */

var express = require('express');
var router = express.Router();

var auth = require('../server/js/auth');
var apiConfig = require('../server/js/API');

/* set apiConfig.API routes. */
router.use('/api_v1.0/', auth.isAuthenticated);

router.get('/api_v1.0/list/:type', function (req, res) {
    switch (req.params.type) {
        case "equipment":
        case "armor":
        case "shield":
        case "weapon":
            apiConfig.API.listItem(req.params.type, function (result) {
                res.send(result);
            });
            break;
        case "monster":
            apiConfig.API.listMonsters(function (result) {
                res.send(result);
            });
            break;
        case "character":
            apiConfig.API.listCharacters(req.params.type, function (result) {
                res.send(result);
            });
            break;
        case "damageTable":
        case "criticalTable":
            apiConfig.API.listTable(req.params.type, function (result) {
                res.send(result);
            });
            break;
        default:
            res.status(404, {err: "Command not supported"}).end();
            break;
    }
});

router.get('/api_v1.0/list/:type/details', function (req, res) {
    switch (req.params.type) {
        case "equipment":
        case "armor":
        case "shield":
        case "weapon":
            apiConfig.API.listItemDetails(req.params.type, function (result) {
                res.send(result);
            });
            break;
        case "monster":
            apiConfig.API.listMonstersDetails(function (result) {
                res.send(result);
            });
            break;
        case "character":
            apiConfig.API.listCharactersDetails(req.params.type, function (result) {
                res.send(result);
            });
            break;
        case "damageTable":
        case "criticalTable":
            apiConfig.API.listTableDetails(req.params.type, function (result) {
                res.send(result);
            });
            break;
        default:
            res.status(404, {err: "Command not supported"}).end();
            break;
    }
});

router.get('/api_v1.0/get/:type/:name', function (req, res) {
    switch (req.params.type) {
        case "equipment":
        case "armor":
        case "shield":
        case "weapon":
            apiConfig.API.getItem(req.params.name, function (item) {
                res.send(item);
            });
            break;
        case "monster":
            apiConfig.API.getMonster(req.params.name, function (monster) {
                res.send(monster);
            });
            break;
        case "damageTable":
        case "criticalTable":
            apiConfig.API.getTable(req.params.name, function (table) {
                res.send(table);
            });
            break;
        default:
            res.status(404, {err: "Command not supported"}).end();
            break;
    }
});

router.get('/api_v1.0/get/character/:playerID/:name', function (req, res) {
    apiConfig.API.getCharacter(req.params.name, req.params.playerID, function (character) {
        res.send(character);
    });
});


router.get('/api_v1.0/delete/character/:playerID/:name', function (req, res) {
    apiConfig.API.deleteCharacter(req.params.name, function (character) {
        res.send(character);
    });
});

router.get('/api_v1.0/delete/:type/:name', function (req, res) {
    switch (req.params.type) {
        case "equipment":
        case "armor":
        case "shield":
        case "weapon":
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
            res.status(404, {err: "Command not supported"}).end();
            break;
    }
});

router.get('/api_v1.0/insert/:type', function (req, res) {
    switch (req.params.type) {
        case "equipment":
        case "armor":
        case "shield":
        case "weapon":
            apiConfig.API.insertItem(req.query, function (status) {
                res.status(status).end();
            });
            break;
        case "monster":
            apiConfig.API.insertMonster(req.query, function (status) {
                res.status(status).end();
            });
            break;
        case "character":
            apiConfig.API.insertCharacter(req.query, function (status) {
                res.status(status).end();
            });
            break;
        default:
            res.status(404, {err: "Command not supported"}).end();
            break;
    }
});

router.get('/api_v1.0/update/:type', function (req, res) {
    switch (req.params.type) {
        case "equipment":
        case "armor":
        case "shield":
        case "weapon":
            apiConfig.API.updateItem(req.query, function (status) {
                res.status(status).end();
            });
            break;
        case "monster":
            apiConfig.API.updateMonster(req.query, function (status) {
                res.status(status).end();
            });
            break;
        case "character":
            apiConfig.API.updateCharacter(req.query, function (status) {
                res.status(status).end();
            });
            break;
        default:
            res.status(404, {err: "Command not supported"}).end();
            break;
    }
});

router.get('/api_v1.0/session/:type', function (req, res) {
	switch (req.params.type) {
		case "save":
			req.query._id = req.user.id;
			apiConfig.API.saveSession(req.query, function (status) {
				res.status(status).end();
			});
			break;
		case "load":
			apiConfig.API.loadSession(req.user.id, function (item) {
				res.send(item);
			});
			break;
	}
});

module.exports = router;