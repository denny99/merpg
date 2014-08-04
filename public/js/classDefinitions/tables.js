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

        return content[min(result, 150)][armor];
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
        console.log(flankAttack)
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

        console.log(result);

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

        console.log(result);

        return content[result][armor];
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
            case "normal":
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