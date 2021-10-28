let nav_mousedown_m = 0;

/**
 * Toggle class 'disable_scroll' when mobile menu open or close
 */
function scrollControl() {
    document.getElementsByTagName('body')[0].classList.toggle('disable_scroll');
};

/**
 * Close mobile menu, un check the checkbox and enable scrolling.
 */
function mobile_menu_close() {
    document.getElementById('menu_toggle').checked = false;
    document.getElementsByTagName('body')[0].classList.remove('disable_scroll');
};

/**
 * When click/touch down in mobile menu get the start coordinate.
 * 
 * @param {Object} event event object from the listener
 */
function nav_swip_down(event) {
    if (event.type == 'mousedown') {
        nav_mousedown_m = event.clientX;
    } else {
        nav_mousedown_m = event.touches[0].clientX;
    };
};

/**
 * When click/touch down in mobile menu and moved to the left close the menu.
 * 
 * @param {Object} event event object from the listener
 */
function nav_swip_up(event) {
    if (event.type == 'mouseup') {
        if (event.clientX < nav_mousedown_m) {
            mobile_menu_close();
        };
    } else {
        if (event.changedTouches[0].clientX < nav_mousedown_m) {
            mobile_menu_close();
        };
    };
};

/**
 * Event listener to close the mobile menu when a link is clicked.
 */
function navLinksEvents() {
    let links = document.getElementsByTagName('nav')[0].children;
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', mobile_menu_close);
    };
};

/**
 * Event listeners to close mobile menu when draging left.
 */
function mobile_nav_close_listener() {
    document.getElementsByTagName('nav')[0].addEventListener('mousedown', nav_swip_down);
    document.getElementsByTagName('nav')[0].addEventListener('touchstart', nav_swip_down);
    document.getElementsByTagName('nav')[0].addEventListener('mouseup', nav_swip_up);
    document.getElementsByTagName('nav')[0].addEventListener('touchend', nav_swip_up);
};

/**
 * Switch display from python to web projects.
 */
function project_tab_switch() {
    let tab = this.getElementsByTagName('span')[0].innerText;
    let folder = document.getElementById('projects_folder');
    document.querySelectorAll('.projects_tab').forEach((tab) => { tab.classList.remove('sunken_tab') });
    if (tab == "Python projects") {
        folder.className = "python_tab";
        document.getElementsByClassName('projects_tab web_tab')[0].classList.add('sunken_tab');
    } else if (tab == "Web projects") {
        folder.className = "web_tab";
        document.getElementsByClassName('projects_tab python_tab')[0].classList.add('sunken_tab');
    };
}

/**
 * Set the sites links dynamicly according to the host.
 */
function dynamic_site_links() {
    let link = window.location.href;
    link = link.split('#', 1)[0];
    link.slice(-1) == '/' ? link = link : link += '/';
    document.getElementById('cv_link').href = link;
    document.getElementById('ptp_link').href = link + 'PointToPoint';
    document.getElementById('memory_link').href = link + 'memoryCardGame';
};

/**
 * Show or hide projects according to page position.
 */
function show_hide_projects() {
    let folder = document.getElementById('projects_folder');
    if (folder.getBoundingClientRect().y > window.innerHeight || folder.getBoundingClientRect().bottom < 0) { return };
    let zip = [document.getElementById('python_projects').children, document.getElementById('web_projects').children];
    let max;
    zip[0].length > zip[1].length ? max = zip[0].length : max = zip[1].length;
    for (let i = 0; i < max; i++) {
        let projet_pos = zip[0][i].getBoundingClientRect();
        if (!document.getElementById('projects_folder').classList.contains('python_tab')) { projet_pos = zip[1][i].getBoundingClientRect() };
        if (projet_pos.bottom - (projet_pos.height * 0.7) <= window.innerHeight) {
            zip[0][i].classList.remove('hide');
            if (zip[1][i]) { zip[1][i].classList.remove('hide'); }
        } else {
            zip[0][i].classList.add('hide');
            if (zip[1][i]) { zip[1][i].classList.add('hide'); }
        };
    };
};

/**
 * Assaign all event listeners for the page.
 */
function eventAssign() {
    window.addEventListener('resize', mobile_menu_close);
    document.getElementsByClassName('menu_btn')[0].addEventListener('click', scrollControl);
    navLinksEvents();
    mobile_nav_close_listener();
    document.querySelectorAll('.projects_tab').forEach((tab) => {
        tab.addEventListener('click', project_tab_switch);
    });
};

dynamic_site_links();
eventAssign();
window.onload = () => {
    mobile_menu_close();
    show_hide_projects();
};
window.addEventListener('scroll', show_hide_projects);
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});