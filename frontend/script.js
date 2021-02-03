const DOWN = "Down";
const UP = "Up";
const BASE_URL = "http://localhost:3000"

const sections = ["#section-email", "#section-personal", "#section-password-choose", "#section-password-keystroke", "#section-name-keystroke", "#thankyou-section"];
const passwordRegex = /^[0-9]{6}$/;

let userId;
let userExists = false;

let activeSectionIdx = 0;
let password;

let passwordKeystrokes = [];
let passwordKeystrokesTmp = [];
const passwordAllowedKeys = ['Digit0', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9']

let passwordTryNumber = 1;

let nameMsg;
let nameKeystrokes = [];

class Keystroke {
    constructor(type, key) {
        this.time = Date.now();
        this.type = type;
        this.key = key
    }
}

function setPassword(_password) {
    password = _password;
    $("#password-paragraph").html(`Your password: ${password}<br><span class="turkish-text">Şifreniz: ${password}</span>`);
}

function setName(_name) {
    nameMsg = _name;
    $('#name-paragraph').text(nameMsg);
}

function moveSection(n) {
    $(sections[activeSectionIdx]).hide();
    activeSectionIdx += n;
    $(sections[activeSectionIdx]).show();
}

async function emailSubmit(event) {
    event.preventDefault();

    if (event.target.checkValidity()) {
        let response = await fetch(BASE_URL + '/user/' + $('#email-input').val());
        if (response.status == 200) {
            userExists = true;

            let data = await response.json();
            userId = data._id;
            setPassword(data.password);
            setName(data.name);
            moveSection(3);
        } else {
            moveSection(1);
        }
    } else {
        event.target.classList.add('was-validated');
    }
}

function prevSection(event) {
    moveSection(-1);

    event.preventDefault();
}

function personalInfoSubmit(event) {
    if (event.target.checkValidity()) {
        setName(`${$('#firstname-input').val()} ${$('#lastname-input').val()}`);
        moveSection(1);
    } else {
        event.target.classList.add('was-validated');
    }

    event.preventDefault();
}

function passwordChooseNext(event) {
    const passwordInput = $("#password-choose-input");

    if (passwordRegex.test(passwordInput.val())) {
        passwordInput.removeClass("is-invalid");
        setPassword(passwordInput.val());

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
        
        if (passwordTryNumber >= 1) {
            moveSection(1);
        } else {
            input.val('');
            input.prop('disabled', true);

            let countdown = 5;

            function countdownFunc() {
                if (countdown <= 1) {
                    passwordKeystrokesTmp = [];
                    input.prop('disabled', false);
                    $('#password-timer').html('You may now enter your password again.<br><span class="turkish-text">Şimdi şifrenizi tekrar girebilirsiniz.</span>');
                } else {
                    countdown--;
                    $('#password-timer').html(`You can re-enter the password after ${countdown} seconds...<br><span class="turkish-text">${countdown} saniye sonra şifreyi tekrar girebilirsiniz...</span>`);
                    setTimeout(countdownFunc, 1000);
                }
            }

            countdownFunc();

            passwordTryNumber++;
            $('#password-entry-number').html(`Entry count: ${passwordTryNumber}<br><span class="turkish-text">Giriş sayısı: ${passwordTryNumber}</span>`)
        }
    }

    event.preventDefault();
}

function messageTextareaClick(event) {
    $(event.target).focus();
    event.preventDefault();
}

function nameError() {
    let input = $('#name-keystroke-textarea');
    $("#name-mistake-alert").show();
    input.prop("disabled", true);
    input.val('');

    setTimeout(() => {
        nameKeystrokes = [];
        input.prop("disabled", false);
    }, 1500);
}

function nameKeydown(event) {
    if (event.repeat) return;

    nameKeystrokes.push(new Keystroke(DOWN, event.code));
}

function nameKeyup(event) {
    nameKeystrokes.push(new Keystroke(UP, event.code));
}

function nameSubmit(event) {
    let input = $('#name-keystroke-textarea');

    if (input.val() === nameMsg) {
        submitData();
        moveSection(1);
    } else {
        nameError();
    }

    event.preventDefault();
}

function submitData()  {
    if (userExists) {
        fetch(BASE_URL + '/addSession', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: userId,
                passwordKeystrokes: passwordKeystrokes,
                nameKeystrokes: nameKeystrokes
            })
        }).then();
    } else {
        fetch(BASE_URL + '/firstSession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: $('#email-input').val(),
                firstname: $('#firstname-input').val(),
                lastname: $('#lastname-input').val(),
                age: parseInt($('#age-input').val()),
                gender: $('#gender-select').val(),
                occupation: $('#occupation-select').val(),
                password: password,
                nameMsg: nameMsg,
                passwordKeystrokes: passwordKeystrokes,
                nameKeystrokes: nameKeystrokes
            })
        }).then();
    }
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

    $('.no-copy-cut-paste').on('copy cut paste', (event) => {
        return false;
    })

    $("#form-email").submit(emailSubmit);
    $("#form-personal").submit(personalInfoSubmit);
    $("#form-password-choose").submit(passwordChooseNext);
    $(".goback-button").click(prevSection);

    $('#password-keystroke-input').keydown(passwordKeydown);
    $('#password-keystroke-input').keyup(passwordKeyup);
    $("#form-password-keystroke").submit(passwordEntrySubmit);

    $('#name-keystroke-textarea').mousedown(messageTextareaClick);
    $('#name-keystroke-textarea').keydown(nameKeydown);
    $('#name-keystroke-textarea').keyup(nameKeyup);
    $('#form-name-keystroke').submit(nameSubmit);
});