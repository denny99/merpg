/**
 * Created by Denny on 04.08.2014.
 */

/**
 * represents and handles a physical attack
 * @param attacker o.O
 * @param defender o.O
 * @constructor
 */
PhysicalAttack = function(attacker, defender) {
    var self = this;
    self.attacker = ko.observable(attacker);
    self.defender = ko.observable(defender);

    self.fumble = ko.observable(false);
    self.flankAttack = ko.observable(false);
    self.rearAttack = ko.observable(false);
    self.surprised = ko.observable(false);
    self.changedWeapon = ko.observable(false);
    self.special = ko.observable(false);

    self.attackRoll = ko.observable(0);
    self.attackResult = ko.observable("");
    self.primaryCriticalRoll = ko.observable(0);
    self.secondaryCriticalRoll = ko.observable(0);

    self.calculateFight = ko.computed(function() {
        var attackOB = self.attacker().attack(parseInt(self.attackRoll()));

        var healthMalus = (self.attacker().hitsTaken() > (self.attacker().currentHits() / 2));

        if (attackOB == "fumble") {
            self.fumble(true);
        }
        else {
            var melee = self.attacker().currentAction() == 'meleeAttack';
            var damageTable = damageTables[self.attacker().weapon.attackType];

            var armor = self.defender().armor ? self.defender().armor.armorType : "none";

            var damage;
            if (damageTable instanceof CreatureDamageTable) {
                damage = damageTable.calculateDamage(attackOB, melee, armor, self.attacker().size, self.flankAttack(), self.rearAttack(), self.surprised(), self.defender().stunned() > 0 || self.defender().knockedOut(), self.changedWeapon(), healthMalus, parseInt(self.special()));
            }
            else {
                damage = damageTable.calculateDamage(attackOB, melee, armor, self.flankAttack(), self.rearAttack(), self.surprised(), self.defender().stunned() > 0 || self.defender().knockedOut(), self.changedWeapon(), healthMalus, parseInt(self.special()));
            }
            var result = damage.damage;

            if (damage.critical) {
                result += " " + damage.critical;
            }

            self.attackResult(result);
        }
    });
};