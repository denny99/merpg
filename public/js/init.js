/**
 * Created by Denny on 31.07.2014.
 */

(function($) {
	$.fn.nodoubletapzoom = function() {
		$(this).bind('touchstart', function preventZoom(e) {
			var t2 = e.timeStamp
				, t1 = $(this).data('lastTouch') || t2
				, dt = t2 - t1
				, fingers = e.originalEvent.touches.length;
			$(this).data('lastTouch', t2);
			if (!dt || dt > 500 || fingers > 1) return; // not double-tap

			e.preventDefault(); // double tap - prevent the zoom
			// also synthesize click events we just swallowed up
			$(this).trigger('click').trigger('click');
		});
	};
})(jQuery);

//data storages
var damageTables = {};
var criticalTables = {};
var weapons = {};
var armors = {};
var shields = {};
var monsters = {};

//build name list for selects
var damageTablesList = ko.observableArray([]);
var criticalTablesList = ko.observableArray([]);
var weaponsList = ko.observableArray([]);
var armorsList = ko.observableArray([]);
var shieldsList = ko.observableArray([]);
var monstersList = ko.observableArray([]);
var itemsList = ko.computed(function () {
    return [
        {name: "----Waffen----"}
    ].concat(weaponsList(), [
            {name: "----Rüstungen----"}
        ], armorsList(), [
            {name: "----Schilde----"}
        ], shieldsList());
});

var dataLoader = new DataLoader();