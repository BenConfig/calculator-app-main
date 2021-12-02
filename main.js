$('#default, #light, #dark').on('change', function() {
    const currentClass = $('html').attr('class');
    const newClass = $(this).attr('id');
    $('html').removeClass(currentClass).addClass(newClass);
});

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    $("#light").prop("checked", true).change();
}
else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    $("#dark").prop("checked", true).change();
}
else $("#default").prop("checked", true).change();

window.matchMedia("(prefers-color-scheme: light)").addEventListener('change', function(e) {
    if (e.matches) {
        $("#light").prop("checked", true).change();
    }
})

window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', function(e) {
    if (e.matches) {
        $("#dark").prop("checked", true).change();
    }
})
    
$('#default, #light, #dark').on('change', function() {
    const currentClass = $('html').attr('class');
    const newClass = $(this).attr('id');
    $('html').removeClass(currentClass).addClass(newClass);
});


// RegExps
const isOneDigit = new RegExp(/^\-?\d$/);
const isDigitOrDecimalOrMinus = new RegExp(/[\d\.\-]/);
const isOperation = new RegExp(/[\+\-x\/]/);
const redundantZeros = new RegExp(/\.?0+$/);
const locationsForCommas = new RegExp(/\B(?=(\d{3})+(?!\d))/, 'g');
const commas = new RegExp(/,/, 'g');
const isInfinityOrNaN = new RegExp(/Infinity$|NaN/);
const hasExpThenNumberOne = new RegExp(/e\+1$/);
const hasExpThenOneDigit = new RegExp(/e\+\d$/);
const hasExpThenMultipleDigits = new RegExp(/e\+\d+$/);

let displayedValue = '0';
let savedValue = '';
let currentOperation = '';
let savedOperation = '';

function formatNumber(number) {
    number = number.toFixed(7).replace(redundantZeros, '');
    if (Math.abs(number) > 999999999) {
        return Number.parseFloat(number).toExponential(6);
    }
    if (number.length > 12) {
        number = number.slice(0, 12);
    }
    const decimalIndex = number.indexOf('.');
    if (decimalIndex === -1) {
        return number.replace(locationsForCommas, ',');
    }
    else {
        return number.slice(0, decimalIndex).replace(locationsForCommas, ',')
               + number.slice(decimalIndex);
    }
}

const performOperation = {
    '+': function(a, b) {
        return formatNumber(Number(a) + Number(b));
    },
    '-': function(a, b) {
        return formatNumber(Number(a) - Number(b));
    },
    'x': function(a, b) {
        return formatNumber(Number(a) * Number(b));
    },
    '/': function(a, b) {
        return formatNumber(Number(a) / Number(b));
    }
}

$('.calc__btn').on('click', function() {
    const clickedButton = $(this).text();


    if (currentOperation && isDigitOrDecimalOrMinus.test(clickedButton)) {
        displayedValue = '0';
        currentOperation = '';
    }


    if (clickedButton === '-' && displayedValue === '0') {
        displayedValue = clickedButton;
    }
    else if (clickedButton === '.' && !displayedValue.includes('.')) {
        if (displayedValue === '-') {
            displayedValue = '-0.';
        }
        else if (isInfinityOrNaN.test(displayedValue)) {
            displayedValue = '0.';
        }
        else {
            displayedValue += clickedButton;
        }
    }
    else if ($.isNumeric(clickedButton)) {
        if (displayedValue === '0' || isInfinityOrNaN.test(displayedValue)) {
            displayedValue = clickedButton;
        }
        else {
            displayedValue += clickedButton;
            if (/.\d{9}/.test(displayedValue)) {
                displayedValue = displayedValue.slice(0, -1);
            }
            if (displayedValue.length > 11 && !displayedValue.includes('.')) {
                displayedValue = displayedValue.slice(0, 11);
            }
            if (Math.abs(displayedValue.replace(commas, '')) > 999) {
                displayedValue = formatNumber(Number(displayedValue.replace(commas, '')));
            }
        }
    }
    else if (isOperation.test(clickedButton)) {
        if (savedOperation && !currentOperation) {
            displayedValue = performOperation[savedOperation](
                                savedValue.replace(commas, ''),
                                displayedValue.replace(commas, '')
                             );
        }
        currentOperation = clickedButton;
        savedOperation = currentOperation
        savedValue = displayedValue;
    }
    else if (clickedButton === '=') {
        if (savedOperation && !currentOperation) {
            displayedValue = performOperation[savedOperation](
                                savedValue.replace(commas, ''),
                                displayedValue.replace(commas, '')
                             );
        }
        savedOperation = '';
    }
    else if (clickedButton === 'del') {
        if ($.isNumeric(displayedValue) && isOneDigit.test(displayedValue)) {
            displayedValue = '0';
        }
        else if (isInfinityOrNaN.test(displayedValue)) {
            displayedValue = '0';
        }
        else if (hasExpThenNumberOne.test(displayedValue)) {
            displayedValue = displayedValue.slice(0, -3).replace(redundantZeros, '');
        }
        else if (hasExpThenOneDigit.test(displayedValue)) {
            displayedValue = displayedValue.slice(0, -1) + '1';
        }
        else if (hasExpThenMultipleDigits.test(displayedValue)) {
            displayedValue = displayedValue.slice(0, -1);
        }
        else {
            displayedValue = formatNumber(Number(displayedValue.slice(0, -1).replace(commas, '')));
        }
    }
    else if (clickedButton === 'reset') {
        displayedValue = '0';
        savedValue = '';
        currentOperation;
        savedOperation = '';
    }

    $('.calc__display').text(displayedValue);
})

