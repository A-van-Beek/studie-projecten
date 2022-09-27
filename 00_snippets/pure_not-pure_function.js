// =========================================================================
// NIET pure function
// =========================================================================

let cnt = 0;

let increment1 = function() {
    cnt++;
    return cnt;
};

// =========================================================================
// WEL pure function,
// want: er zijn geen ongewenste side-effects.
// er wordt niets gewijzigd buiten de scope van deze functie.
// =========================================================================

let increment2 = function(num) {
    return num + 1;
}