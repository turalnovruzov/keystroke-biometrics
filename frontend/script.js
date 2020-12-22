const sections = ["#section-email", "#section-personal", "#section-password-choose", "#section-password-keystroke"];
const passwordRegex = /^[0-9]{6}$/;
let activeSectionIdx = 3;
let password;

let passwordKeystrokes = [];
let passwordKeystrokesTmp = [];

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

$(document).ready(() => {
    $("#form-email").submit(nextSection);
    $("#form-personal").submit(nextSection);
    $("#form-password-choose").submit(passwordChooseNext);
    $(".goback-button").click(prevSection);

    $('#password-keystroke-input').keydown((event) => {
        if (event.repeat) return;

        // if(event.code === "Backspace"){
        //     passwordKeystrokesTmp = [];
        //     $('#password-keystroke-input').val('');
        // }

        else{
            passwordKeystrokesTmp.push({
                time: Date.now(),
                type: "Down",
                key: event.code
            });
            console.log(passwordKeystrokesTmp);

            if(passwordKeystrokesTmp.length === 6){
                passwordKeystrokes.push(passwordKeystrokesTmp);
                passwordKeystrokesTmp = [];
                // counter ++;
            }
        }
    });
});