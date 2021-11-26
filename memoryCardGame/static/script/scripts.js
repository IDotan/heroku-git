const developers_data = {
    card_count: document.getElementsByClassName('about tab').length,
    card_width: 0,
    card_z: null,
    card_deg: 0,
    easter_egg: false,
    clicks: -1
};
developers_data.card_deg = Math.round(360 / developers_data.card_count)
const user_data = {
    name: "bob",
    mail: "e@mail.com",
    score: -1,
    time: 9999999
};
const share_msg = "Check out the score I got here:\n";
const game_data = {
    cards_count: 0,
    min_width: 1024,
    cards_in_column: 3,
    start_flip: 600,
    start_timer_timeout: null,
    start_time: 0,
    stored_time: 0,
    time_interval: null,
    game_paused: true,
    score: 0,
    cards_folder: "static/img/card_images/",
    card_img_index: [],
    card_imgs: ["avocado.svg", "banana.svg", "chili.svg", "blueberry.svg", "onion.svg", "pineapple.svg", "raspberry.svg", "tomato.svg", "watermelon.svg"],
    fliped_card: null
}

/******************** Nav bar ********************/

/**
 * Show the relevent page section while hiding all the others.
 * 
 * @param {Number} show section DOM "index" to show. * 
 */
function section_switch(show) {
    let sections_array = document.querySelectorAll(".page_section")
    sections_array.forEach((section, index) => {
        if (index == show) {
            section.classList.remove('hide');
        } else {
            section.classList.add('hide');
        };
    });
};

/******************** Landing screen ********************/

/**
 * Switch landing page sections, and update the carousel when needed.
 */
function taggle_landingscreen_sections() {
    document.querySelectorAll('.landing_screen_sections').forEach((section) => {
        section.classList.toggle('hide');
    });
    document.getElementById('landing_screen').classList.toggle('dev_img');
    if (!document.getElementById('developers_carousel_container').classList.contains('hide')) {
        developers_data_set();
        developers_about_carousel();
        about_carousel_random();
    };
};

/******* developers carousel *******/

/**
 * Set developers_data that are affected by the screen size.
 */
function developers_data_set() {
    let card_style = window.getComputedStyle(document.getElementsByClassName('about')[0]);
    let width = parseFloat(card_style.getPropertyValue("width").slice(0, -2));
    let gap = parseFloat(card_style.getPropertyValue("left").slice(0, -2)) * 2;
    developers_data.card_width = width + gap;
    developers_data.card_z = Math.round((developers_data.card_width / 2) / Math.tan(Math.PI / developers_data.card_count));
};

/**
 * Give the about cards the needed proprty for the carousel.
 */
function developers_about_carousel() {
    let temp = document.querySelectorAll('.about.tab');
    temp.forEach((div, index) => {
        div.style.transform = "rotateY(" + developers_data.card_deg * index + "deg) translateZ(" + developers_data.card_z + "px)";
    });
};

/**
 * When the right sequence clicks where made and then add the easter egg.
 * 
 * @param {Number} n direction from the clicked carousel arrow
 */
function carousel_easter_egg(n) {
    /**
     * Create the easter egg div.
     * 
     * @returns {HTMLElement} easter egg div element.
     */
    function create_easter_div() {
        let div = document.createElement("div");
        div.id = "dev_easteregg";
        div.className = "about tab";
        div.dataset.new = true;
        let img = document.createElement("img");
        img.setAttribute("src", "static/img/carousel_images/mug.jpg");
        let h2 = document.createElement("h2");
        h2.innerText = "Coffee";
        div.append(img);
        div.append(h2);
        return div;
    };

    /**
     * Update the carousel needed data.
     */
    function carousel_data_update() {
        developers_data.card_count += 1;
        developers_data.card_deg = Math.round(360 / developers_data.card_count);
        developers_data_set();
        developers_about_carousel();
        document.getElementById('developers_carousel').style.transform = "rotateY(0deg)";
    };

    let code = [1, 1, -1, 1];
    developers_data.clicks == code.length - 1 ? developers_data.clicks = -1 : developers_data.clicks += 1;
    if (code[developers_data.clicks] != n) {
        developers_data.clicks = -1;
    } else if (developers_data.clicks == code.length - 1) {
        developers_data.easter_egg = true;
        document.getElementById('developers_carousel').append(create_easter_div());
        carousel_data_update();
        document.querySelector('.about.center').classList.remove('center');
    };
};

