const DOWN = "Down";
const UP = "Up";

const sections = ["#section-email", "#section-personal", "#section-password-choose", "#section-password-keystroke", "section-message-keystroke"];
const passwordRegex = /^[0-9]{6}$/;
let activeSectionIdx = 0;
let password;

let passwordKeystrokes = [];
let passwordKeystrokesTmp = [];

let passwordTryNumber = 1;

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

        $("#password-paragraph").html("Your password: " + password);

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

$(document).ready(() => {
    $('.alert .btn-close').click(function(e) {
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

    $('#password-keystroke-input').keydown((event) => {
        if (event.repeat) return;

        passwordKeystrokesTmp.push({
            time: Date.now(),
            type: DOWN,
            key: event.code
        });
    });

    $('#password-keystroke-input').keyup((event) => {
        if (event.target.value.length > 6 ||
            event.target.value.slice(0, event.target.value.length) !== password.slice(0, event.target.value.length ||
            event.code === "Backspace")) {
            
            passwordError();
        } else {
            passwordKeystrokesTmp.push({
                time: Date.now(),
                type: UP,
                key: event.code
            });
        }
    });

    $("#form-password-keystroke").submit((event) => {
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
            }
        }

        event.preventDefault();
    });


});