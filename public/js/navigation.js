/**
 * Created by Denny on 30.07.2014.
 */

var currentPosition = "mainMenu";

//hide all but the mainMenu
$(document).ready(function () {
    $('#monsterEditor').hide();
    $('#itemEditor').hide();
    $('#battleUI').hide();
    $('#pager').hide();
    $('#buttonForward').hide();

    //setup navigation click events
    $('#buttonBackward').click(function () {
        var pager = $('#pager');
        var mainMenu = $('#mainMenu');
        switch (currentPosition) {
            default:
                currentPosition = "mainMenu";
                pager.hide();
                mainMenu.fadeIn();
                break;
            case "battleUI":
                $('#battleUI').hide();
                $('#buttonForward').hide();
                currentPosition = "mainMenu";
                pager.hide();
                mainMenu.fadeIn();
                break;
            case "monsterEditor":
                $('#monsterEditor').hide();
                currentPosition = "mainMenu";
                pager.hide();
                mainMenu.fadeIn();
                break;
            case "itemEditor":
                $('#itemEditor').hide();
                currentPosition = "mainMenu";
                pager.hide();
                mainMenu.fadeIn();
                break;
        }
    });

    $('#buttonBattleUI').click(function () {
        $('#battleUI').fadeIn();
        $('#mainMenu').hide();
        $('#pager').fadeIn();
        $('#buttonForward').fadeIn();
        currentPosition = "battleUI";
    });

    $('#buttonMonsterEditor').click(function () {
        $('#monsterEditor').fadeIn();
        $('#mainMenu').hide();
        $('#pager').fadeIn();
        currentPosition = "monsterEditor";
    });

    $('#buttonItemEditor').click(function () {
        $('#itemEditor').fadeIn();
        $('#mainMenu').hide();
        $('#pager').fadeIn();
        currentPosition = "itemEditor";
    });

    var result = {};
    //crush
    for (var i = -49; i <= 120; i++) {
        if (i >= -49 && i <= 5) {
            result[i.toString()] = {
                text: "Schwacher Griff. Kein zusätzlicher Schaden",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 6 && i <= 20) {
            result[i.toString()] = {
                text: "Kleinerer Rippenbruch",
                hits: 5,
                activity: -5,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 21 && i <= 35) {
            result[i.toString()] = {
                text: "Schlag zur Seite",
                hits: 4,
                activity: {
                    bonus: -40,
                    duration: 1
                },
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 36 && i <= 50) {
            result[i.toString()] = {
                text: "Schlag auf Unterarm",
                hits: 5,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                noArmGreaves: {
                    stunned: 1
                }
            }
        }
        if (i >= 51 && i <= 65) {
            result[i.toString()] = {
                text: "Schlag auf die Schildschulter, zerbricht das Schild. Wenn kein Schild: Schulter gebrochen, Arm unbrauchbar",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 66 && i <= 79) {
            result[i.toString()] = {
                text: "Schlag bricht Knochen in Bein",
                hits: 12,
                activity: -40,
                stunned: 2,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 80 && i <= 80) {
            result[i.toString()] = {
                text: "Schlag auf die Stirn. Ein Auge zerstört. Wenn kein Helm: ein 1 Monat Koma",
                hits: 30,
                activity: undefined,
                stunned: 24,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                noHelmet: {
                    knockedOut: true
                }
            }
        }
        if (i >= 81 && i <= 86) {
            result[i.toString()] = {
                text: "Schlag gegen Waffenarm. Wenn keine Armrüstung: Sehne beschädigt, Arm gebrochen und nutzlos",
                hits: 8,
                activity: undefined,
                stunned: 2,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 87 && i <= 89) {
            result[i.toString()] = {
                text: "Knie zerschmettert",
                hits: 9,
                activity: -60,
                stunned: 3,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 90 && i <= 90) {
            result[i.toString()] = {
                text: "Schlag auf den Hals lähmt von den Schultern abwärts. Feind ganz fassungslos",
                hits: 25,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 91 && i <= 96) {
            result[i.toString()] = {
                text: "Bewusstlos für 4 Stunden wegen Schlag gegen die Seite des Kopfes. Wenn kein Helm: Schädel zermalmt",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true,
                noHelmet: {
                    hits: 20,
                    roundsTillDeath: 0
                }
            }
        }
        if (i >= 97 && i <= 99) {
            result[i.toString()] = {
                text: "Heftiger Schlag gegen die Brust zerschmettert Brustkorb und zerstört die Lungen.",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 6
            }
        }
        if (i >= 100 && i <= 100) {
            result[i.toString()] = {
                text: "Schlag auf Kiefer. Treibt den Knochen ins Gehirn",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
        if (i >= 101 && i <= 106) {
            result[i.toString()] = {
                text: "Schlag bricht Hüfte",
                hits: 15,
                activity: -75,
                stunned: 3,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 107 && i <= 109) {
            result[i.toString()] = {
                text: "Schlag gegen den Hals zermalmt Kehle. Kann nicht atmen. Armer Narr erstickt in 12 Runden",
                hits: undefined,
                activity: undefined,
                stunned: 12,
                hitsPerRound: undefined,
                roundsTillDeath: 12
            }
        }
        if (i >= 110 && i <= 110) {
            result[i.toString()] = {
                text: "Zermalmt Hüfte. Stirbt an Nervenversagen in 6 Runden",
                hits: 35,
                activity: undefined,
                stunned: 2,
                hitsPerRound: undefined,
                roundsTillDeath: 6
            }
        }
        if (i >= 111 && i <= 116) {
            result[i.toString()] = {
                text: "Zerschmettert Ellbogen des Waffenarms.",
                hits: undefined,
                activity: undefined,
                stunned: 5,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 117 && i <= 119) {
            result[i.toString()] = {
                text: "Schlag zur Seite zermalmt Brusthöhle.",
                hits: undefined,
                activity: undefined,
                stunned: 3,
                hitsPerRound: undefined,
                roundsTillDeath: 3
            }
        }
        if (i >= 120 && i <= 120) {
            result[i.toString()] = {
                text: "Heftiger Schlag gegen die Brust. Zerstört das Herz. Stirbt sofort",
                hits: 25,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
    }
    console.log(JSON.stringify(result));

    //slash
    for (var i = -49; i <= 120; i++) {
        if (i >= -49 && i <= 5) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 6 && i <= 20) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: 1,
                roundsTillDeath: undefined
            }
        }
        if (i >= 21 && i <= 35) {
            result[i.toString()] = {
                text: "",
                hits: 5,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                noLegGreaves: {
                    hits: 3,
                    hitsPerRound: 2
                }
            }
        }
        if (i >= 36 && i <= 50) {
            result[i.toString()] = {
                text: "",
                hits: 3,
                activity: -5,
                stunned: undefined,
                hitsPerRound: 1,
                roundsTillDeath: undefined
            }
        }
        if (i >= 51 && i <= 65) {
            result[i.toString()] = {
                text: "",
                hits: 4,
                activity: undefined,
                stunned: 1,
                hitsPerRound: 2,
                roundsTillDeath: undefined
            }
        }
        if (i >= 66 && i <= 79) {
            result[i.toString()] = {
                text: "",
                hits: 6,
                activity: -10,
                stunned: 2,
                hitsPerRound: 1,
                roundsTillDeath: undefined
            }
        }
        if (i >= 80 && i <= 80) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 1
            }
        }
        if (i >= 81 && i <= 86) {
            result[i.toString()] = {
                text: "",
                hits: 10,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: 1,
                roundsTillDeath: undefined
            }
        }
        if (i >= 87 && i <= 89) {
            result[i.toString()] = {
                text: "",
                hits: 10,
                activity: undefined,
                stunned: 30,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 90 && i <= 90) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
        if (i >= 91 && i <= 96) {
            result[i.toString()] = {
                text: "",
                hits: 15,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true,
                noHelmet: {
                    roundsTillDeath: 0
                }
            }
        }
        if (i >= 97 && i <= 99) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: 20,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 100 && i <= 100) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 3,
                knockedOut: true
            }
        }
        if (i >= 101 && i <= 106) {
            result[i.toString()] = {
                text: "",
                hits: 10,
                activity: -10,
                stunned: 4,
                hitsPerRound: 8,
                roundsTillDeath: undefined
            }
        }
        if (i >= 107 && i <= 109) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: 15,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 110 && i <= 110) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
        if (i >= 111 && i <= 116) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: 6,
                hitsPerRound: 12,
                roundsTillDeath: undefined
            }
        }
        if (i >= 117 && i <= 119) {
            result[i.toString()] = {
                text: "",
                hits: 20,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 120 && i <= 120) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
    }

    //puncture
    for (var i = -49; i <= 120; i++) {
        if (i >= -49 && i <= 5) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 6 && i <= 20) {
            result[i.toString()] = {
                text: "",
                hits: 3,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 21 && i <= 35) {
            result[i.toString()] = {
                text: "",
                hits: 3,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                noLegGreaves: {
                    hitsPerRound: 3
                }
            }
        }
        if (i >= 36 && i <= 50) {
            result[i.toString()] = {
                text: "",
                hits: 2,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                noArmGreaves: {
                    stunned: 1
                }
            }
        }
        if (i >= 51 && i <= 65) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: 1,
                hitsPerRound: 1,
                roundsTillDeath: undefined
            }
        }
        if (i >= 66 && i <= 79) {
            result[i.toString()] = {
                text: "",
                hits: 3,
                activity: -25,
                stunned: 1,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 80 && i <= 80) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
        if (i >= 81 && i <= 86) {
            result[i.toString()] = {
                text: "",
                hits: 10,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                noArmGreaves: {
                    stunned: 3
                }
            }
        }
        if (i >= 87 && i <= 89) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: -50,
                stunned: 3,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 90 && i <= 90) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 6,
                knockedOut: true
            }
        }
        if (i >= 91 && i <= 96) {
            result[i.toString()] = {
                text: "",
                hits: 10,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true,
                noHelmet: {
                    roundsTillDeath: 0
                }
            }
        }
        if (i >= 97 && i <= 99) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 100 && i <= 100) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
        if (i >= 101 && i <= 106) {
            result[i.toString()] = {
                text: "",
                hits: 10,
                activity: -20,
                stunned: 4,
                hitsPerRound: 6,
                roundsTillDeath: undefined
            }
        }
        if (i >= 107 && i <= 109) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 6
            }
        }
        if (i >= 110 && i <= 110) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
        if (i >= 111 && i <= 116) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: 12,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 117 && i <= 119) {
            result[i.toString()] = {
                text: "",
                hits: 9,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 6
            }
        }
        if (i >= 120 && i <= 120) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
    }

    //unbalancing
    for (var i = -49; i <= 120; i++) {
        if (i >= -49 && i <= 5) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 6 && i <= 20) {
            result[i.toString()] = {
                text: "",
                hits: 2,
                activity: {
                    bonus: -5,
                    duration: 2
                },
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 21 && i <= 35) {
            result[i.toString()] = {
                text: "",
                hits: 4,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                noLegGreaves: {
                    stunned: 2
                }
            }
        }
        if (i >= 36 && i <= 50) {
            result[i.toString()] = {
                text: "",
                hits: 5,
                activity: {
                    bonus: -10,
                    duration: 2
                },
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 51 && i <= 65) {
            result[i.toString()] = {
                text: "",
                hits: 5,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                noShield: {
                    hits: 8,
                    stunned: 2
                }
            }
        }
        if (i >= 66 && i <= 79) {
            result[i.toString()] = {
                text: "",
                hits: 8,
                activity: {
                    bonus: -10,
                    duration: 10
                },
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 80 && i <= 80) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: -80,
                stunned: 99,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 81 && i <= 86) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: 3,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 87 && i <= 89) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: 6,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 90 && i <= 90) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 91 && i <= 96) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: 6,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                noHelmet: {
                    knockedOut: true
                }
            }
        }
        if (i >= 97 && i <= 99) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: 15,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 100 && i <= 100) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 101 && i <= 106) {
            result[i.toString()] = {
                text: "",
                hits: 12,
                activity: -50,
                stunned: 1,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 107 && i <= 109) {
            result[i.toString()] = {
                text: "",
                hits: 9,
                activity: undefined,
                stunned: 6,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                noHelmet: {
                    knockedOut: true
                }
            }
        }
        if (i >= 110 && i <= 110) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 12
            }
        }
        if (i >= 111 && i <= 116) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: -40,
                stunned: 7,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 117 && i <= 119) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: -20,
                stunned: 9,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                noShield: {
                    knockedOut: true
                }
            }
        }
        if (i >= 120 && i <= 120) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
    }

    //large creature
    for (var i = -49; i <= 120; i++) {
        if (i >= -49 && i <= 5) {
            result[i.toString()] = {
                text: "",
                hits: 10,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 6 && i <= 20) {
            result[i.toString()] = {
                text: "",
                hits: 6,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 21 && i <= 35) {
            result[i.toString()] = {
                text: "",
                hits: 12,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 36 && i <= 50) {
            result[i.toString()] = {
                text: "",
                hits: 18,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 51 && i <= 65) {
            result[i.toString()] = {
                text: "",
                hits: 20,
                activity: -10,
                stunned: 2,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 66 && i <= 79) {
            result[i.toString()] = {
                text: "",
                hits: 18,
                activity: -20,
                stunned: 3,
                hitsPerRound: 5,
                roundsTillDeath: undefined
            }
        }
        if (i >= 80 && i <= 80) {
            result[i.toString()] = {
                text: "",
                hits: 15,
                activity: -60,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 6
            }
        }
        if (i >= 81 && i <= 86) {
            result[i.toString()] = {
                text: "",
                hits: 25,
                activity: -10,
                stunned: 2,
                hitsPerRound: 3,
                roundsTillDeath: undefined
            }
        }
        if (i >= 87 && i <= 89) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: {
                    bonus: -30,
                    duration: 4
                },
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 10
            }
        }
        if (i >= 90 && i <= 90) {
            result[i.toString()] = {
                text: "",
                hits: 20,
                activity: undefined,
                stunned: 6,
                hitsPerRound: undefined,
                roundsTillDeath: 6
            }
        }
        if (i >= 91 && i <= 96) {
            result[i.toString()] = {
                text: "",
                hits: 15,
                activity: -20,
                stunned: 3,
                hitsPerRound: 2,
                roundsTillDeath: undefined
            }
        }
        if (i >= 97 && i <= 99) {
            result[i.toString()] = {
                text: "",
                hits: 30,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 100 && i <= 100) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
        if (i >= 101 && i <= 106) {
            result[i.toString()] = {
                text: "",
                hits: 15,
                activity: undefined,
                stunned: 3,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 107 && i <= 109) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: 2,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 110 && i <= 110) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
        if (i >= 111 && i <= 116) {
            result[i.toString()] = {
                text: "",
                hits: 60,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 117 && i <= 119) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
        if (i >= 120 && i <= 120) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
    }

    //grappling
    for (var i = -49; i <= 120; i++) {
        if (i >= -49 && i <= 5) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 6 && i <= 20) {
            result[i.toString()] = {
                text: "",
                hits: 2,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 21 && i <= 35) {
            result[i.toString()] = {
                text: "",
                hits: 3,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                legGreaves: {
                    stunned: 1
                }
            }
        }
        if (i >= 36 && i <= 50) {
            result[i.toString()] = {
                text: "",
                hits: 5,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                legGreaves: {
                    stunned: 1
                }
            }
        }
        if (i >= 51 && i <= 65) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: -50,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 66 && i <= 79) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: -25,
                stunned: 2,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 80 && i <= 80) {
            result[i.toString()] = {
                text: "",
                hits: 9,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 81 && i <= 86) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: -40,
                stunned: 3,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 87 && i <= 89) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 90 && i <= 90) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: -60,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 91 && i <= 96) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: 9,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                knockedOut: true
            }
        }
        if (i >= 97 && i <= 99) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: -75,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 100 && i <= 100) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                noHelmet: {
                    roundsTillDeath: 0
                },
                helmet: {
                    stunned: 3,
                    activity: -60
                }
            }
        }
        if (i >= 101 && i <= 106) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: -10,
                stunned: 5,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 107 && i <= 109) {
            result[i.toString()] = {
                text: "",
                hits: 20,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                knockedOut: true,
                roundsTillDeath: undefined
            }
        }
        if (i >= 110 && i <= 110) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined,
                noHelmet: {
                    roundsTillDeath: 6
                },
                helmet: {
                    stunned: 5
                }
            }
        }
        if (i >= 111 && i <= 116) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: 2,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 117 && i <= 119) {
            result[i.toString()] = {
                text: "",
                hits: 20,
                activity: -80,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: undefined
            }
        }
        if (i >= 120 && i <= 120) {
            result[i.toString()] = {
                text: "",
                hits: undefined,
                activity: undefined,
                stunned: undefined,
                hitsPerRound: undefined,
                roundsTillDeath: 0
            }
        }
    }
});


