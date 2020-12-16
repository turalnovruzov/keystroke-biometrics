const sections = ["#section-email", "#section-personal"];
let activeSectionIdx = 0;

function nextSection(event) {
    $(sections[activeSectionIdx]).addClass("d-none");
    $(sections[++activeSectionIdx]).removeClass("d-none");

    event.preventDefault();
}

function prevSection(event) {
    $(sections[activeSectionIdx]).addClass("d-none");
    $(sections[--activeSectionIdx]).removeClass("d-none");

    event.preventDefault();
}

$(document).ready(() => {
    $(".section").submit(nextSection);
    $(".goback-button").click(prevSection);
});