
function make_numeric(field) {
    field.value = field.value.replace(/[^0-9\.]/g,'');
}

function adamantine() {
    return $("#adamantine").is(':checked');
}

function get_damage_dice() {
    return $('#damage_dice').find(":selected").text();
}

function get_damage_bonus() {
    return parseInt($("#damage_bonus").val());
}

function get_stone_hp() {
    return parseInt($("#stone_hp").val());
}

function get_concurrent_dwarves() {
    return parseInt($("#concurrent_dwarves").val());
}

function get_true_hardness() {
    var hardness = parseInt($("#stone_hardness").val());
    if (adamantine()) {
        hardness = 0;
    }
    return hardness;
}

function is_single_dice(damage_dice) {
    return "D" == damage_dice.charAt(0);
}

function sum(arr) {
    var total = 0;
    for (var i in arr) {
        total += arr[i];
    }
    return total;
}

function get_damage(roll, damage_bonus, hardness) {
    var damage = roll + damage_bonus - hardness;
    if (damage < 0) {
        damage = 0;
    }
    return damage;
}

function single_dice_average_damage(damage_dice, damage_bonus, hardness) {
    var faces = parseInt(damage_dice.substr(1));

    var rolls = new Array();
    for (var i = 0; i < faces; i++) {
        rolls[i] = get_damage(i + 1, damage_bonus, hardness);
    }

    return sum(rolls) / faces;
}

function calculate_average_damage() {
    var damage_dice = get_damage_dice();
    var damage_bonus = get_damage_bonus();
    var hardness = get_true_hardness();

    if (is_single_dice(damage_dice)) {
        return single_dice_average_damage(damage_dice, damage_bonus, hardness);
    }

    // the only multiple-dice option is 2D6.
    var freq =  [1/36, 1/18, 1/12, 1/9, 5/36, 1/6, 5/36, 1/9, 1/12, 1/18, 1/36];
    var rolls = new Array();
    for (var i = 2; i <= 12; i++) {
        rolls[i] = get_damage(i, damage_bonus, hardness) * freq[i - 2]
    }
    return sum(rolls);
}


function get_total_volume() {
    var total_volume = 0;
    try {
        total_volume = eval($("#total_volume").val());
    } catch (ignored) {
        return 0;
    }
    if (isNaN(total_volume)) {
        return 0;
    }
    return total_volume;
}

function mine() {
    var total_volume = get_total_volume();
    if (total_volume <= 0) {
        alert("Invalid expression in total volume field (must evaluate to number > 0).");
        $("#total_volume").focus();
        return;
    }

    var avg_damage = calculate_average_damage();
    var rounds_per_shift = 10 * 60 * 8;
    var inches_per_shift = rounds_per_shift * avg_damage / get_stone_hp();
    var cubic_feet_per_shift_per_dwarf = inches_per_shift / 12;
    var cubic_feet_per_shift = cubic_feet_per_shift_per_dwarf * get_concurrent_dwarves();
    var cubic_feet_per_day = cubic_feet_per_shift * 3;
    var total_time = total_volume / cubic_feet_per_day;

    $("#cubic_feet_per_shift_per_dwarf").text(cubic_feet_per_shift_per_dwarf.toFixed(1));
    $("#cubic_feet_per_shift").text(cubic_feet_per_shift.toFixed(1));
    $("#cubic_feet_per_day").text(cubic_feet_per_day.toFixed(1));
    $("#total_time").text(total_time.toFixed(1));
}

$(document).ready(function() {
    $("#stone_hp").keyup(function () { make_numeric(this) });
    $("#stone_hardness").keyup(function () { make_numeric(this) });
    $("#damage_bonus").keyup(function () { make_numeric(this) });
    $("#concurrent_dwarves").keyup(function () { make_numeric(this) });

    $("#mine_button").click(function() {
        mine();
    });

    mine();
});

