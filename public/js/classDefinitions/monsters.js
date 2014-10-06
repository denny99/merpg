/**
 * Created by Denny on 02.08.2014.
 */

/**
 * A Mers Monster
 * @param dbMonster dbMonster Object
 * @param [session] optional sessionObject
 * @constructor
 */
Monster = function (dbMonster, session) {
	var self = this;

	self.original = dbMonster;

	self._id = dbMonster._id;
	self.type = dbMonster.type;
	self.description = dbMonster.description;
	self.size = dbMonster.size;
	self.level = parseInt(dbMonster.level);
	self.hits = parseInt(dbMonster.hits);
	self.OB = parseInt(dbMonster.OB);
	self.DB = parseInt(dbMonster.DB);
	self.MM = parseInt(dbMonster.MM);
	self.weaponName = ko.observable(dbMonster.weapon);
	self.armorName = ko.observable(dbMonster.armor);
	self.shieldName = ko.observable(dbMonster.shield);
	self.helmet = ko.observable(JSON.parse(dbMonster.helmet));
	self.armGreaves = ko.observable(JSON.parse(dbMonster.armGreaves));
	self.legGreaves = ko.observable(JSON.parse(dbMonster.legGreaves));
	self.bloodImmun = JSON.parse(dbMonster.bloodImmun);
	self.stunImmun = JSON.parse(dbMonster.stunImmun);
	self.weapon = weapons[dbMonster.weapon];
	self.weaponChange = ko.computed(function () {
		self.weapon = weapons[self.weaponName()];
	});
	self.armor = armors[dbMonster.armor];
	self.armorChange = ko.computed(function () {
		self.armor = armors[self.armorName()];
		if (self.armor) {
			self.armor = armors[self.armorName()];
			self.helmet(self.armor.helmet || self.helmet());
			self.armGreaves(self.armor.armGreaves || self.armGreaves());
			self.legGreaves(self.armor.legGreaves || self.legGreaves());
		}
	});
	self.shield = shields[dbMonster.shield];
	self.shieldChange = ko.computed(function () {
		self.shield = shields[self.shieldName()];
	});

	self.blocking = ko.observable(false);
	self.currentAction = ko.observable("other");

	//log attributes
	self.currentLevel = ko.observable(dbMonster.level).extend({numeric: 0});
	self.currentHits = ko.observable(dbMonster.hits).extend({numeric: 0});
	self.currentOB = ko.observable(dbMonster.OB).extend({numeric: 0});
	self.currentDB = ko.observable(dbMonster.DB).extend({numeric: 0});
	self.currentMM = ko.observable(dbMonster.MM).extend({numeric: 0});
	self.bonus = ko.observable(0).extend({numeric: 0});
	self.bonusOverTime = ko.observableArray([]);
	self.hitsTaken = ko.observable(0).extend({numeric: 0});
	self.hitsPerRound = ko.observable(0).extend({numeric: 0});
	self.roundsTillDeath = ko.observable(undefined).extend({intOrNull: 0});
	self.stunned = ko.observable(0).extend({numeric: 0});

	self.convertToSession = function () {
		var session = {};
		session._id = self.original._id;
		session.name = self._id;
		session.manualOverwrite(self.manualOverwrite());
		session.currentLevel = self.currentLevel();
		session.currentHits = self.currentHits();
		session.currentOB = self.currentOB();
		session.currentDB = self.currentDB();
		session.currentMM = self.currentMM();
		session.bonus = self.bonus();
		session.bonusOverTime = self.bonusOverTime();
		session.hitsTaken = self.hitsTaken();
		session.hitsPerRound = self.hitsPerRound();
		session.roundsTillDeath = self.roundsTillDeath();
		session.stunned = self.stunned();
		return session;
	};
	self.restoreFromSession = function (session) {
		self._id = session.name;
		self.manualOverwrite(session.manualOverwrite);
		self.currentLevel(session.currentLevel);
		self.currentHits(session.currentHits);
		self.currentOB(session.currentOB);
		self.currentDB(session.currentDB);
		self.currentMM(session.currentMM);
		self.bonus(session.bonus);
		self.bonusOverTime(session.bonusOverTime);
		self.hitsTaken(session.hitsTaken);
		self.hitsPerRound(session.hitsPerRound);
		self.roundsTillDeath(session.roundsTillDeath);
		self.stunned(session.stunned);
	};

	self.manualOverwrite = ko.observable(false);
	self.decided = ko.observable(false);

	/**
	 * scales monster up depending on currentLevel
	 */
	function scaleUp() {
		self.currentHits(Math.ceil(
				self.hits / (self.level / (self.level + (self.currentLevel() - self.level) / 5))
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
		self.currentOB(Math.ceil(self.OB * (self.currentLevel() / (self.level + (self.currentLevel() - self.level) * 9 / 10))));
	}

	/**
	 * scales monsters attribute up or down depending on level difference
	 * @param newLevel new level for the monster
	 */
	self.scale = function (newLevel) {
		if (!self.manualOverwrite()) {
			self.currentLevel(newLevel);

			if (self.currentLevel() > self.level) {
				scaleUp();
			}
			else if (self.currentLevel() < self.level) {
				scaleDown();
			}
			else {
				self.currentHits(self.hits);
				self.currentOB(self.OB);
				self.currentDB(self.DB);
				self.currentMM(self.MM);
			}
		}
	};

	//battle attributes

	//int attributes
	self.parryDB = ko.observable(0).extend({numeric: 0});
	self.blockDB = ko.observable(0).extend({numeric: 0});

	//bool attributes
	self.done = ko.observable(false);
	self.knockedOut = ko.observable(false);
	self.prepared = ko.observable(false);
	self.channeling = ko.observable(false);
	self.dead = ko.computed(function () {
		return self.hitsTaken() >= self.currentHits();
	});
	self.setDone = ko.computed(function () {
		if (self.knockedOut() || self.roundsTillDeath() == 0) {
			self.parryDB(0);
			self.blockDB(0);
			self.done(true);
		}
	});

	//target
	self.attackTarget = ko.observable(undefined);
	self.blockTarget = ko.observable(undefined);

	//battle methods

	/**
	 * monster moves in battle
	 */
	self.move = function () {
		self.prepared(false);
		self.done(true);
	};

	/**
	 * monster has special effect handles manual
	 */
	self.other = function () {
		self.prepared(false);
		self.done(true);
	};

	/**
	 * monster prepares for fight
	 */
	self.prepare = function () {
		self.prepared(true);
		self.done(true);
	};

	/**
	 * monster channels spell
	 */
	self.channel = function () {
		self.prepared(false);
		self.channeling(true);
		self.done(true);
	};

	/**
	 * monster casts a spell
	 * does much more when spells are implemented
	 * @param roll dice roll
	 */
	self.cast = function (roll) {
		self.prepared(false);
		var attackOB = roll;
		var defender = self.attackTarget();

		self.bonusOverTime().forEach(function (bonus) {
			attackOB += bonus.bonus;
		});

		return defender.defend(attackOB);
	};

	/**
	 * monster attacks his attackTarget if there is one
	 * determines if attack was a fumble
	 * and calculates resulting ob
	 * @param roll dice roll
	 * @returns {void | string | number}
	 */
	self.attack = function (roll) {
		self.prepared(false);
		if (roll <= self.weapon.fumbleRange) {
			return "fumble";
		}
		var attackOB = roll + self.currentOB() + self.bonus() - self.parryDB() - self.blockDB();

		self.bonusOverTime().forEach(function (bonus) {
			attackOB += bonus.bonus;
		});

		if (self.attackTarget()) {
			var defender = self.attackTarget();

			attackOB = defender.defend(attackOB);

			if (defender.attackTarget()._id == self._id) {
				attackOB = defender.parry(attackOB);
			}
			if (defender.blockTarget()._id == self._id) {
				attackOB = defender.block(attackOB);
			}

			var armor = self.attackTarget().armor ? self.attackTarget().armor.armorType : "none";
			attackOB += self.weapon.OBBonus[armor];

			attackOB = max(9, attackOB);

			return attackOB;
		}
	};

	/**
	 * monster defends attacker
	 * @param enemyOB attack OB Bonus
	 * @returns {number} resultingOB
	 */
	self.defend = function (enemyOB) {
		return enemyOB - self.currentDB();
	};

	/**
	 * monster parries attacker
	 * @param enemyOB attack OB Bonus
	 * @returns {number} resultingOB
	 */
	self.parry = function (enemyOB) {
		return enemyOB - self.parryDB();
	};

	/**
	 * monster blocks attacker
	 * @param enemyOB attack OB Bonus
	 * @returns {number} resultingOB
	 */
	self.block = function (enemyOB) {
		return enemyOB - self.blockDB();
	};

	self.getMaxParryAssignment = ko.computed(function () {
		var amount = 0;
		if (self.weapon.attackType == 'twoHanded' || self.stunned() > 0) {
			amount = Math.ceil(self.currentOB() / 2);
		}
		else {
			amount = self.currentOB();
		}

		return amount - self.blockDB();
	});

	self.getMaxBlockAssignment = ko.computed(function () {
		var amount = 0;
		if (self.blockTarget()) {
			if (self.blockTarget().weapon.attackType == 'missile' || self.stunned() > 0) {
				amount = Math.ceil(self.currentOB() / 2);
			}
			else {
				amount = self.currentOB();
			}
		}

		return amount - self.parryDB();
	});

	self.attackTargetChange = ko.computed(function () {
		if (self.attackTarget()) {
			self.parryDB(0);
		}
	});
	self.blockTargetChange = ko.computed(function () {
		if (self.blockTarget()) {
			self.blockDB(0);
		}
	});
	self.getsStunned = ko.computed(function () {
		if (self.stunned() > 0 && (self.currentAction() == "cast")) {
			self.currentAction("other");
		}
	}).extend({throttle: 2000});

	/**
	 * trigger effects for next round
	 */
	self.nextRound = function () {
		self.decided(false);

		if (!self.knockedOut()) {
			self.done(false);
		}

		var list = self.bonusOverTime();
		list.forEach(function (bonus) {
			bonus.duration--;
			if (bonus.duration == 0) {
				self.bonusOverTime.remove(bonus);
			}
		});

		if (self.stunned() > 0) {
			self.stunned(self.stunned() - 1);
		}

		if (self.roundsTillDeath() != undefined) {
			if (self.roundsTillDeath() == 0) {
				self.hitsTaken(self.currentHits());
			}
			else {
				self.roundsTillDeath(self.roundsTillDeath() - 1);
			}
		}

		self.hitsTaken(
				self.hitsTaken() +
				self.hitsPerRound()
		);
	};

	if (session) {
		self.restoreFromSession(session)
	}
};