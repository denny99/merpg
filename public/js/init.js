/**
 * Created by Denny on 31.07.2014.
 */

//data storages
var damageTables = {};
var criticalTables = {};
var weapons = {};
var armors = {};
var shields = {};
var monsters = {};

//build name list for selects
var damageTablesList = ko.observableArray([]);
var criticalTablesList = ko.observableArray([]);
var weaponsList = ko.observableArray([]);
var armorsList = ko.observableArray([]);
var shieldsList = ko.observableArray([]);
var monstersList = ko.observableArray([]);
var itemsList = ko.computed(function () {
    return [
        {name: "----Waffen----"}
    ].concat(weaponsList(), [
            {name: "----Rüstungen----"}
        ], armorsList(), [
            {name: "----Schilde----"}
        ], shieldsList());
});

var dataLoader = new DataLoader();