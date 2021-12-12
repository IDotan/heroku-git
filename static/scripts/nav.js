let indicator_width;
let active_nav = document.getElementById('active_nav_tab');
let scroll_top_margin;
let anchors = document.querySelectorAll('.anchors_class');
let scrolling = false;

/**
 * Update the variables effected by the screen size. 
 */
function size_updates() {
    scroll_top_margin = document.getElementsByTagName('header')[0].getBoundingClientRect()['height'];
    document.documentElement.style.setProperty('--scroll-top-margin', scroll_top_margin + 'px');
    indicator_width = parseFloat(document.getElementById('nav_indicator').getBoundingClientRect()['width']) / 2;
};

/**
 * Move the indicator on the x axis.
 */
function move_nav_indi() {
    let tab = active_nav.getBoundingClientRect();
    let left = tab['left'] - document.getElementById('nav_ul').getBoundingClientRect()['left'] + (tab['width'] / 2) - indicator_width;
    document.getElementById('nav_indicator').style.left = left + 'px'
};

/**
 * Set active tab and move the indicator.
 * 
 * @param {HTMLObjectElement} tab nav tab change to be the active on. 
 */
function nav_tab_clicked(tab) {
    active_nav.id = '';
    tab.id = 'active_nav_tab';
    active_nav = tab
    move_nav_indi();
};

/**
 * Scroll to the anchor tied to the given tab.
 * 
 * @param {HTMLObjectElement} tab nav tab the user clicked on. 
 */
function nav_tab_anchor(tab) {
    scrolling = true;
    window.scrollTo(0, document.getElementById(tab.dataset.anchor).getBoundingClientRect()['top'] - scroll_top_margin + window.pageYOffset);
    nav_tab_clicked(tab);
    setTimeout(() => { scrolling = false }, 1000)
};

/**
 * Change the nav bar active tab when the user scrolls.
 */
function tab_scrolling() {
    if (scrolling) { return };
    for (let i = 0; i < anchors.length; i++) {
        let pos = anchors[i].getBoundingClientRect();
        if ((pos['top'] > 0) && (pos['top'] <= window.innerHeight / 2)) {
            nav_tab_clicked(document.querySelector(`[data-anchor="${anchors[i].id}"]`));
        } else if ((pos['bottom'] > window.innerHeight / 2) && (pos['bottom'] < window.innerHeight)) {
            nav_tab_clicked(document.querySelector(`[data-anchor="${anchors[i].id}"]`));
        };
    };
};

// add event listeners
document.querySelectorAll('.nav_tab').forEach((tab) => {
    if (tab.tagName == "LI") {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            nav_tab_anchor(event.currentTarget);
        });
    };
});

window.addEventListener('scroll', tab_scrolling);

['load', 'resize'].forEach((action) => {
    window.addEventListener(action, () => {
        size_updates();
        move_nav_indi();
    });
});
