/**
 * Created by Denny on 02.08.2014.
 */

Weapon = function (dbWeapon) {
    var self = this;
    self._id = dbWeapon._id;
    self.description = dbWeapon.description;
    self.price = parseInt(dbWeapon.price);
    self.weight = parseFloat(dbWeapon.weight);
    self.type = dbWeapon.type;

    self.fumbleRange = parseInt(dbWeapon.fumbleRange);
    self.weaponType = dbWeapon.weaponType;

    if (self.weaponType != 'melee') {
        self.range = parseInt(dbWeapon.range);
    }

    self.OBBonus = {
        none: parseInt(dbWeapon.OBBonus.none),
        softLeather: parseInt(dbWeapon.OBBonus.softLeather),
        rigidLeather: parseInt(dbWeapon.OBBonus.rigidLeather),
        chain: parseInt(dbWeapon.OBBonus.chain),
        plate: parseInt(dbWeapon.OBBonus.plate)
    };

    self.attackType = dbWeapon.attackType;
    self.primaryCritical = {
        type: dbWeapon.primaryCritical.type,
        max: dbWeapon.primaryCritical.max
    };

    if (dbWeapon.secondaryCritical) {
        self.secondaryCritical = {
            type: dbWeapon.secondaryCritical.type,
            max: dbWeapon.secondaryCritical.max
        };
    }
};

Armor = function (dbArmor) {
    var self = this;
    self._id = dbArmor._id;
    self.description = dbArmor.description;
    self.price = parseInt(dbArmor.price);
    self.weight = parseFloat(dbArmor.weight);
    self.type = dbArmor.type;

    self.armorType = dbArmor.armorType;
    self.helmet = JSON.parse(dbArmor.helmet);
    self.legGreaves = JSON.parse(dbArmor.legGreaves);
    self.armGreaves = JSON.parse(dbArmor.armGreaves);
};

Shield = function (dbShield) {
    var self = this;
    self._id = dbShield._id;
    self.description = dbShield.description;
    self.price = parseInt(dbShield.price);
    self.weight = parseFloat(dbShield.weight);
    self.type = dbShield.type;
    self.DBBonus = parseInt(dbShield.DBBonus);
};