/**
 * Rotate the developers carousel to right or left by the given direction.
 * 
 * @param {Number} direction 1 rotate right, -1 rotate left
 */
function rotate_carousel(direction) {
    /**
     * Change the 'center' class to be on the new center tab.
     * 
     * @param {HTMLElement} old_center old tab with 'center' class
     * @param {Number} direction rotate direction
     */
    function change_center(old_center, direction) {
        old_center.classList.remove('center');
        let new_center;
        if (direction < 0) {
            new_center = old_center.nextElementSibling;
            if (new_center == null) {
                new_center = document.querySelector('.about.tab');
            };
        } else {
            new_center = old_center.previousElementSibling;
            if (new_center.classList.contains('placeholder')) {
                let nodlist = document.querySelectorAll('.about.tab');
                new_center = nodlist[nodlist.length - 1];
            };
        };
        new_center.classList.add('center');
    };

    if (developers_data.easter_egg == false) {
        carousel_easter_egg(direction);
    };
    let carousel = document.getElementById('developers_carousel');
    let deg = carousel.style.transform.slice(8, -4);
    deg == "" ? deg = 0 : deg = parseInt(deg);
    carousel.style.transform = "rotateY(" + (deg + (developers_data.card_deg * direction)) + "deg)";
    if (Math.abs(direction) == 1) {
        let old_center = document.querySelector('.about.center');
        if (!old_center) {
            let easteregg = document.getElementById('dev_easteregg');
            if (easteregg && easteregg.dataset.new) {
                easteregg.classList.add('center');
                delete easteregg.dataset.new;
            };
            return;
        };
        change_center(old_center, direction);
    };
};

/**
 * Change developers carousel to random place.
 */
function about_carousel_random() {
    document.getElementById('developers_carousel').style.transform = "rotateY(0deg)";
    document.querySelector('.about.center').classList.remove('center');
    let tab = Math.floor((Math.random() * developers_data.card_count) + 1);
    developers_data.clicks = -2;
    rotate_carousel(tab);
    // calculat the new center tab
    tab = (developers_data.card_count - 1) - (tab - 1);
    document.querySelectorAll('.about.tab')[tab].classList.add('center');
};

/******* popup *******/
let popup = document.getElementById("popup_container");
let openPopup = document.getElementById('start_btn');
let closePopupBttn = document.getElementById('close_popup');
let loginBtn = document.getElementById('login_btn')

openPopup.addEventListener('click', showPopup)
closePopupBttn.addEventListener('click', closePopup);
loginBtn.addEventListener('click', logIn)
let popupEnter = (event) => { if (event.keyCode == 13) logIn() }
let popupEsc = (event) => { if (event.keyCode == 27) closePopup() }

function closePopup() {
    generatePopupBackround(false);
    popup.style.display = 'none';
    [popupEnter, popupEsc].forEach((f) => { window.removeEventListener('keydown', f) });
    errorMsg(false);
}

function showPopup() {
    popup.classList.add('popup_animation')
    popup.style.display = 'block';
    generatePopupBackround(true);
    [popupEnter, popupEsc].forEach((f) => { window.addEventListener('keydown', f) });
}

function generatePopupBackround(state) {
    let landingScreen = document.getElementById('landing_screen');
    if (state && !document.getElementById('popup_backround_animation')) {
        let backroundAnimation = document.createElement('div');
        backroundAnimation.id = 'popup_backround_animation';
        landingScreen.append(backroundAnimation);
    } else if (!state)
        landingScreen.removeChild(document.getElementById('popup_backround_animation'))
}

function logIn() {
    let userInput = document.getElementsByClassName('input_form');
    let mailcheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (userInput[0].value != '' && userInput[1].value.match(mailcheck)) {
        user_data.name = userInput[0].value;
        user_data.mail = userInput[1].value;
        closePopup();
        section_switch(1);
        errorMsg(false)
    } else {
        errorMsg(true);
    }
}

function errorMsg(state) {
    let content = document.getElementById('popup_content')
    let passwordInput = document.getElementById('mail_form')
    let logerror = document.createElement('p');

    if (state) {
        logerror.id = 'error_msg'
        logerror.innerHTML = 'The E-Mail is incorrect'
        content.insertBefore(logerror, loginBtn)
    } else if (content.contains(document.getElementById('error_msg'))) {
        content.removeChild(document.getElementById('error_msg'))
    }
}

