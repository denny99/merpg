/**
 * Created by Denny on 04.08.2014.
 */

/**
 * view modal for monster add modal
 * @constructor
 */
QuickMonsterEditor = function () {
    var self = this;

    self.maxHits = 450;
    self.maxOB = 240;
    self.maxDB = 75;
    self.maxMM = 50;

    self.loadedMonster = ko.observable(undefined);
    self.level = ko.observable(undefined);
    self.selectedMonster = ko.observable('');
    self.loadSelectedMonster = function () {
        self.loadedMonster(new Monster(owl.deepCopy(monsters[self.selectedMonster()].original)));
        self.level(self.loadedMonster().level);
    };

    self.closeQuickEditor = function() {
        self.loadedMonster(undefined);
        self.level(undefined);
    };

    self.compareHits = ko.computed(function () {
        if (self.loadedMonster()) {
            return self.loadedMonster().currentHits() / self.maxHits * 100 + "%";
        }
    });
    self.compareOB = ko.computed(function () {
        if (self.loadedMonster()) {
            return self.loadedMonster().currentOB() / self.maxOB * 100 + "%";
        }
    });
    self.compareDB = ko.computed(function () {
        if (self.loadedMonster()) {
            return self.loadedMonster().currentDB() / self.maxDB * 100 + "%";
        }
    });
    self.compareMM = ko.computed(function () {
        if (self.loadedMonster()) {
            if (parseInt(self.loadedMonster().currentMM()) >= 0) {
                return (parseInt(self.loadedMonster().currentMM())) / (self.maxMM ) * 100 + "%";
            }
            else {
                return "0%";
            }
        }
    });

    /**
     * scales monster stats on level change
     * @type {*|void}
     */
    self.scaleOnChange = ko.computed(function () {
        if (self.loadedMonster()) {
            self.loadedMonster().scale(self.level());
        }
    }).extend(
        {throttle: 500}
    );
};

