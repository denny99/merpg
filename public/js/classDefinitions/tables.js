/**
 * Created by Denny on 31.07.2014.
 */

/**
 * Object representing a mers damage table
 * @param name db name of table
 * @param content table content
 */
DamageTable = function (name, content) {
    this.name = name;
    this.content = content;

    /**
     * calculates roll result depending on mods and returns amount of damage and critical type
     * @param roll dice roll
     * @param melee attack was a melee attack or not
     * @param armor armor type of defender
     * @param flankAttack attack was a flank attack
     * @param rearAttack attack was a attack from behind
     * @param defenderSurprised defender was surprised
     * @param defenderStunned defender was stunned or down
     * @param attackerChangedWeapons attacker changed his weapon
     * @param healthMalus
     * @param special
     * @returns {JSON}
     */
    this.calculateDamage = function (roll, melee, armor, flankAttack, rearAttack, defenderSurprised, defenderStunned, attackerChangedWeapons, healthMalus, special) {
        var result = roll;

        //apply mods
        if (flankAttack && !rearAttack && melee) {
            result += 15;
        }
        if (rearAttack && !flankAttack && melee) {
            result += 20;
        }
        if (defenderSurprised && melee) {
            result += 20;
        }
        if (defenderStunned) {
            result += 20;
        }
        if (attackerChangedWeapons) {
            result -= 30;
        }
        if (healthMalus) {
            result -= 20;
        }
        if (special) {
            result += special;
        }

        return content[min(max(result, 9), 150)][armor];
    }

};

/**
 * Object representing a mers critical table
 * @param name db name of table
 * @param content table content
 */
CriticalTable = function (name, content) {
    this.name = name;
    this.content = content;

    /**
     * calculate critical effects based on table content
     * @param roll dice roll
     * @param critical critical type
     * @returns {JSON}
     */
    this.calculateCritical = function (roll, critical) {
        var result = roll;

        //apply mod for critical
        switch (critical) {
            case "T":
                result += -50;
                break;
            case "A":
                result += -20;
                break;
            case "B":
                result += -10;
                break;
            case "C":
                result += 0;
                break;
            case "D":
                result += 10;
                break;
            case "E":
                result += 20;
                break;
            default:
                break;
        }
        return content[result];
    }
};

/**
 * Object representing a mers damage table for creatures
 * @param name db name of table
 * @param content table content
 */
CreatureDamageTable = function (name, content) {
    this.name = name;
    this.content = content;

    /**
     * calculates roll result depending on mods and returns amount of damage and critical type
     * @param roll dice roll
     * @param melee attack was a melee attack or not
     * @param armor armor type of defender
     * @param attackSize attack size of the creature
     * @param flankAttack attack was a flank attack
     * @param rearAttack attack was a attack from behind
     * @param defenderSurprised defender was surprised
     * @param defenderStunned defender was stunned or down
     * @param attackerChangedWeapons attacker changed his weapon
     * @param healthMalus
     * @param special
     * @returns {JSON}
     */
    this.calculateDamage = function (roll, melee, armor, attackSize, flankAttack, rearAttack, defenderSurprised, defenderStunned, attackerChangedWeapons, healthMalus, special) {
        var result = roll;
        //apply mods
        if (flankAttack && !rearAttack && melee) {
            result += 15;
        }
        if (rearAttack && !flankAttack && melee) {
            result += 20;
        }
        if (defenderSurprised && melee) {
            result += 20;
        }
        if (defenderStunned) {
            result += 20;
        }
        if (attackerChangedWeapons) {
            result -= 30;
        }
        if (healthMalus) {
            result -= 20;
        }
        if (special) {
            result += special;
        }

        //determine attack caps
        switch (attackSize) {
            case "tiny":
            {
                result = min(85, result);
                break;
            }
            case "small":
            {
                result = min(105, result);
                break;
            }
            case "normal":
            {
                result = min(120, result);
                break;
            }
            case "large":
            {
                result = min(135, result);
                break;
            }
            case "huge":
            {
                result = min(150, result);
                break;
            }
            default:
                result = min(150, result);
                break;
        }

        return content[max(result, 9)][armor];
    }

};

