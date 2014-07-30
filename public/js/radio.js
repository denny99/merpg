/**
 * Created by Denny on 30.07.2014.
 */

//hide or show stats for selected type of item
$(document).ready(function () {
    var weaponSettings = $('#weaponOnly');
    var shieldSettings = $('#shieldOnly');
    var armorSettings = $('#armorOnly');

    weaponSettings.hide();
    shieldSettings.hide();
    armorSettings.hide();

    $('#radioEquipment').click(function() {
        weaponSettings.fadeOut();
        shieldSettings.fadeOut();
        armorSettings.fadeOut();
    });

    $('#radioWeapon').click(function() {
        weaponSettings.fadeIn();
        shieldSettings.hide();
        armorSettings.hide();
    });

    $('#radioShield').click(function() {
        weaponSettings.hide();
        shieldSettings.fadeIn();
        armorSettings.hide();
    });

    $('#radioArmor').click(function() {
        weaponSettings.hide();
        shieldSettings.hide();
        armorSettings.fadeIn();
    });
});