/******************** Card Game screen ********************/

/**
 * Start and pause the game timer.
 */
function timer_action() {
    if (this.innerHTML == '<i class="fas fa-play"></i>') {
        //start and unpause
        game_data.start_time = Date.now();
        game_data.time_interval = setInterval(() => {
            let time = new Date((Date.now() - game_data.start_time) + game_data.stored_time);
            time = time.toTimeString();
            document.getElementById('time').innerHTML = time.split(' ', 1)[0].slice(3, time.length);
        }, 1000);
        game_data.game_paused = false;
        this.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        //pasue
        clearInterval(game_data.time_interval);
        game_data.stored_time += Date.now() - game_data.start_time;
        game_data.game_paused = true;
        this.innerHTML = '<i class="fas fa-play"></i>';
    };
};

/**
 * Reveal cards and flip back one by one, add click events at the end.
 */
function start_game() {
    /**
     * Initialize and randomize card image and cards pairs.
     */
    function card_img_initialize() {
        shuffle_array(game_data.card_imgs);
        game_data.card_img_index = [];
        let cards_pairs = game_data.cards_count / 2;
        for (let i = 0; i < cards_pairs; i++) {
            game_data.card_img_index.push(i, i);
        };
        shuffle_array(game_data.card_img_index);
    };

    /**
     * Show then  hide the given card div and add event listener affter all cards been shown.
     * 
     * @param {HTMLElement} target card div to take action on.
     * @param {Number} loop loop count to set the dilays by.
     */
    function time_card(target, loop) {
        setTimeout(() => {
            card_flip(target);
        }, (loop * game_data.start_flip));
        setTimeout(() => {
            card_flip(target);
        }, ((loop * game_data.start_flip) + game_data.start_flip));
        setTimeout(() => {
            target.addEventListener('click', comparisonFlipCard);
        }, ((game_data.cards_count + 1) * game_data.start_flip));
    };

    card_img_initialize();
    document.getElementById('start_btn_container').classList.add('hide');
    let cards = document.querySelectorAll('.card');
    if (window.innerWidth < game_data.min_width) {
        cards.forEach((card, index) => {
            time_card(card, index);
        });
    } else {
        let cards_in_row = game_data.cards_count / game_data.cards_in_column;
        let loop_count = 0;
        for (let i = 0; i < game_data.cards_in_column; i++) {
            for (let j = 0; j < cards_in_row; j++) {
                let target_card = cards[(i + (j * game_data.cards_in_column))];
                time_card(target_card, loop_count);
                loop_count += 1;
            };
        };
    };
    game_data.start_timer_timeout = setTimeout(() => {
        let timer_btn = document.getElementById('timer_status');
        timer_btn.addEventListener('click', timer_action);
        timer_btn.click();
    }, ((game_data.cards_count + 1) * game_data.start_flip));
    mistakes = 0;
};

//Comparison of two images /
let picked = [];
let mistakes;
function comparisonFlipCard() {
    function stopTimer() {
        let btn = document.getElementById('timer_status')
        btn.click()
        btn.removeEventListener('click', timer_action);
    }

    if (game_data.game_paused) { return };
    if (picked.length != 0 && picked[0].getAttribute('data-index') == this.getAttribute('data-index')) {
        return;
    };
    card_flip(this);
    this.classList.add('selected');
    picked = [...picked, this];
    if (picked.length == 2) {
        if (picked[0].children[1].alt == picked[1].children[1].alt) {
            picked.forEach(item => {
                item.removeEventListener('click', comparisonFlipCard);
                item.classList.remove('selected');
            });
            game_data.score++;
            document.getElementById('player_score').innerHTML = game_data.score;
            game_data.cards_count -= 2;
            if (game_data.cards_count == 0) {
                document.getElementById('card_container').classList.add('victory');
                stopTimer();
            };
        } else {
            document.getElementsByClassName('mistakes_x')[mistakes].classList.add('mark');
            mistakes++;
            if (mistakes == 3) {
                document.getElementById('card_container').classList.add('lost');
                stopTimer();
            } else {
                game_data.game_paused = true;
                picked.forEach(item => {
                    setTimeout(() => {
                        card_flip(item);
                        item.classList.remove('selected');
                    }, 800);
                });
                setTimeout(() => { game_data.game_paused = false; }, 1000);
            };
        };
        picked = [];
    };
};


