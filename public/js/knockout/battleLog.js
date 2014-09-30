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
	};

	self.counterSpeed = ko.observable(1).extend({numeric: 0});

	var clock = new FlipClock($('.clock'), {
		autoStart    : false,
		language     : "german",
		interval     : self.counterSpeed() * 1000,
		animationRate: self.counterSpeed() * 1000
	});
	self.clock = ko.computed(function () {
		clock.stop();
		clock.setTime(0);
		clock.setOption("interval", self.counterSpeed() * 1000);
		clock.face.setOption("interval", self.counterSpeed() * 1000);
		clock.timer.setOption("interval", self.counterSpeed() * 1000);
		clock.setOption("animationRate", self.counterSpeed() * 1000);
		clock.face.setOption("animationRate", self.counterSpeed() * 1000);
		clock.timer.setOption("animationRate", self.counterSpeed() * 1000);
		return clock;
	});

	self.startCounter = function () {
		self.clock().start();
	};

	self.stopCounter = function () {
		self.clock().stop()
	};

	self.resetCounter = function () {
		self.clock().setTime(0);
	}
};


var battleLog = new BattleLog();

ko.applyBindings(battleLog, document.getElementById('battleLog'));