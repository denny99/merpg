/**
 * Created by Denny on 04.08.2014.
 */

BattleLog = function () {
	var self = this;

	self.test = "test";

	self.quickMonsterEditor = new QuickMonsterEditor();

	self.addMonster = function () {
		self.removeCombatant(self.quickMonsterEditor.loadedMonster());

		self.battleLogEntries.push(self.quickMonsterEditor.loadedMonster());
		self.battleLogEntries.sort(sort_by("_id", true, function (a) {
			return a.toUpperCase();
		}));

		self.quickMonsterEditor.closeQuickEditor();
	};

	self.battleLogEntries = ko.observableArray();
	/**
	 * removes combatant from battle
	 * @param data combatant
	 */
	self.removeCombatant = function (data) {
		self.battleLogEntries.remove(data);
	};

	/**
	 * triggers next action in fight
	 */
	self.nextAction = function () {
		//start next round
		self.battleLogEntries().forEach(function (combatant) {
			combatant.nextRound();
		});

	};

	self.editExistingMonster = function (data) {
		self.quickMonsterEditor.loadedMonster(data);
		self.quickMonsterEditor.level(data.level);
	}
};


var battleLog = new BattleLog();

ko.applyBindings(battleLog, document.getElementById('battleLog'));