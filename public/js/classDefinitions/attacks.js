/**
 * Created by Denny on 04.08.2014.
 */

/**
 * represents and handles a physical attack
 * @param attacker o.O
 * @param defender o.O
 * @constructor
 */
PhysicalAttack = function (attacker, defender) {
    var self = this;
    self.attacker = ko.observable(attacker);
    self.defender = ko.observable(defender);

    self.createAttack = function (attacker, defender) {
        self.attacker(attacker);
        self.defender(defender);
    };

    self.fumble = ko.observable(false);
    self.flankAttack = ko.observable(false);
    self.rearAttack = ko.observable(false);
    self.surprised = ko.observable(false);
    self.changedWeapon = ko.observable(false);
    self.special = ko.observable(0).extend({numeric: 0});;
    self.weaponType = ko.observable("regular");

    self.attackRoll = ko.observable(0).extend({numeric: 0});
    self.attackResult = ko.observable("");
    self.attackResultText = ko.observable("");

    self.primaryCriticalRoll = ko.observable(0).extend({numeric: 0});
    self.primaryCriticalResult = ko.observable("");
    self.primaryCriticalResultText = ko.observable("");

    self.secondaryCriticalRoll = ko.observable(0).extend({numeric: 0});
    self.secondaryCriticalResult = ko.observable("");
    self.secondaryCriticalResultText = ko.observable("");

    /**
     * evaluates results in tables
     */
    self.calculateAttack = ko.computed(function () {
        var attackOB = self.attacker().attack(self.attackRoll());
        var primaryCriticalRoll = self.primaryCriticalRoll();
        var secondaryCriticalRoll = self.secondaryCriticalRoll();

        var healthMalus = (self.attacker().hitsTaken() > (self.attacker().currentHits() / 2));

        if (attackOB == "fumble") {
            self.fumble(true);
            self.attackResultText("fumble");
        }
        else {
            //calculate attack Damage
            var melee = self.attacker().currentAction() == 'meleeAttack';
            var damageTable;
            if (self.attacker().currentAction() == 'missileAttack') {
                damageTable = damageTables["missile"];
            }
            else {
                damageTable = damageTables[self.attacker().weapon.attackType];
            }


            var armor = self.defender().armor ? self.defender().armor.armorType : "none";

            var damage;
            if (damageTable instanceof CreatureDamageTable) {
                damage = damageTable.calculateDamage(attackOB, melee, armor, self.attacker().size, self.flankAttack(), self.rearAttack(), self.surprised(), self.defender().stunned() > 0 || self.defender().knockedOut(), self.changedWeapon(), healthMalus, self.special());
            }
            else {
                damage = damageTable.calculateDamage(attackOB, melee, armor, self.flankAttack(), self.rearAttack(), self.surprised(), self.defender().stunned() > 0 || self.defender().knockedOut(), self.changedWeapon(), healthMalus, self.special());
            }


            self.attackResult(damage);

            var result = self.attackResult().damage;
            if (self.attackResult().critical) {
                self.attackResult().critical = minCritical(self.attackResult().critical, self.attacker().weapon.primaryCritical.max);
                result += ' ' + self.attackResult().critical;
            }

            self.attackResultText(result);

            //calculate primary critical
            if (self.attackResult().critical && self.primaryCriticalRoll() != "") {
                var critical, criticalTable;
                if (self.defender().size == 'large' || self.defender().size == 'huge') {
                    criticalTable = criticalTables["largeCreature"];
                    critical = criticalTable.calculateCritical(primaryCriticalRoll, self.weaponType(), self.attackResult().critical);
                }
                else {
                    criticalTable = criticalTables[self.attacker().weapon.primaryCritical.type];
                    critical = criticalTable.calculateCritical(primaryCriticalRoll, self.attackResult().critical);
                }
                self.primaryCriticalResult(critical);
                self.primaryCriticalResultText(critical.text);

                //calculate secondary critical
                if (self.secondaryCriticalRoll() != "" && self.attacker().weapon.secondaryCritical && self.attackResult().critical >= "C" && !(self.defender().size == 'large' || self.defender().size == 'huge')) {
                    var criticalType = minCritical(String.fromCharCode(self.attackResult().critical.charCodeAt(0) - 2), self.attacker().weapon.secondaryCritical.max);
                    criticalTable = criticalTables[self.attacker().weapon.secondaryCritical.type];
                    critical = criticalTable.calculateCritical(secondaryCriticalRoll, criticalType);

                    self.secondaryCriticalResult(critical);
                    self.secondaryCriticalResultText(critical.text);
                }
            }
        }
    }).extend({throttle: 500});

    /**
     * apply fight results to target
     */
    self.applyResults = function () {
        /**
         * evaluates result from object and applies them
         * @param object object to evaluate
         */
        function apply(object) {
            if (object.hits) {
                self.defender().hitsTaken(self.defender().hitsTaken() + object.hits);
            }

            if (object.hitsPerRound && !self.defender().bloodImmun) {
                self.defender().hitsPerRound(self.defender().hitsPerRound() + object.hitsPerRound);
            }

            if (object.activity) {
                if (typeof object.activity == "number") {
                    self.defender().bonus(self.defender().bonus() + object.activity);
                }
                else {
                    self.defender().bonusOverTime.push(self.primaryCriticalResult.activity);
                }
            }

            if (object.stunned && !self.defender().stunImmun) {
                self.defender().stunned(self.defender().stunned() + object.stunned);
                if (self.defender().done()) {
                    self.defender().stunned(self.defender().stunned() + 1);
                }
            }

            if (object.roundsTillDeath) {
                self.defender().roundsTillDeath(min(self.defender().roundsTillDeath(), object.roundsTillDeath));
            }
            if (object.knockedOut) {
                self.defender().knockedOut(object.knockedOut);
            }
        }

        /**
         * tries to find some specials like stunned when wearing no shield
         * @param object object to search through
         */
        function getSpecials(object) {
            if (object.shield && self.defender().shield) {
                apply(object.shield);
            }
            if (object.noShield && !self.defender().shield) {
                apply(object.noShield);
            }
            if (object.armGreaves && self.defender().armGreaves()) {
                apply(object.armGreaves);
            }
            if (object.noArmGreaves && !self.defender().armGreaves()) {
                apply(object.noArmGreaves);
            }
            if (object.legGreaves && self.defender().legGreaves()) {
                apply(object.legGreaves);
            }
            if (object.noLegGreaves && !self.defender().legGreaves()) {
                apply(object.noLegGreaves);
            }
            if (object.helmet && self.defender().helmet()) {
                apply(object.helmet);
            }
            if (object.noHelmet && !self.defender().helmet()) {
                apply(object.noHelmet);
            }
            if (object.armor && self.defender().armor) {
                apply(object.armor);
            }
            if (object.noArmor && !self.defender().armor) {
                apply(object.noArmor);
            }
            if (object.metalArmor && self.defender().armor) {
                if (self.defender().armor.armorType == "chain" || self.defender().armor.armorType == "plate") {
                    apply(object.metalArmor)
                }
            }

            if (object.noMetalArmor && self.defender().armor) {
                if (self.defender().armor.armorType == "softLeather" || self.defender().armor.armorType == "rigidLeather") {
                    apply(object.noMetalArmor)
                }
            }
            else if (object.noMetalArmor) {
                apply(object.noMetalArmor)
            }
        }

        if (self.attackResult() != "") {
            self.defender().hitsTaken(self.defender().hitsTaken() + self.attackResult().damage);
        }

        apply(self.primaryCriticalResult());
        getSpecials(self.primaryCriticalResult());
        apply(self.secondaryCriticalResult());
        getSpecials(self.secondaryCriticalResult());

        window.setTimeout(function () {
            self.reset();
            battleUI.endAttack(self.attacker())
        }, 1000);
    };

    self.cancelAttack = function () {
        self.reset();
        battleUI.cancelAttack(self.attacker());
    };

    self.reset = function () {
        self.fumble(false);
        self.flankAttack(false);
        self.rearAttack(false);
        self.surprised(false);
        self.changedWeapon(false);
        self.special(false);
        self.weaponType("regular");

        self.attackRoll(0);
        self.attackResult("");
        self.attackResultText("");

        self.primaryCriticalRoll(0);
        self.primaryCriticalResult("");
        self.primaryCriticalResultText("");

        self.secondaryCriticalRoll(0);
        self.secondaryCriticalResult("");
        self.secondaryCriticalResultText("");
    }
};

