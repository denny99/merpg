/**
 * Created by Denny on 31.07.2014.
 */

ItemEditorViewModel = function () {
    var self = this;

    //load attributes
    self.selectedItem = ko.observable("");
    self.loadedItem = ko.observable(undefined);
    self.loadedItemBackup = ko.observable(undefined);
    self.loadedName = ko.observable("notEmpty");

    /**
     * loads selectedItem from item jsons
     */

    self.loadSelectedItem = function () {
        switch (self.selectedItem().type) {
            case "weapon":
                self.loadedItem(weapons[self.selectedItem().name]);
                break;
            case "armor":
                self.loadedItem(armors[self.selectedItem().name]);
                break;
            case "shield":
                self.loadedItem(shields[self.selectedItem().name]);
                break;
        }

        self.loadedName(self.loadedItem()._id);
        self.loadedItemBackup(self.loadedItem());
        setAttributes(self.loadedItem());
    };

    self.deleteLoadedItem = function() {
        $.ajax({
            url: "/api_v1.0/delete/" + self.loadedItem().type + "/" + self.loadedItem()._id
        }).done(function () {
            weaponsList.remove({name: self.loadedItem()._id, type: self.loadedItem().type});
            armorsList.remove({name: self.loadedItem()._id, type: self.loadedItem().type});
            shieldsList.remove({name: self.loadedItem()._id, type: self.loadedItem().type});
            self.reset();
        })
    };

    /**
     * sets form attributes to values of item
     * @param item item to restore
     */
    function setAttributes(item) {
        self.name(item._id);
        self.type(item.type);
        self.description(item.description);
        self.price(item.price);
        self.weight(item.weight);

        self.range(item.range);
        self.fumbleRange(item.fumbleRange);

        if (item.OBBonus) {
            self.OBNone(item.OBBonus.none);
            self.OBSL(item.OBBonus.softLeather);
            self.OBRL(item.OBBonus.rigidLeather);
            self.OBChain(item.OBBonus.chain);
            self.OBPlate(item.OBBonus.plate);
        }
        else {
            self.OBNone(0);
            self.OBSL(0);
            self.OBRL(0);
            self.OBChain(0);
            self.OBPlate(0);
        }

        self.weaponType(item.weaponType);
        self.attackType(item.attackType);
        if (item.primaryCritical) {
            self.primaryCriticalType(item.primaryCritical.type);
            self.primaryCriticalMax(item.primaryCritical.max);
        }
        else {
            self.primaryCriticalType("");
            self.primaryCriticalMax("");
        }

        if (item.secondaryCritical) {
            self.secondaryCritical(true);
            self.secondaryCriticalType(item.secondaryCritical.type);
            self.secondaryCriticalMax(item.secondaryCritical.max);
        }
        else {
            self.secondaryCritical(false);
            self.secondaryCriticalType("");
            self.secondaryCriticalMax("");
        }

        self.DBBonus(item.DBBonus);

        self.armorType(item.armorType);

        if (item.type == "armor") {
            self.helmet(JSON.parse(item.helmet));
            self.armGreaves(JSON.parse(item.armGreaves));
            self.legGreaves(JSON.parse(item.legGreaves));
        }
        else {
            self.helmet(false);
            self.armGreaves(false);
            self.legGreaves(false);
        }
    }

    //item attributes
    self.type = ko.observable("equipment");
    self.name = ko.observable("");
    self.description = ko.observable("");
    self.price = ko.observable(1);
    self.weight = ko.observable(1);
    self.range = ko.observable(3);
    self.fumbleRange = ko.observable(1);
    self.OBNone = ko.observable(0);
    self.OBSL = ko.observable(0);
    self.OBRL = ko.observable(0);
    self.OBChain = ko.observable(0);
    self.OBPlate = ko.observable(0);

    self.weaponType = ko.observable("melee");
    self.attackType = ko.observable("");

    self.previousAT = "";

    //pre set missile on missile weapon
    //prevent choosing missile on melee weapon
    self.attackTypeComputed = ko.computed(function () {
        if (self.weaponType() == "ranged") {
            self.attackType("missile");
        }
        else {
            if (self.attackType() == "missile") {
                self.attackType(self.previousAT);
            }
            else {
                self.previousAT = self.attackType();
            }
        }
    });
    self.primaryCriticalType = ko.observable("");
    self.primaryCriticalMax = ko.observable("");
    self.secondaryCritical = ko.observable(false);
    self.secondaryCriticalType = ko.observable("");
    self.secondaryCriticalMax = ko.observable("");

    self.DBBonus = ko.observable(1);

    self.armorType = ko.observable("");
    self.helmet = ko.observable(false);
    self.armGreaves = ko.observable(false);
    self.legGreaves = ko.observable(false);

    /**
     * resets form to initial state except radio buttons
     */
    self.reset = function () {
        self.loadedItem(undefined);

        self.name("");
        self.type("equipment");
        self.description("");
        self.price(1);
        self.weight(1);

        self.range(3);
        self.fumbleRange(1);
        self.OBNone(0);
        self.OBSL(0);
        self.OBRL(0);
        self.OBChain(0);
        self.OBPlate(0);

        self.weaponType("melee");
        self.attackType("");
        self.primaryCriticalType("");
        self.primaryCriticalMax("");
        self.secondaryCritical(false);
        self.secondaryCriticalType("");
        self.secondaryCriticalMax("");

        self.DBBonus(1);

        self.armorType("none");
        self.helmet(false);
        self.armGreaves(false);
        self.legGreaves(false);

        self.loadedItem(undefined);
    };

    /**
     * create db document based on radio selection
     */
    self.saveItem = function () {
        var item = {
            _id: self.name(),
            description: self.description(),
            price: self.price(),
            weight: self.weight(),
            type: self.type()
        };

        switch (self.type()) {
            case "weapon":
                item.fumbleRange = self.fumbleRange();
                item.weaponType = self.weaponType();

                if (item.weaponType != 'melee') {
                    item.range = self.range();
                }

                item.OBBonus = {
                    none: self.OBNone(),
                    softLeather: self.OBSL(),
                    rigidLeather: self.OBRL(),
                    chain: self.OBChain(),
                    plate: self.OBPlate()
                };

                item.attackType = self.attackType();
                item.primaryCritical = {
                    type: self.primaryCriticalType(),
                    max: self.primaryCriticalMax()
                };
                if (self.secondaryCritical()) {
                    item.secondaryCritical = {
                        type: self.secondaryCriticalType(),
                        max: self.secondaryCriticalMax()
                    };
                }
                weapons[item._id] = item;
                if (!self.loadedItem() || item._id != self.loadedItem()._id) {
                    weaponsList.push({name: item._id, type: item.type});
                }
                break;
            case "shield":
                item.DBBonus = self.DBBonus();
                shields[item._id] = item;
                if (!self.loadedItem() || item._id != self.loadedItem()._id) {
                    shieldsList.push({name: item._id, type: item.type});
                }
                break;
            case "armor":
                item.armorType = self.armorType();
                item.helmet = self.helmet();
                item.legGreaves = self.legGreaves();
                item.armGreaves = self.armGreaves();
                armors[item._id] = item;
                if (!self.loadedItem() || item._id != self.loadedItem()._id) {
                    armorsList.push({name: item._id, type: item.type});
                }
                break;
        }
        var url = "/api_v1.0/insert/" + item.type;
        if (self.loadedItem() && item._id == self.loadedItem()._id) {
            url = "/api_v1.0/update/" + item.type;
        }
        $.ajax({
            url: url,
            data: item,
            success: function () {
                self.reset();
            }
        });
    };

    /**
     * disables delete button on changing existing item name
     * enables it again when re changing the name
     * @type {*|void}
     */
    self.loadedNameChanged = ko.computed(function() {
        if (self.loadedItem()) {
            if (self.loadedName() != self.name()) {
                self.loadedItem(undefined);
            }
        }
        else {
            if (self.loadedName() == self.name()) {
                self.loadedItem(self.loadedItemBackup());
            }
        }
    }).extend({
        throttle: 500
    });
};


var itemEditorViewModel = new ItemEditorViewModel();

ko.applyBindings(itemEditorViewModel, document.getElementById('itemEditor'));