BattleUI = function () {
    var self = this;

    self.test = "test";

    self.quickMonsterEditor = new QuickMonsterEditor();

    self.addMonster = function () {
        self.removeCombatant(self.quickMonsterEditor.loadedMonster());

        self.battleLogEntries.push(self.quickMonsterEditor.loadedMonster());
        self.battleLogEntries.sort(sort_by("_id", true, function (a) {
            return a.toUpperCase();
        }));
        self.otherCombatants.push(self.quickMonsterEditor.loadedMonster());

        self.quickMonsterEditor.closeQuickEditor();
    };

    self.battleLogEntries = ko.observableArray();
    self.castingCombatants = ko.observableArray();
    self.missileCombatants = ko.observableArray();
    self.meleeCombatants = ko.observableArray();
    self.movingCombatants = ko.observableArray();

    self.otherCombatants = ko.observableArray();

    /**
     * builds up process queue
     * @type {*|void}
     */
    self.battleCombatants = ko.computed(function () {
        self.castingCombatants.sort(sort_by("_id", true));
        self.castingCombatants.sort(sort_by("prepared", false, function (a) {
            return a();
        }));

        self.missileCombatants.sort(sort_by("_id", true));
        self.missileCombatants.sort(sort_by("prepared", false, function (a) {
            return a();
        }));

        self.movingCombatants.sort(sort_by("currentMM", false, function (a) {
            return a();
        }));
        self.movingCombatants.sort(sort_by("prepared", false, function (a) {
            return a();
        }));

        self.meleeCombatants.sort(sort_by("currentMM", false, function (a) {
            return a();
        }));
        self.meleeCombatants.sort(sort_by("prepared", false, function (a) {
            return a();
        }));

        self.otherCombatants.sort(sort_by("_id", true));
        var list = self.castingCombatants().concat(self.missileCombatants(), self.movingCombatants(), self.meleeCombatants(), self.otherCombatants());
        list.sort(sort_by("done", true, function (a) {
            return a();
        }));

        return list;
    });

    /**
     * removes combatant from battle
     * @param data combatant
     */
    self.removeCombatant = function (data) {
        self.battleLogEntries.remove(data);
        self.removeFromBattleArrays(data);
    };

    /**
     * removes combatant from battle array, required for changing combatants action
     * @param data combatant
     */
    self.removeFromBattleArrays = function (data) {
        self.castingCombatants.remove(data);
        self.missileCombatants.remove(data);
        self.meleeCombatants.remove(data);
        self.movingCombatants.remove(data);
        self.otherCombatants.remove(data);
    };

    /**
     * rearrange arrays after selecting an action for combatant
     * @type {*|void}
     */
    self.rearrangeArrays = ko.computed(function () {
        var list = self.battleCombatants();
        list.forEach(function (combatant) {
            switch (combatant.currentAction()) {
                case "missileAttack":
                    self.removeFromBattleArrays(combatant);
                    self.missileCombatants.push(combatant);
                    break;
                case "meleeAttack":
                    self.removeFromBattleArrays(combatant);
                    self.meleeCombatants.push(combatant);
                    break;
                case "cast":
                    self.removeFromBattleArrays(combatant);
                    self.castingCombatants.push(combatant);
                    break;
                case "move":
                    self.removeFromBattleArrays(combatant);
                    self.movingCombatants.push(combatant);
                    break;
                case "prepare":
                case "other":
                    self.removeFromBattleArrays(combatant);
                    self.otherCombatants.push(combatant);
                    break;
                default:
                    break;
            }
        });
    });

    /**
     * triggers next action in fight
     */
    var firstTime = true;
    self.nextAction = function () {
        if (firstTime) {
            self.battleCombatants().forEach(function (combatant) {
                combatant.decided(true);
            });
        }
        firstTime = false;
        var combatant = self.battleCombatants()[0];
        if (!combatant.done()) {
            switch (combatant.currentAction()) {
                case "meleeAttack":
                case "missileAttack":
                case "cast":
                    if (combatant.stunned() == 0) {
                        self.openAttackUI(combatant);
                    }
                    else {
                        combatant.done(true);
                    }
                    break;
                case "move":
                    combatant.move();
                    break;
                case "prepare":
                    combatant.prepare();
                    break;
                case "other":
                    combatant.other();
                    break;
                default:
                    break;
            }
        }
        else {
            //start next round
            firstTime = true;
            self.battleCombatants().forEach(function (combatant) {
                combatant.nextRound();
            });
        }
    };

    self.physicalAttackUIActive = ko.observable(false);
    self.magicalAttackUIActive = ko.observable(false);
    self.physicalAttack = ko.observable("");
    self.magicalAttack = ko.observable("");

    /**
     * opens attack UI for calculating dealt damage
     */
    self.openAttackUI = function (combatant) {
        if (combatant.currentAction() == "cast") {
            self.magicalAttackUIActive(true);
            self.magicalAttack(new MagicalAttack(combatant, combatant.attackTarget()));
        }
        else {
            self.physicalAttackUIActive(true);
            self.physicalAttack(new PhysicalAttack(combatant, combatant.attackTarget()));
        }
    };

    var cancelMalus = {
        bonus: -30,
        duration: 1
    };

    /**
     * cancles attack and adds malus of -30
     * @param combatant attacker
     */
    self.cancelAttack = function (combatant) {
        if (combatant.currentAction() == "cast") {
            self.magicalAttackUIActive(false);
            self.magicalAttack().attacker().bonusOverTime.remove(cancelMalus);
            self.magicalAttack().attacker().bonusOverTime.push(cancelMalus);
            self.magicalAttack("");
        }
        else {
            self.physicalAttackUIActive(false);
            self.physicalAttack().attacker().bonusOverTime.remove(cancelMalus);
            self.physicalAttack().attacker().bonusOverTime.push(cancelMalus);
            self.physicalAttack("");
        }
    };

    /**
     * ends fight and sets attacker on done
     * @param combatant attacker
     */
    self.endAttack = function (combatant) {
        if (combatant.currentAction() == "cast") {
            self.magicalAttackUIActive(false);
            self.magicalAttack().attacker().done(true);
            self.magicalAttack("");
        } else {
            self.physicalAttackUIActive(false);
            self.physicalAttack().attacker().done(true);
            self.physicalAttack("");
        }
    };

    self.editExistingMonster = function (data) {
        self.quickMonsterEditor.loadedMonster(data);
        self.quickMonsterEditor.level(data.level);
    }
};


var battleUI = new BattleUI();

ko.applyBindings(battleUI, document.getElementById('battleUI'));