/**
 * Created by Denny on 31.07.2014.
 */

DataLoader = function () {

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
            url: url + "/list/" + type + "/details",
            beforeSend: function () {
                //console.log(type + " loading...");
            },
            success: function (data, status, jqXHR) {

                //load data for each name
                data.forEach(function (doc) {
                    //get data from API
                    switch (doc.type) {
                        case "damageTable":
                            if (doc.subtype == "creature") {
                                damageTables[doc._id] = new CreatureDamageTable(doc._id, doc.content);
                            }
                            else {
                                damageTables[doc._id] = new DamageTable(doc._id, doc.content);
                            }

                            damageTablesList.push({name: doc._id, displayName: doc.displayName});
                            damageTablesList.sort(sort_by('name', true, function (a) {
                                return a.toUpperCase()
                            }));
                            break;
                        case "criticalTable":
                            if (doc.subtype == "creature") {
                                criticalTables[doc._id] = new CreatureCriticalTable(doc._id, doc.content);
                            }
                            else {
                                criticalTables[doc._id] = new CriticalTable(doc._id, doc.content);
                                criticalTablesList.push({name: doc._id, displayName: doc.displayName});
                                criticalTablesList.sort(sort_by('name', true, function (a) {
                                    return a.toUpperCase()
                                }));
                            }

                            break;
                        case "weapon":
                            weapons[doc._id] = new Weapon(doc);
                            weaponsList.push({name: doc._id, type: doc.type});
                            weaponsList.sort(sort_by('name', true, function (a) {
                                return a.toUpperCase()
                            }));
                            break;
                        case "shield":
                            shields[doc._id] = new Shield(doc);
                            shieldsList.push({name: doc._id, type: doc.type});
                            shieldsList.sort(sort_by('name', true, function (a) {
                                return a.toUpperCase()
                            }));
                            break;
                        case "armor":
                            armors[doc._id] = new Armor(doc);
                            armorsList.push({name: doc._id, type: doc.type});
                            armorsList.sort(sort_by('name', true, function (a) {
                                return a.toUpperCase()
                            }));
                            break;
                        case "monster":
                            monsters[doc._id] = new Monster(doc);
                            monstersList.push({name: doc._id});
                            monstersList.sort(sort_by('name', true, function (a) {
                                return a.toUpperCase()
                            }));
                    }

                });
            }
        }).done(function () {
            //console.log(type + " loaded.");
        });
    }
};