/**
 * Object representing a mers damage table for ball spells
 * @param name db name of table
 * @param content table content
 */
BallDamageTable = function (name, content) {
    this.name = name;
    this.content = content;

    /**
     * calculates roll result depending on mods and returns amount of damage and critical type
     * @param roll dice roll
     * @param armor armor type of defender
     * @param range distance between target and attacker
     * @param preparedRounds number of rounds the attacker has spent to prepare the spells
     * @param special
     * @returns {JSON | object}
     */
    this.calculateDamage = function (roll, armor, range, special, preparedRounds) {
        var result = roll;
        //apply mods
        if (roll <= 4) {
            return {
                damage: "F"
            };
        }

        if (roll < 97) {
            switch (preparedRounds) {
                case 4:
                    result += 20;
                    break;
                case 3:
                    result += 10;
                    break;
                case 2:
                    result += 0;
                    break;
                case 1:
                    result += -15;
                    break;
                case 0:
                    result += -30;
                    break;
            }


            if (range < 3) {
                result += 35;
            } else if (range < 15) {
                result += 0;
            } else if (range < 30) {
                result += -20;
            } else if (range < 60) {
                result += -40;
            } else if (range < 100) {
                result += -55;
            } else {
                result += -75;
            }

            if (special) {
                result += special;
            }
        }

        return content[max(min(result, 100), 9)][armor];
    }

};

/**
 * Object representing a mers damage table for bolt spells
 * @param name db name of table
 * @param content table content
 */
BoltDamageTable = function (name, content) {
    this.name = name;
    this.content = content;

    /**
     * calculates roll result depending on mods and returns amount of damage and critical type
     * @param roll dice roll
     * @param armor armor type of defender
     * @param range distance between target and attacker
     * @param preparedRounds number of rounds the attacker has spent to prepare the spells
     * @param special
     * @param spellType type of spell
     * @returns {JSON | object}
     */
    this.calculateDamage = function (roll, armor, range, special, preparedRounds, spellType) {
        var result = roll;
        //apply mods
        if (roll <= 2) {
            return {
                damage: "F"
            };
        }

        switch (preparedRounds) {
            case 4:
                result += 20;
                break;
            case 3:
                result += 10;
                break;
            case 2:
                result += 0;
                break;
            case 1:
                result += -15;
                break;
            case 0:
                result += -30;
                break;
        }


        if (range < 3) {
            result += 35;
        } else if (range < 15) {
            result += 0;
        } else if (range < 30) {
            result += -20;
        } else if (range < 60) {
            result += -40;
        } else if (range < 100) {
            result += -55;
        } else {
            result += -75;
        }

        if (special) {
            result += special;
        }

        switch (spellType) {
            case "shockBolt":
            {
                result = min(90, result);
                break;
            }
            case "waterBolt":
            {
                result = min(110, result);
                break;
            }
            case "iceBolt":
            {
                result = min(130, result);
                break;
            }
            default:
                result = min(150, result);
                break;
        }


        return content[max(result, 9)][armor];
    }

};

/**
 * Object representing the mers critical table for large creatures
 * @param name db name of table
 * @param content table content
 */
CreatureCriticalTable = function (name, content) {
    this.name = name;
    this.content = content;

    /**
     * calculate critical effects based on table content
     * @param roll dice roll
     * @param weaponType weaponType
     * @param creatureSize size of attacked creature
     * @returns {JSON}
     */
    this.calculateCritical = function (roll, weaponType, creatureSize) {
        var result = roll;

        if (creatureSize == "huge") {
            result -= 10;
        }

        //apply mods
        switch (weaponType) {
            case "tooth":
            case "claw":
            case "regular":
                result += -20;
                break;
            case "magic":
                result += -10;
                break;
            case "mithril":
                result += 0;
                break;
            case "holy":
                result += 10;
                break;
            case "slaying":
                result += 20;
                break;
            default:
                break;
        }

        return content[result];
    }
};