/**
 * represents and handles a magical attack
 * @param attacker o.O
 * @param defender o.O
 * @constructor
 */
MagicalAttack = function (attacker, defender) {
    var self = this;

    self.attacker = ko.observable(attacker);
    self.defender = ko.observable(defender);

    self.createAttack = function (attacker, defender) {
        self.attacker(attacker);
        self.defender(defender);
    };

    self.fumble = ko.observable(false);

    self.spellOB = ko.observable(0).extend({numeric: 0});
    self.preparedRounds = ko.observable(0).extend({numeric: 0});
    self.range = ko.observable(0).extend({numeric: 0});
    self.special = ko.observable(0).extend({numeric: 0});

    self.attackRoll = ko.observable(0).extend({numeric: 0});
    self.attackResult = ko.observable("");
    self.attackResultText = ko.observable("");

    self.primaryCriticalRoll = ko.observable(0).extend({numeric: 0});
    self.primaryCriticalResult = ko.observable("");
    self.primaryCriticalResultText = ko.observable("");

    self.secondaryCriticalRoll = ko.observable(0).extend({numeric: 0});
    self.secondaryCriticalResult = ko.observable("");
    self.secondaryCriticalResultText = ko.observable("");

    //advanced spell calculation attributes
    self.spellType = ko.observable("shockBolt");
    self.primarySpellCritical = ko.observable("electricity");
    self.secondarySpellCritical = ko.observable("none");
    /**
     * evaluates results in tables
     */
    self.calculateAttack = ko.computed(function () {
        var attackOB = self.attacker().cast(self.attackRoll()) + self.spellOB();
        var primaryCriticalRoll = self.primaryCriticalRoll();
        var secondaryCriticalRoll = self.secondaryCriticalRoll();

        //calculate attack Damage

        var damageTable;
        switch (self.spellType()) {
            case "shockBolt":
            case "waterBolt":
            case "iceBolt":
            case "fireBolt":
            case "lightningBolt":
                damageTable = damageTables["bolt"];
                if (self.attackRoll() <= 2) {
                    self.attackResultText("Fumble");
                    return;
                }
                break;

            case "coldBall":
            case "fireBall":
                damageTable = damageTables["ball"];
                if (self.attackRoll() <= 4) {
                    self.attackResultText("Fumble");
                    return;
                }
                break;
        }


        var armor = self.defender().armor ? self.defender().armor.armorType : "none";

        //determine OB bonus for spells against armor
        switch (armor) {
            case "plate":
                switch (self.spellType()) {
                    case "shockBolt":
                        attackOB += 10;
                        break;
                    case "waterBolt":
                        attackOB += -10;
                        break;
                    case "iceBolt":
                        attackOB += -5;
                        break;
                    case "lightningBolt":
                        attackOB += 10;
                        break;
                }
                break;
            case "chain":
                switch (self.spellType()) {
                    case "shockBolt":
                        attackOB += 10;
                        break;
                    case "lightningBolt":
                        attackOB += 10;
                        break;
                }
                break;
            case "rigidLeather":
                switch (self.spellType()) {
                    case "waterBolt":
                        attackOB += -10;
                        break;
                    case "iceBolt":
                        attackOB += -5;
                        break;
                }
                break;
        }

        var damage;
        if (damageTable instanceof BoltDamageTable) {
            damage = damageTable.calculateDamage(attackOB, armor, self.range(), self.special(), self.preparedRounds(), self.spellType());
        }
        else {
            damage = damageTable.calculateDamage(attackOB, armor, self.range(), self.special(), self.preparedRounds());
        }


        self.attackResult(damage);

        var result = self.attackResult().damage;
        if (self.attackResult().critical) {
            result += ' ' + self.attackResult().critical;
        }

        self.attackResultText(result);

        //calculate primary critical
        if (self.attackResult().critical && self.primaryCriticalRoll() != "") {
            var critical, criticalTable;
            if (self.defender().size == 'large' || self.defender().size == 'huge') {
                criticalTable = criticalTables["largeCreatureSpell"];
            }
            else {
                criticalTable = criticalTables[self.primarySpellCritical()];
            }
            critical = criticalTable.calculateCritical(primaryCriticalRoll, self.attackResult().critical);
            self.primaryCriticalResult(critical);
            self.primaryCriticalResultText(critical.text);

            //calculate secondary critical
            if (self.secondaryCriticalRoll() != "" && self.secondarySpellCritical() != "none" && self.attackResult().critical >= "C" && !(self.defender().size == 'large' || self.defender().size == 'huge')) {
                var criticalType = String.fromCharCode(self.attackResult().critical.charCodeAt(0) - 2);
                criticalTable = criticalTables[self.secondarySpellCritical()];
                critical = criticalTable.calculateCritical(secondaryCriticalRoll, criticalType);

                self.secondaryCriticalResult(critical);
                self.secondaryCriticalResultText(critical.text);

            }
        }
    }).extend({throttle: 500});

    /**
     * apply fight results to target
     */
    self.applyResults = function () {
        /**
         * evaluates result from object and applies them
         * @param object object to evaluate
         */
        function apply(object) {
            if (object.hits) {
                self.defender().hitsTaken(self.defender().hitsTaken() + object.hits);
            }

            if (object.hitsPerRound && !self.defender().bloodImmun) {
                self.defender().hitsPerRound(self.defender().hitsPerRound() + object.hitsPerRound);
            }

            if (object.activity) {
                if (typeof object.activity == "number") {
                    self.defender().bonus(self.defender().bonus() + object.activity);
                }
                else {
                    self.defender().bonusOverTime.push(self.primaryCriticalResult.activity);
                }
            }

            if (object.stunned && !self.defender().stunImmun) {
                self.defender().stunned(self.defender().stunned() + object.stunned);
                if (self.defender().done()) {
                    self.defender().stunned(self.defender().stunned());
                }
            }

            if (object.roundsTillDeath) {
                self.defender().roundsTillDeath(min(self.defender().roundsTillDeath(), object.roundsTillDeath));
            }
            if (object.knockedOut) {
                self.defender().knockedOut(object.knockedOut);
            }
        }

        /**
         * tries to find some specials like stunned when wearing no shield
         * @param object object to search through
         */
        function getSpecials(object) {
            if (object.shield && self.defender().shield) {
                apply(object.shield);
            }
            if (object.noShield && !self.defender().shield) {
                apply(object.noShield);
            }
            if (object.armGreaves && self.defender().armGreaves()) {
                apply(object.armGreaves);
            }
            if (object.noArmGreaves && !self.defender().armGreaves()) {
                apply(object.noArmGreaves);
            }
            if (object.legGreaves && self.defender().legGreaves()) {
                apply(object.legGreaves);
            }
            if (object.noLegGreaves && !self.defender().legGreaves()) {
                apply(object.noLegGreaves);
            }
            if (object.helmet && self.defender().helmet()) {
                apply(object.helmet);
            }
            if (object.noHelmet && !self.defender().helmet()) {
                apply(object.noHelmet);
            }
            if (object.armor && self.defender().armor) {
                apply(object.armor);
            }
            if (object.noArmor && !self.defender().armor) {
                apply(object.noArmor);
            }
            if (object.metalArmor && self.defender().armor) {
                if (self.defender().armor.armorType == "chain" || self.defender().armor.armorType == "plate") {
                    apply(object.metalArmor)
                }
            }

            if (object.noMetalArmor && self.defender().armor) {
                if (self.defender().armor.armorType == "softLeather" || self.defender().armor.armorType == "rigidLeather") {
                    apply(object.noMetalArmor)
                }
            }
            else if (object.noMetalArmor) {
                apply(object.noMetalArmor)
            }
        }

        //deactivated for simplified calculation
        if (typeof self.attackResult().damage == "number") {
            self.defender().hitsTaken(self.defender().hitsTaken() + self.attackResult().damage);
        }

        apply(self.primaryCriticalResult());
        getSpecials(self.primaryCriticalResult());
        apply(self.secondaryCriticalResult());
        getSpecials(self.secondaryCriticalResult());

        window.setTimeout(function () {
            self.reset();
            battleUI.endAttack(self.attacker())
        }, 1000);
    };

    self.cancelAttack = function () {
        self.reset();
        battleUI.cancelAttack(self.attacker());
    };

    self.reset = function () {
        self.special(0);
        self.spellOB (0);
        self.preparedRounds(0);
        self.range(0);
        self.special(0);


        self.attackRoll(0);
        self.attackResult("");
        self.attackResultText("");

        self.primaryCriticalRoll(0);
        self.primaryCriticalResult("");
        self.primaryCriticalResultText("");

        self.secondaryCriticalRoll(0);
        self.secondaryCriticalResult("");
        self.secondaryCriticalResultText("");
    }
};