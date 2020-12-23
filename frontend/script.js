const DOWN = "Down";
const UP = "Up";

const sections = ["#section-email", "#section-personal", "#section-password-choose", "#section-password-keystroke", "#section-message-keystroke"];
const passwordRegex = /^[0-9]{6}$/;
let activeSectionIdx = 2;
let password;

let passwordKeystrokes = [];
let passwordKeystrokesTmp = [];
const passwordAllowedKeys = ['Digit0', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9']

let passwordTryNumber = 1;

let message = '';
let messageKeystrokes = [];

class Keystroke {
    constructor(type, key) {
        this.time = Date.now();
        this.type = type;
        this.key = key
    }
}

function moveSection(n) {
    $(sections[activeSectionIdx]).hide();
    activeSectionIdx += n;
    $(sections[activeSectionIdx]).show();
}

function nextSection(event) {
    if (event.target.checkValidity()) {
        moveSection(1);
    } else {
        event.target.classList.add('was-validated');
    }

    event.preventDefault();
}

function prevSection(event) {
    moveSection(-1);

    event.preventDefault();
}

function passwordChooseNext(event) {
    const passwordInput = $("#password-choose-input");

    if (passwordRegex.test(passwordInput.val())) {
        passwordInput.removeClass("is-invalid");
        password = passwordInput.val();

        $("#password-paragraph").text("Your password: " + password);

        moveSection(1);
    } else {
        passwordInput.addClass("is-invalid");
    }

    event.preventDefault();
}

function passwordError() {
    let input = $("#password-keystroke-input");
    $("#password-mistake-alert").show();
    input.prop("disabled", true);
    input.val('');

    setTimeout(() => {
        passwordKeystrokesTmp = [];
        input.prop("disabled", false);
    }, 1500);
}

function passwordKeydown(event) {
    if (event.repeat) return;

    passwordKeystrokesTmp.push(new Keystroke(DOWN, event.code));
}

function passwordKeyup(event) {
    if (event.target.value.length > 6 ||
        event.target.value.slice(0, event.target.value.length) !== password.slice(0, event.target.value.length) ||
        !passwordAllowedKeys.includes(event.code)) {
        
        passwordError();
    } else {
        passwordKeystrokesTmp.push(new Keystroke(UP, event.code));
    }
}

function passwordEntrySubmit(event) {
    let input = $("#password-keystroke-input");

    if (input.val() !== password) {
        passwordError();
    } else {
        passwordKeystrokes.push(passwordKeystrokesTmp);
        
        if (passwordTryNumber >= 10) {
            // TODO: send the data
            moveSection(1);
        } else {
            input.val('');
            input.prop('disabled', true);

            let countdown = 5;

            function countdownFunc() {
                if (countdown <= 0) {
                    passwordKeystrokesTmp = [];
                    input.prop('disabled', false);
                    $('#password-timer').text('You can enter the password now.');
                } else {
                    $('#password-timer').text(`You can re-enter the password after ${countdown--}...`);
                    setTimeout(countdownFunc, 1000);
                }
            }

            countdownFunc();

            passwordTryNumber++;
            $('#password-entry-number').text(`Entry number: ${passwordTryNumber}`)
        }
    }

    event.preventDefault();
}

$(document).ready(() => {
    $('.alert .close').click(function(e) {
        $(this).parent().hide();
    });

    $('.enter-disabled').keypress((event) => {
        if (event.which == '13') {
            event.preventDefault();
        }
    });

    $("#form-email").submit(nextSection);
    $("#form-personal").submit(nextSection);
    $("#form-password-choose").submit(passwordChooseNext);
    $(".goback-button").click(prevSection);

    $('#password-keystroke-input').keydown(passwordKeydown);
    $('#password-keystroke-input').keyup(passwordKeyup);
    $("#form-password-keystroke").submit(passwordEntrySubmit);
});