/**
 * Created by Denny on 02.08.2014.
 */

Monster = function (dbMonster) {
    var self = this;
    self._id = dbMonster._id;
    self.type = dbMonster.type;
    self.description = dbMonster.description;
    self.size = dbMonster.size;
    self.level = parseInt(dbMonster.level);
    self.hits = parseInt(dbMonster.hits);
    self.OB = parseInt(dbMonster.OB);
    self.DB = parseInt(dbMonster.DB);
    self.MM = parseInt(dbMonster.MM);
    self.weaponName = dbMonster.weapon;
    self.armorName = dbMonster.armor;
    self.shieldName = dbMonster.shield;
    self.weapon = weapons[dbMonster.weapon];
    self.armor = armors[dbMonster.armor];
    self.shield = shields[dbMonster.shield];
    self.helmet = JSON.parse(dbMonster.helmet);
    self.armGreaves = JSON.parse(dbMonster.armGreaves);
    self.legGreaves = JSON.parse(dbMonster.legGreaves);
    self.bloodImmun = JSON.parse(dbMonster.bloodImmun);
    self.stunImmun = JSON.parse(dbMonster.stunImmun);

    self.blocking = ko.observable(false);
    self.currentAction = ko.observable("other");

    self.currentLevel = ko.observable(parseInt(dbMonster.level));
    self.currentHits = ko.observable(parseInt(dbMonster.hits));
    self.currentOB = ko.observable(parseInt(dbMonster.OB));
    self.currentDB = ko.observable(parseInt(dbMonster.DB));
    self.currentMM = ko.observable(parseInt(dbMonster.MM));

    /**
     * scales monster up depending on currentLevel
     */
    function scaleUp() {
        self.currentHits(Math.ceil(
                self.hits / (self.level / (self.level + (self.currentLevel() - self.level) * 1 / 5))
        ));

        self.currentOB(Math.ceil(
                self.OB / (self.level / (self.level + (self.currentLevel() - self.level) / 4))
        ));
        self.currentDB(min(self.DB + 2 * (self.currentLevel() - self.level), 75));

    }

    /**
     * scales monster down depending on currentLevel
     */
    function scaleDown() {
        self.currentDB(max(self.DB + 2 * (self.currentLevel() - self.level), 0));
        self.currentHits(Math.ceil(self.hits * (self.currentLevel() / (self.level + (self.currentLevel() - self.level) * 3 / 4))));
        self.currentOB(Math.ceil(self.OB * (self.currentLevel() / (self.level + (self.currentLevel() - self.level) * 9/10))));
    }

    /**
     * scales monsters attribute up or down depending on level difference
     * @param newLevel new level for the monster
     */
    self.scale = function(newLevel) {
        self.currentLevel(newLevel);

        if (self.currentLevel() > self.level) {
            scaleUp();
        } else if (self.currentLevel() < self.level) {
            scaleDown();
        }
        else {
            self.currentHits(self.hits);
            self.currentOB(self.OB);
            self.currentDB(self.DB);
            self.currentMM(self.MM);
        }
    };

    //battle attributes

    //int attributes
    self.parryDB = ko.observable(0);
    self.blockDB = ko.observable(0);
    self.bonus = ko.observable(0);
    self.hitsTaken = ko.observable(0);
    self.hitsPerRound = ko.observable(0);
    self.roundsTillDeath = ko.observable(undefined);
    self.stunned = ko.observable(0);

    //bool attributes
    self.done = ko.observable(false);
    self.knockedOut = ko.observable(false);
    self.prepared = ko.observable(false);
    self.channeling = ko.observable(false);

    //target
    self.attackTarget = ko.observable(undefined);
    self.blockTarget = ko.observable(undefined);

    //battle methods

    /**
     * monster moves in battle
     */
    self.move = function() {
        self.prepared = false;
        self.done(true);
    };

    /**
     * monster has special effect handles manual
     */
    self.other = function() {
        self.prepared = false;
        self.done(true);
    };

    /**
     * monster prepares for fight
     */
    self.prepare = function() {
        self.prepared(true);
    };

    /**
     * monster channels spell
     */
    self.channel = function() {
        self.prepared = false;
        self.channeling(true);
        self.done(true);
    };

    /**
     * monster casts a spell
     * does much more when spells are implemented
     */
    self.cast = function() {
        self.prepared = false;
        self.done(true);
    };

    /**
     * monster attacks his attackTarget if there is one
     * determines if attack was a fumble
     * and calculates resulting ob
     * @param roll dice roll
     * @returns {void | string | number}
     */
    self.attack = function(roll) {
        self.prepared = false;
        if (roll <= self.weapon.fumbleRange) {
            return "fumble";
        }
        var attackOB = roll + self.currentOB();
        if (self.attackTarget()) {
            var defender = self.attackTarget();

            attackOB = defender.defend(attackOB);

            if (defender.attackTarget()._id == self._id) {
                attackOB = defender.parry(attackOB);
            }
            if (defender.blockTarget()._id == self._id) {
                attackOB = defender.block(attackOB);
            }

            attackOB = max(9, attackOB);

            return attackOB;
        }
        self.done(true);
    };

    /**
     * monster defends attacker
     * @param enemyOB attack OB Bonus
     * @returns {number} resultingOB
     */
    self.defend = function(enemyOB) {
        return enemyOB - self.currentDB();
    };

    /**
     * monster parries attacker
     * @param enemyOB attack OB Bonus
     * @returns {number} resultingOB
     */
    self.parry = function(enemyOB) {
        return enemyOB - self.parryDB();
    };

    /**
     * monster blocks attacker
     * @param enemyOB attack OB Bonus
     * @returns {number} resultingOB
     */
    self.block = function(enemyOB) {
        return enemyOB - self.blockDB();
    };

    self.getMaxParryAssignment = ko.computed(function() {
        var amount = 0;
        if (self.weapon.attackType == 'twoHanded') {
            amount = Math.ceil(self.currentOB / 2);
        }
        else {
            amount = self.currentOB();
        }

        return amount - self.blockDB();
    });

    self.getMaxBlockAssignment = ko.computed(function() {
        var amount = 0;
        if (self.blockTarget()) {
            if (self.blockTarget().weapon.attackType == 'missile') {
                amount =  Math.ceil(self.currentOB / 2);
            }
            else {
                amount = self.currentOB();
            }
        }

        return amount - self.parryDB();
    });

    /**
     * trigger effects for next round
     */
    self.nextRound = function() {
        self.done(false);

        if (self.roundsTillDeath()) {
            if (self.roundsTillDeath() == 0) {
                self.hitsTaken(self.currentHits());
            }
            else {
                self.roundsTillDeath(self.roundsTillDeath() - 1);
                self.hitsTaken(
                    self.hitsTaken() +
                        self.hitsPerRound()
                );
            }
        }
    }
};