/* The code below was an attempt to create a custom key navigation, however it is too slow to be usable

// Arrow Keys
const up = 38;
const down = 40;
const left = 37;
const right = 39;

$('.calc__btn').on('focus', function() {
    if ($(this).text() === '0') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--2").focus()
            if (e.keyCode === down) $(".calc__btn--reset").focus();
            if (e.keyCode === left) $(".calc__btn--dec").focus()
            if (e.keyCode === right) $(".calc__btn--div").focus();
        });
    }
    else if ($(this).text() === '1') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--4").focus()
            if (e.keyCode === down) $(".calc__btn--dec").focus();
            if (e.keyCode === right) $(".calc__btn--2").focus();
        });
    }
    else if ($(this).text() === '2') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--5").focus()
            if (e.keyCode === down) $(".calc__btn--0").focus();
            if (e.keyCode === left) $(".calc__btn--1").focus()
            if (e.keyCode === right) $(".calc__btn--3").focus();
        });
    }
    else if ($(this).text() === '3') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--6").focus();
            if (e.keyCode === down) $(".calc__btn--div").focus();
            if (e.keyCode === left) $(".calc__btn--2").focus();
            if (e.keyCode === right) $(".calc__btn--minus").focus();
        });
    }
    else if ($(this).text() === '4') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--7").focus();
            if (e.keyCode === down) $(".calc__btn--1").focus();
            if (e.keyCode === right) $(".calc__btn--5").focus();
        });
    }
    else if ($(this).text() === '5') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--8").focus();
            if (e.keyCode === down) $(".calc__btn--2").focus();
            if (e.keyCode === left) $(".calc__btn--4").focus();
            if (e.keyCode === right) $(".calc__btn--6").focus();
        });
    }
    else if ($(this).text() === '6') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--9").focus();
            if (e.keyCode === down) $(".calc__btn--3").focus();
            if (e.keyCode === left) $(".calc__btn--5").focus();
            if (e.keyCode === right) $(".calc__btn--plus").focus();
        });
    }
    else if ($(this).text() === '7') {
        $(this).keydown(function(e) {
            if (e.keyCode === down) $(".calc__btn--4").focus();
            if (e.keyCode === right) $(".calc__btn--8").focus();
        });
    }
    else if ($(this).text() === '8') {
        $(this).keydown(function(e) {
            if (e.keyCode === down) $(".calc__btn--5").focus();
            if (e.keyCode === left) $(".calc__btn--7").focus();
            if (e.keyCode === right) $(".calc__btn--9").focus();
        });
    }
    else if ($(this).text() === '9') {
        $(this).keydown(function(e) {
            if (e.keyCode === down) $(".calc__btn--6").focus();
            if (e.keyCode === left) $(".calc__btn--8").focus();
            if (e.keyCode === right) $(".calc__btn--del").focus();
        });
    }
    else if ($(this).text() === '.') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--1").focus();
            if (e.keyCode === down) $(".calc__btn--reset").focus();
            if (e.keyCode === right) $(".calc__btn--0").focus();
        });
    }
    else if ($(this).text() === '+') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--del").focus();
            if (e.keyCode === down) $(".calc__btn--minus").focus();
            if (e.keyCode === left) $(".calc__btn--6").focus();
        });
    }
    else if ($(this).text() === '-') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--plus").focus();
            if (e.keyCode === down) $(".calc__btn--times").focus();
            if (e.keyCode === left) $(".calc__btn--3").focus();
        });
    }
    else if ($(this).text() === 'x') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--minus").focus();
            if (e.keyCode === down) $(".calc__btn--equal").focus();
            if (e.keyCode === left) $(".calc__btn--div").focus();
        });
    }
    else if ($(this).text() === '/') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--3").focus();
            if (e.keyCode === down) $(".calc__btn--equal").focus();
            if (e.keyCode === left) $(".calc__btn--0").focus();
            if (e.keyCode === right) $(".calc__btn--times").focus();
        });
    }
    else if ($(this).text() === 'del') {
        $(this).keydown(function(e) {
            if (e.keyCode === down) $(".calc__btn--plus").focus();
            if (e.keyCode === left) $(".calc__btn--9").focus();
        });
    }
    else if ($(this).text() === 'reset') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--0").focus();
            if (e.keyCode === right) $(".calc__btn--equal").focus();
        });
    }
    else if ($(this).text() === '=') {
        $(this).keydown(function(e) {
            if (e.keyCode === up) $(".calc__btn--div").focus();
            if (e.keyCode === left) $(".calc__btn--reset").focus();
        });
    }
})

*/