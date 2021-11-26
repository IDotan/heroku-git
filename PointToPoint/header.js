const windod_wide_setting = 600;
let close_timer = {
    countdown: 30000, //milliseconds
    timer: null,
    close_win: null
};

function close_tooltip(event) {
    if ((event.target.id == "tooltips") ||
        (event.target.parentElement.classList[0] == "tooltip_x_btn")) {
        if (document.getElementById("tooltip_hint").classList.contains("visible")) {
            clearTimeout(close_timer.timer);
            clearTimeout(close_timer.close_win);
            tooltip_timer_before();
        };
        let popups = document.getElementsByClassName("tooltip_box");
        for (i = 0; i < popups.length; i++) {
            popups[i].classList.remove("visible");
        };
        document.getElementById("tooltips").classList.add("closed");
        if (event.target.parentElement.classList.contains("rules")) {
            sessionStorage.setItem("know", true);
        }
    };
};

function show_menu() {
    if (document.getElementById('menu_toggle').checked) {
        document.getElementById("header_links").style.left = "";
    } else {
        document.getElementById("header_links").style.left = "0";
    };
};

function close_mobile_menu() {
    document.getElementById('menu_toggle').checked = true;
    show_menu();
    document.getElementById('menu_toggle').checked = false;
};

function tooltip_timer_before() {
    document.getElementsByClassName("timer_half")[0].classList.toggle("start");
    document.getElementsByClassName("timer_half")[1].classList.toggle("start");
};

function menu_click(event) {
    let action = event.target.innerText;
    switch (action) {
        case "How to play":
            close_mobile_menu();
            document.getElementById("tooltips").classList.remove("closed");
            document.getElementById("tooltip_goal").classList.add("visible");
            break;
        case "Hint":
            close_mobile_menu();
            document.getElementById("tooltips").classList.remove("closed");
            document.getElementById("tooltip_hint").classList.add("visible");
            setTimeout(tooltip_timer_before, 100);
            close_timer.timer = setTimeout(() => {
                document.getElementById("tooltips").classList.add("closed");
                document.getElementById("tooltip_hint").classList.remove("visible");
            }, close_timer.countdown);
            close_timer.close_win = setTimeout(tooltip_timer_before, close_timer.countdown + 100);
            break;
        case "Contact me":
            close_mobile_menu();
            document.getElementById("tooltips").classList.remove("closed");
            document.getElementById("tooltip_contact").classList.add("visible");
            break;
        default:
            close_mobile_menu()
            break;
    };
};

if (sessionStorage.getItem("know") == "true") {
    document.getElementById("tooltips").classList.add("closed");
    document.getElementById("tooltip_goal").classList.remove("visible");
};

window.addEventListener('resize', close_mobile_menu);
document.getElementById('menu_toggle').checked = false;