/**
 * Switch between the 2 board section pages
 */
function board_page_section_switch() {
    document.getElementById('difficulty_picking').classList.toggle('hide');
    document.getElementById('game_board').classList.toggle('hide');
};

/**
 * Shuffle given array. 
 * 
 * @param {Array} arr array to shuffle.
 */
function shuffle_array(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    };
};

/**
 * Initialize the memory game and add the amount of cards given.
 * 
 * @param {Number} cards numbers of card for the game.
 */
function initialize_game(cards) {
    game_data.cards_count = cards;
    const card_temp = document.getElementById('card_template');
    let board = document.getElementById('card_container');
    for (let i = 0; i < cards; i++) {
        let card = card_temp.content.cloneNode(true).children[0];
        card.dataset.index = i;
        board.appendChild(card);
    };
    document.getElementById('player_name').innerHTML = user_data.name;
    board_page_section_switch();
};

/**
 * Flip card to its other side.
 * 
 * @param {HTMLElement} card card div when not called from event listener.
 */
function card_flip(card) {
    let img_div = card.children[1];
    img_div.src == document.URL ? add_card_img(img_div, parseInt(card.dataset.index)) : setTimeout(() => { img_div.src = ""; img_div.alt = ""; }, 100);
    card.classList.toggle('flip');
};

/**
 * Add image to the given img tag.
 * 
 * @param {HTMLElement} card_img card img tag to set.
 * @param {Number} card_index card index in game_data.card_img_index.
 */
function add_card_img(card_img, card_index) {
    let img = game_data.card_imgs[game_data.card_img_index[card_index]];
    let path = document.URL.split("index")[0];
    card_img.src = path + game_data.cards_folder + img;
    card_img.alt = img.split(".")[0];
};

/**
 * Load data to user_data and move to show the updated score board
 */
function go_to_score_board() {
    if (!game_data.game_paused) { document.getElementById('timer_status').click(); };
    user_data.score = game_data.score;
    user_data.time = game_data.stored_time;
    load_score_table(sort_score_descending);
    table_arrow_switch(0);
    section_switch(2);
    reset_game();
};

/**
 * Reset the game. go back to difficulty_picking and reset the board to statr position.
 */
function reset_game() {
    if (document.getElementById('difficulty_picking').classList.contains('hide')) { board_page_section_switch() };
    let card_container = document.getElementById('card_container');
    card_container.innerHTML = "";
    card_container.className = "";
    document.getElementById('start_btn_container').classList.remove('hide');
    clearTimeout(game_data.start_timer_timeout);
    clearInterval(game_data.time_interval);
    document.getElementById('time').innerHTML = "00:00";
    document.getElementById('timer_status').innerHTML = '<i class="fas fa-play"></i>';
    document.querySelectorAll('.mistakes_x').forEach((mark) => { mark.classList.remove('mark') });
    document.getElementById('player_score').innerHTML = 0;
    game_data.score = 0;
    game_data.stored_time = 0;
};

/******************** End screen ********************/

/******* table *******/

/**
 * Sort table data by score, from lowest to largest.
 * 
 * @param {Array} a data array to check.
 * @param {Array} b data array to check.
 * @returns a[2] - b[2]
 */
function sort_score_ascending(a, b) {
    return a[2] - b[2];
};

/**
 * Sort table data by score, from largest to lowest.
 * 
 * @param {Array} a data array to check.
 * @param {Array} b data array to check.
 * @returns b[2] - a[2]
 */
function sort_score_descending(a, b) {
    return b[2] - a[2];
};

/**
 * Sort table data by time, from shortest to longest.
 * 
 * @param {Array} a data array to check.
 * @param {Array} b data array to check.
 * @returns a[3] - b[3]
 */
function sort_time_ascending(a, b) {
    return a[3] - b[3];
};

/**
 * Sort table data by time, from longest to shortest.
 * 
 * @param {Array} a data array to check.
 * @param {Array} b data array to check.
 * @returns b[3] - a[3]
 */
function sort_time_descending(a, b) {
    return b[3] - a[3];
};

/**
 * Load and sorte data in to the end screen table.
 * 
 * @param {Function} sort_function the function to sort by.
 */
