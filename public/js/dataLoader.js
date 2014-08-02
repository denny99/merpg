/**
 * Created by Denny on 31.07.2014.
 */

DataLoader = function() {

    //load data from db and prepare it

    //1. damageTables
    loadData("damageTable");
    //2. criticalTables
    loadData("criticalTable");
    //3. weapons
    loadData("weapon");
    //4. armor
    loadData("armor");
    //5. shields
    loadData("shield");
    //6. equipment (future update)

    //7. monsters
    loadData("monster");
    //8. hero's (future update)

    /**
     * loads all data object from db of given type
     * @param type type of objects
     */
    function loadData(type) {
        var url = "/api_v1.0";
        //get list of names
        $.ajax({
            url: url + "/list/" + type,
            beforeSend: function() {
                //console.log(type + " loading...");
            },
            success: function(data, status, jqXHR) {

                //load data for each name
                data.forEach(function (name) {
                    //get data from API
                    $.ajax({
                        url: url + "/get/" + type + "/" + name,
                        beforeSend: function() {
                            //console.log(name + " loading...");
                        },
                        success: function(data, status, jqXHR) {
                            //build js objects based on type
                            switch (data.type) {
                                case "damageTable":
                                    if (data.subtype == "creature") {
                                        damageTables[data._id] = new CreatureDamageTable(data._id, data.content);
                                    }
                                    else {
                                        damageTables[data._id] = new DamageTable(data._id, data.content);
                                    }

                                    damageTablesList.push({name: data._id, displayName: data.displayName});
                                    damageTablesList.sort(sort_by('name', true, function(a){return a.toUpperCase()}));
                                    break;
                                case "criticalTable":
                                    if (data.subtype == "creature") {
                                        criticalTables[data._id] = new CreatureCriticalTable(data._id, data.content);
                                    }
                                    else {
                                        criticalTables[data._id] = new CriticalTable(data._id, data.content);
                                        criticalTablesList.push({name: data._id, displayName: data.displayName});
                                        criticalTablesList.sort(sort_by('name', true, function(a){return a.toUpperCase()}));
                                    }

                                    break;
                                case "weapon":
                                    weapons[data._id] = new Weapon(data);
                                    weaponsList.push({name: data._id, type: data.type});
                                    weaponsList.sort(sort_by('name', true, function(a){return a.toUpperCase()}));
                                    break;
                                case "shield":
                                    shields[data._id] = new Shield(data);
                                    shieldsList.push({name: data._id, type: data.type});
                                    shieldsList.sort(sort_by('name', true, function(a){return a.toUpperCase()}));
                                    break;
                                case "armor":
                                    armors[data._id] = new Armor(data);
                                    armorsList.push({name: data._id, type: data.type});
                                    armorsList.sort(sort_by('name', true, function(a){return a.toUpperCase()}));
                                    break;
                                case "monster":
                                    monsters[data._id] = new Monster(data);
                                    monstersList.push({name: data._id});
                                    monstersList.sort(sort_by('name', true, function(a){return a.toUpperCase()}));
                            }
                        }
                    }).done(function() {
                        //console.log(name + " loaded.");
                    });
                });
            }
        }).done(function() {
            //console.log(type + " loaded.");
        });
    }
};