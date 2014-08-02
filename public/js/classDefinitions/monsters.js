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
    self.weapon = dbMonster.weapon;
    self.armor = dbMonster.armor;
    self.shield = dbMonster.shield;
    self.helmet = JSON.parse(dbMonster.helmet);
    self.armGreaves = JSON.parse(dbMonster.armGreaves);
    self.legGreaves = JSON.parse(dbMonster.legGreaves);
    self.bloodImmun = JSON.parse(dbMonster.bloodImmun);
    self.stunImmun = JSON.parse(dbMonster.stunImmun);

    self.currentLevel = ko.observable(parseInt(dbMonster.level));
    self.currentHits = ko.observable(parseInt(dbMonster.hits));
    self.currentOB = ko.observable(parseInt(dbMonster.OB));
    self.currentDB = ko.observable(parseInt(dbMonster.DB));

    /**
     * scales monster up depending on currentLevel
     */
    function scaleUp() {
        self.currentHits(
                (self.hits / (self.level / (self.level + (self.currentLevel() - self.level) * 2 / 3) - 10 * (self.currentLevel() - self.level))) > (self.hits + 10) ?
                self.hits / (self.level / (self.level + (self.currentLevel() - self.level) * 2 / 3) - 10 * (self.currentLevel() - self.level)) :
                self.hits / (self.level / (self.level + (self.currentLevel() - self.level) * 2 / 3))
        );

        self.currentOB(
                self.OB / (self.level / (self.level + (self.currentLevel() - self.level) / 2)) - 7.5 * (self.currentLevel() - self.level) > (self.OB + 40) ?
                self.OB / (self.level / (self.level + (self.currentLevel() - self.level) / 2)) - 7.5 * (self.currentLevel() - self.level) :
                self.OB / (self.level / (self.level + (self.currentLevel() - self.level) / 2))
        );
        self.currentDB(self.DB + 2 * (self.currentLevel() - self.level));

    }

    /**
     * scales monster down depending on currentLevel
     */
    function scaleDown() {
        self.currentDB(self.DB + 2 * (self.currentLevel() - self.level));
        self.currentHits(self.hits * (self.currentLevel() / (self.level + (self.currentLevel() - self.level) * 2 / 3)));
        self.currentOB(self.OB * (self.currentLevel() / (self.level + (self.currentLevel() - self.level) / 10)));
    }

    /**
     * scales monsters attribute up or down depending on level difference
     * @param newLevel new level for the monster
     */
    function scale(newLevel) {
        self.currentLevel(newLevel);

        if (self.currentLevel > self.level) {
            scaleUp();
        }
        if (self.currentLevel < self.level) {
            scaleDown();
        }
    }

    //battle attributes

    //int attributes
    self.parryDB = ko.observable(0);
    self.blockDB = ko.observable(0);
    self.bonus = ko.observable(0);
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
        self.done(true);
    };

    /**
     * monster has special effect handles manual
     */
    self.other = function() {
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
        self.channeling(true);
    };

    /**
     * monster casts a spell
     * does much more when spells are implemented
     */
    self.cast = function() {
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
        if (roll <= self.weapon().fumbleRange) {
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

    /**
     * assigns ob to parry and block DB's
     * and reduces OB
     * @param parryAmount amount for parry
     * @param blockAmount amount for block
     */
    self.assignOB = function(parryAmount, blockAmount) {
        self.parryDB(parryAmount);
        self.blockDB(blockAmount);

        self.OB(self.OB() - parryAmount - blockAmount);
    };

    /**
     * trigger effects for next round
     */
    self.nextRound = function() {
        self.done(false);
        if (self.roundsTillDeath()) {
            if (self.roundsTillDeath() == 0) {
                self.currentHits(0);
            }
            else {
                self.roundsTillDeath(self.roundsTillDeath() - 1);
                self.currentHits(
                    self.currentHits() -
                        self.hitsPerRound()
                );
            }
        }
    }
};