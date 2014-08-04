/**
 * Created by Denny on 31.07.2014.
 */

MonsterEditorViewModel = function () {
    var self = this;

    /**
     * load attributes
     */
    self.loadedMonster = ko.observable(undefined);
    self.loadedMonsterBackup = ko.observable(undefined);
    self.selectedMonster = ko.observable('');
    self.loadedName = ko.observable("notEmpty");


    /**
     * loads selected monster from monster json
     */
    self.loadSelectedMonster = function() {
        self.loadedMonster(monsters[self.selectedMonster()]);
        self.loadedName(self.loadedMonster()._id);
        self.loadedMonsterBackup(self.loadedMonster());

        self.name(self.loadedMonster()._id);
        self.level(self.loadedMonster().level);
        self.description(self.loadedMonster().description);
        self.size(self.loadedMonster().size);

        self.helmet(self.loadedMonster().helmet);
        self.armGreaves(self.loadedMonster().armGreaves);
        self.legGreaves(self.loadedMonster().legGreaves);
        self.stunImmun(self.loadedMonster().stunImmun);
        self.bloodImmun(self.loadedMonster().bloodImmun);

        self.weapon(self.loadedMonster().weaponName);
        self.hasShield(self.loadedMonster().shield != undefined);
        self.shield(self.loadedMonster().shieldName);
        self.hasArmor(self.loadedMonster().armor != undefined);
        self.armor(self.loadedMonster().armorName);

        self.hits(self.loadedMonster().hits);
        self.OB(self.loadedMonster().OB);
        self.DB(self.loadedMonster().DB);
        self.MM(self.loadedMonster().MM);
    };

    /**
     * deletes loaded monster from db
     */
    self.deleteLoadedMonster = function () {
        $.ajax({
            url: "/api_v1.0/delete/" + self.loadedMonster().type + "/" + self.loadedMonster()._id
        }).done(function () {
            monstersList.remove(self.loadedMonster()._id);
            self.reset();
        })
    };

    /**
     * create attributes
     */
    self.name = ko.observable("");
    self.level = ko.observable(1);
    self.description = ko.observable("");
    self.size = ko.observable("normal");

    self.weapon = ko.observable("");
    self.hasShield = ko.observable(false);
    self.shield = ko.observable(undefined);
    self.hasArmor = ko.observable(false);
    self.armor = ko.observable(undefined);

    self.helmet = ko.observable(false);
    self.nativeHelmet = ko.observable(false);
    self.armGreaves = ko.observable(false);
    self.nativeArmGreaves = ko.observable(false);
    self.legGreaves = ko.observable(false);
    self.nativeLegGreaves = ko.observable(false);
    self.stunImmun = ko.observable(false);
    self.bloodImmun = ko.observable(false);

    /**
     * set Attributes by selected armor
     */
    self.setArmorValues = ko.computed(function(){
        if (self.hasArmor() && self.armor() != "") {
            var armor = armors[self.armor()];

            self.helmet(armor.helmet);
            self.nativeHelmet(armor.helmet);
            self.armGreaves(armor.armGreaves);
            self.nativeArmGreaves(armor.armGreaves);
            self.legGreaves(armor.legGreaves);
            self.nativeLegGreaves(armor.legGreaves);
        }
        else {
            self.helmet(false);
            self.nativeHelmet(false);
            self.armGreaves(false);
            self.nativeArmGreaves(false);
            self.legGreaves(false);
            self.nativeLegGreaves(false);
        }
    });

    self.maxHits = 450;
    self.maxOB = 240;
    self.maxDB = 75;
    self.maxMM = 50;

    self.hits = ko.observable(20);
    self.OB = ko.observable(30);
    self.DB = ko.observable(10);
    self.MM = ko.observable(10);

    self.compareHits = ko.computed(function () {
        return self.hits() / self.maxHits * 100 + "%";
    });
    self.compareOB = ko.computed(function () {
        return self.OB() / self.maxOB * 100 + "%";
    });
    self.compareDB = ko.computed(function () {
        return self.DB() / self.maxDB * 100 + "%";
    });
    self.compareMM = ko.computed(function () {
        if (parseInt(self.MM()) >= 0) {
            return (parseInt(self.MM())) / (self.maxMM ) * 100 + "%";
        }
        else {
            return "0%";
        }
    });

    /**
     * stores monster into db
     */
    self.saveMonster = function () {
        var monster = {
            _id: self.name(),
            type: "monster",
            level: self.level(),
            description: self.description(),
            size: self.size(),
            hits: self.hits(),
            OB: self.OB(),
            DB: self.DB(),
            MM: self.MM(),
            weapon: self.weapon(),
            armor: self.hasArmor() ? self.armor() : undefined,
            shield: self.hasShield() ? self.shield() : undefined,
            helmet: self.helmet(),
            armGreaves: self.armGreaves(),
            legGreaves: self.legGreaves(),
            bloodImmun: self.bloodImmun(),
            stunImmun: self.stunImmun()
        };

        var url = "/api_v1.0/insert/" + monster.type;
        if (self.loadedMonster() && monster._id == self.loadedMonster()._id) {
            url = "/api_v1.0/update/" + monster.type;
        }
        $.ajax({
            url: url,
            data: monster,
            success: function () {
                monsters[monster._id] = new Monster(monster);
                monstersList.push(monster._id);
                self.reset();
            }
        });
    };

    /**
     * resets form to default values
     */
    self.reset = function() {
        self.loadedMonster(undefined);

        self.name("");
        self.level(1);
        self.description("");
        self.size("normal");

        self.weapon("");
        self.hasShield(false);
        self.shield(undefined);
        self.hasArmor(false);
        self.armor(undefined);

        self.hits(20);
        self.OB(30);
        self.DB(10);
        self.MM(10);

        self.helmet(false);
        self.nativeHelmet(false);
        self.armGreaves(false);
        self.nativeArmGreaves(false);
        self.legGreaves(false);
        self.nativeLegGreaves(false);
        self.stunImmun(false);
        self.bloodImmun(false);
    };

    /**
     * disables delete button on changing existing monster name
     * enables it again when re changing the name
     * @type {*|void}
     */
    self.loadedNameChanged = ko.computed(function() {
        if (self.loadedMonster()) {
            if (self.loadedName() != self.name()) {
                self.loadedMonster(undefined);
            }
        }
        else {
            if (self.loadedName() == self.name()) {
                self.loadedMonster(self.loadedMonsterBackup());
            }
        }
    }).extend({
        throttle: 500
    });
};


var monsterEditorViewModel = new MonsterEditorViewModel();

ko.applyBindings(monsterEditorViewModel, document.getElementById('monsterEditor'));