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

	self.counterSpeed = ko.observable(10).extend({numeric: 0});

	var clock = new FlipClock($('.clock'), {
		autoStart    : false,
		language     : "german",
		interval     : self.counterSpeed() * 100,
		animationRate: self.counterSpeed() * 100
	});
	self.clock = ko.computed(function () {
		var running = clock.running;
		clock.stop();
		clock.setOption("interval", self.counterSpeed() * 100);
		clock.face.setOption("interval", self.counterSpeed() * 100);
		clock.timer.setOption("interval", self.counterSpeed() * 100);
		clock.setOption("animationRate", self.counterSpeed() * 100);
		clock.face.setOption("animationRate", self.counterSpeed() * 100);
		clock.timer.setOption("animationRate", self.counterSpeed() * 100);
		if (running) {
			clock.start();
		}
		return clock;
	}).extend({
		          throttle: 3000
	          });

	self.startCounter = function () {
		self.clock().start();
	};

	self.stopCounter = function () {
		self.clock().stop()
	};

	self.resetCounter = function () {
		self.clock().setTime(0);
		self.clock().stop();
	};

	self.resetValue = function (attr, monster) {
		switch (attr) {
			case "hitsTaken":
				monster.hitsTaken(0);
				break;
			case "hitsPerRound":
				monster.hitsPerRound(0);
				break;
			case "stunned":
				monster.stunned(0);
				break;
			case "roundsTillDeath":
				monster.roundsTillDeath(undefined);
				break;
			case "bonus":
				monster.bonus(0);
				break;
		}
	};

	self.addValue = function (attr, monster) {
		switch (attr) {
			case "hitsTaken":
				monster.hitsTaken(monster.hitsTaken() + 1);
				break;
			case "hitsPerRound":
				monster.hitsPerRound(monster.hitsPerRound() + 1);
				break;
			case "stunned":
				monster.stunned(monster.stunned() + 1);
				break;
			case "roundsTillDeath":
				if (monster.roundsTillDeath() == undefined) {
					monster.roundsTillDeath(0);
				}
				monster.roundsTillDeath(monster.roundsTillDeath() + 1);
				break;
			case "bonus":
				monster.bonus(monster.bonus() + 5);
				break;
		}
	};

	self.subtractValue = function (attr, monster) {
		switch (attr) {
			case "hitsTaken":
				monster.hitsTaken(monster.hitsTaken() - 1);
				break;
			case "hitsPerRound":
				monster.hitsPerRound(monster.hitsPerRound() - 1);
				break;
			case "stunned":
				monster.stunned(monster.stunned() - 1);
				break;
			case "roundsTillDeath":
				console.log(monster.roundsTillDeath());
				if (monster.roundsTillDeath() - 1 <= 0) {
					monster.roundsTillDeath(undefined);
				}
				else {
					monster.roundsTillDeath(monster.roundsTillDeath() - 1);
				}
				break;
			case "bonus":
				monster.bonus(monster.bonus() - 5);
				break;
		}
	};

	self.saveSession = function () {
		var data = {
			monsters: []
		};
		self.battleLogEntries().forEach(function (monster) {
			data.monsters.push(monster.convertToSession());
		});
		$.ajax({
			       url       : "/api_v1.0/session/save",
			       data      : data,
			       beforeSend: function () {
				       //console.log(type + " loading...");
			       },
			       success   : function (data, status, jqXHR) {
				       alert("Gespeichert!")
			       }
		       }).done(function () {
			//console.log(type + " loaded.");
		});
	};

	self.loadSession = function () {
		self.battleLogEntries([]);
		$.ajax({
			       url       : "/api_v1.0/session/load",
			       beforeSend: function () {
				       //console.log(type + " loading...");
			       },
			       success   : function (data, status, jqXHR) {
				       data.monsters.forEach(function (session) {
					       var monster = new Monster(owl.deepCopy(monsters[session._id].original), session);
					       self.battleLogEntries.push(monster);
				       })
			       }
		       }).done(function () {
			//console.log(type + " loaded.");
		});
	}
};


var battleLog = new BattleLog();

ko.applyBindings(battleLog, document.getElementById('battleLog'));