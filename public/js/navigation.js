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

    $('#itemEditorForm').bind("keyup keypress", function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            return false;
        }
    });

    $('#monsterEditorForm').bind("keyup keypress", function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            return false;
        }
    });
});