function load_score_table(sort_function) {
    /**
     * Create tr element with the row data
     * 
     * @returns {HTMLElement} 'tr' element
     */
    function create_table_row() {
        let tr = document.createElement('TR');
        tr.className = 'score_table_row';
        for (let j = 1; j < 6; j++) {
            let td = document.createElement('TD');
            if (j == 1) {
                td.innerHTML = (i + 1) + '.';
            } else if (j == 4) {
                let time = Math.floor(table_data[i][td_keys[j]] / 1000);
                time >= 60 ? td.innerHTML = (time / 60).toFixed(2) + ' min' : td.innerHTML = time + ' sec';
            } else {
                td.innerHTML = table_data[i][td_keys[j]];
            };
            tr.append(td);
        };
        return tr;
    };

    let table_data = [
        ["Itai", "itai145@gmail.com", 6, 10000],
        ["Danielle", "danielle07t@gmail.com", 8, 65000],
        ["Artem", "sartem.meshkov@gmail.com", 10, 45000]];
    table_data.push([user_data.name, user_data.mail, user_data.score, user_data.time]);
    table_data.sort((a, b) => { return sort_function(a, b) });
    //td index => table_data position.
    const td_keys = { 2: 0, 3: 2, 4: 3, 5: 1 };
    let table_body = document.querySelector('#score_table').children[0];
    document.querySelectorAll('.score_table_row').forEach((row) => { row.remove() });
    for (i = 0; i < table_data.length; i++) {
        table_body.append(create_table_row());
    };
};

/**
 * Show the wanted arrow while hiding any other arrow.
 * 
 * @param {Number} show arrow "index" in the DOM to show.
 */
function table_arrow_switch(show) {
    let arrows_array = document.querySelectorAll(".sort_by");
    arrows_array.forEach((arrow, index) => {
        if (index == show) {
            arrow.classList.add("show");
            arrow.classList.remove("up");
        } else {
            arrow.classList.add("up");
            arrow.classList.remove("show");
        };
    });
};

/**
 * Sort the score table by the table header clicked.
 * 
 * @param {Object} event click event object.
 */
function table_sort_click(event) {
    let clicked_on = event.target.innerText;
    let up = event.target.classList.contains("up");
    switch (clicked_on) {
        case "Score":
            table_arrow_switch(0);
            if (up) {
                load_score_table(sort_score_descending);
            } else {
                event.target.classList.add("up");
                load_score_table(sort_score_ascending);
            };
            break;
        case "Time":
            table_arrow_switch(1);
            if (up) {
                load_score_table(sort_time_ascending);
            } else {
                event.target.classList.add("up");
                load_score_table(sort_time_descending);
            };
            break;
    };
};

/**
 * When useing shared link, load user info and show the end screen table.
 */
function shared_link() {
    let url = document.URL;
    if (url.includes("?")) {
        let url_array = url.split("?")[1].split("$");
        if (url_array.length == 4) {
            user_data.name = url_array[0];
            user_data.mail = url_array[1];
            user_data.score = parseInt(url_array[2]);
            user_data.time = parseInt(url_array[3]);
            load_score_table(sort_score_descending);
            section_switch(2);
        };
    };
};

/******* button panel *******/

/**
 * Set to start a new game, user select or difficulty pick depends on the clicked button.
 * 
 * @param {Object} event click event object. 
 */
function play_again(event) {
    if (event.target.innerHTML == "Try again") {
        section_switch(1);
    } else {
        if (!document.getElementById('developers_carousel_container').classList.contains('hide')) {
            taggle_landingscreen_sections();
        };
        section_switch(0);
        showPopup();
    };
};

/******* share *******/

/**
 * Create url link to share with the user data.
 * 
 * @returns url link
 */
function share_score() {
    return document.URL.split("?")[0] + "?" + user_data.name + "$" + user_data.mail + "$" + user_data.score + "$" + user_data.time;
};

/**
 * Open the user email with the preset body with the share link.
 */
function share_via_mail() {
    let mail_link = "mailto:?body=" + encodeURIComponent(share_msg) + share_score();
    window.open(mail_link, "_blank");
};

/**
 * Open the user whatsapp with the preset text with the share link.
 */
function share_via_whatsapp() {
    let whatsapp_link = "https://wa.me/?text=" + encodeURIComponent(share_msg) + share_score();
    window.open(whatsapp_link, "_blank");
};

/******************** On event ********************/

window.onresize = () => {
    developers_data_set();
    developers_about_carousel();
};

window.onload = () => {
    shared_link();
};
