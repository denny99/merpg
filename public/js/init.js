/**
 * Created by Denny on 31.07.2014.
 */

$('#obSlider').slider({
});

//data storages
var damageTables = {};
var criticalTables = {};
var weapons = {};
var armor = {};
var shields = {};
var monsters = {};

//build name list for selects
var damageTablesList = ko.observableArray([]);
var criticalTablesList = ko.observableArray([]);
var weaponsList = ko.observableArray([]);
var armorList = ko.observableArray([]);
var shieldsList = ko.observableArray([]);
var monstersList = ko.observableArray([]);
var itemsList = ko.computed(function () {
    return [{name: "----Waffen----"}].concat(weaponsList(), [{name: "----Rüstungen----"}], armorList(), [{name: "----Schilde----"}], shieldsList());
});


var dataLoader = new DataLoader();