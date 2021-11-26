class Puzzle {
    #windod_wide_setting = 600;
    #game_tiles = document.getElementsByClassName('tile');
    #tile_scale = 1.2;
    #tiles_data = {
        draging_tile: null,
        selected_tile: '',
        tiles_pos: [],
        center_offset: 0
    };
    #tiles_arry = [
        [0, 'yellow', 'blue', 'red', 'green'],
        [0, 'red', 'blue', 'green', 'yellow'],
        [0, 'green', 'red', 'yellow', 'blue'],
        [0, 'green', 'red', 'yellow', 'blue'],
        [0, 'yellow', 'green', 'blue', 'red'],
        [0, 'yellow', 'green', 'blue', 'red'],
        [0, 'blue', 'yellow', 'red', 'green'],
        [0, 'red', 'blue', 'yellow', 'green']
    ];
    #spin_timeout;
    #game_status = {
        checking: false,
        solved: false
    };

    constructor() {
        this.#tiles_shuffle();
        this.#start_game();
        this.populate_tile_position_array();
        this.#add_events();
    };

    new_game() {
        // clear selected if there is one 
        this.#set_selected_tile('');
        for (let i = 0; i < this.#game_tiles.length; i++) {
            this.#game_tiles[i].className = "tile";
        };
        this.#tiles_shuffle();
        this.#start_game();
        this.#game_status.solved = false;
        this.#controls_swip();
    };

    /**
    * Shuffle the tile array for a random game. Suffle the tiles order
    *  and every tile rotation position.
    */
    #tiles_shuffle() {
        for (let i = this.#tiles_arry.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            this.#tiles_arry[i][0] = Math.floor(Math.random() * 4);
            const temp = this.#tiles_arry[i];
            this.#tiles_arry[i] = this.#tiles_arry[j];
            this.#tiles_arry[j] = temp;
        };
    };

    /**
    * Get the current colors order from the array. Start at the top and go clockwise.
    * 
    * @param {Number} tile_index index of the tile in the array
    * @returns {Array} array of the current colors.
     */
    #get_tile_colors(tile_index) {
        let pos = this.#tiles_arry[tile_index][0];
        let colors = []
        if (pos == 1) {
            colors = [this.#tiles_arry[tile_index][4], this.#tiles_arry[tile_index][1], this.#tiles_arry[tile_index][2], this.#tiles_arry[tile_index][3]];
        } else if (pos == 2) {
            colors = [this.#tiles_arry[tile_index][3], this.#tiles_arry[tile_index][4], this.#tiles_arry[tile_index][1], this.#tiles_arry[tile_index][2]];
        } else if (pos == 3) {
            colors = [this.#tiles_arry[tile_index][2], this.#tiles_arry[tile_index][3], this.#tiles_arry[tile_index][4], this.#tiles_arry[tile_index][1]];
        } else {
            colors = [this.#tiles_arry[tile_index][1], this.#tiles_arry[tile_index][2], this.#tiles_arry[tile_index][3], this.#tiles_arry[tile_index][4]];
        };
        // fix the alignment when the bord is vertical
        if (window.innerWidth >= this.#windod_wide_setting) {
            let temp = [colors[1], colors[2], colors[3], colors[0]];
            colors = temp;
        };
        return colors;
    };

    /**
    * Set tile child nodes to the tile colors.
    * 
    * @param {Node} tile tile div
    * @param {Number} array_index index of the div in the arry_tiles
     */
    #set_tile_colors(tile, array_index) {
        let children = tile.children;
        let tile_colors = this.#get_tile_colors(array_index);
        for (let j = 0; j < 4; j++) {
            children[j].className = `color ${tile_colors[j]}`;
        };
    };

    /**
     * Start the game, set tile according to tile_array index and set the chiled
     * nodes to the correct colors.
     */
    #start_game() {
        for (let i = 0; i < this.#game_tiles.length; i++) {
            this.#game_tiles[i].classList.add(i);
            this.#game_tiles[i].style.transform = `rotate(45deg) scale(${this.#tile_scale})`;
            this.#set_tile_colors(this.#game_tiles[i], i);
        };
    };

    /**
     * Rearrange the board visually, fixing the visual on screen resize.
     * Mostly needed only when changing from horizontal to vertical borad.  
     */
    resize_rearrange() {
        for (let i = 0; i < this.#game_tiles.length; i++) {
            let array_index = this.#game_tiles[i].classList[1];
            this.#set_tile_colors(this.#game_tiles[i], array_index);
            this.#game_tiles[i].style.transform = `rotate(45deg) scale(${this.#tile_scale})`;
        };
    };

    /**
     * Check the give colors array if all triples are maching.
     * 
     * @param {Array} colors array of the tiles colors
     * @returns array of the triple color in order. false when not every triple match.
     */
    #triple_Boolean(colors) {
        let triple_color = [
            //top
            (colors[5][1] == colors[3][0] && colors[5][1] == colors[0][3]) ? colors[5][1] : false,
            // first per
            (colors[5][2] == colors[3][3] && colors[5][2] == colors[6][0]) ? colors[5][2] : false,
            (colors[0][2] == colors[1][0] && colors[0][2] == colors[3][1]) ? colors[0][2] : false,
            //secend per
            (colors[6][2] == colors[4][3] && colors[6][2] == colors[7][0]) ? colors[6][2] : false,
            (colors[1][2] == colors[4][1] && colors[1][2] == colors[2][0]) ? colors[1][2] : false,
            //bottom
            (colors[7][1] == colors[4][2] && colors[7][1] == colors[2][3]) ? colors[7][1] : false
        ];
        if (triple_color.indexOf(false) > -1) {
            return false;
        }
        return triple_color;
    };

    /**
     * Check if the puzzle is solved.
     */
    check_board() {
        this.#game_status.checking = true;
        // get the current colors from the array based of tile index and rotation
        let current_colors = [];
        for (let i = 0; i < this.#tiles_arry.length; i++) {
            let colors = this.#get_tile_colors(this.#game_tiles[i].classList[1]);
            if (window.innerWidth >= this.#windod_wide_setting) {
                let temp = [colors[3], colors[0], colors[1], colors[2]];
                colors = temp;
            };
            current_colors.push(colors);
        };
        // check the center 4
        if ((current_colors[1][3] != current_colors[3][2]) ||
            (current_colors[4][0] != current_colors[6][1]) ||
            (current_colors[1][3] != current_colors[6][1])) {
            this.#game_status.checking = false;
            return;
        };
        let center = current_colors[1][3];
        //check if all triples match 
        let triples = this.#triple_Boolean(current_colors);
        if (triples == false) {
            this.#game_status.checking = false;
            return;
        };
        // check the diagnle to be correct
        if (((triples[1] != triples[4]) && (triples[1] == center)) ||
            ((triples[2] != triples[3]) && (triples[2] == center))) {
            this.#game_status.checking = false;
            return;
        };
        this.#controls_swip();
        this.#set_selected_tile("");
        this.#game_status.solved = true;
        this.#game_status.checking = false;
    };

    /**
     * Toggle puzzle panel visibility.
     */
    #controls_swip() {
        let panels = document.getElementsByClassName("game_controls");
        panels[0].classList.toggle('hide');
        panels[1].classList.toggle('hide');
    }

    /**
     * Set new selected tile, toggle class 'selected' on the old and new node
     * then set new tile to the new_select. use empty string to clear selected.
     * 
     * @param {String} new_select class name of the new tile, "" to clear selected
     */
    #set_selected_tile(new_select) {
        if (this.#tiles_data.selected_tile) {
            document.getElementsByClassName(this.#tiles_data.selected_tile)[0].classList.toggle('selected');
        };
        if (new_select == "") {
            this.#tiles_data.selected_tile = '';
            return;
        };
        // slice the name to get only the first 2 classes 'tile index'
        document.getElementsByClassName(new_select.slice(0, 6))[0].classList.toggle('selected');
        this.#tiles_data.selected_tile = new_select;
    };

    /**
    * When clicking on game tile, set it to the 'selected tile'
    * 
    * @param {Event} event event data from the listener
    * @returns {Object} div of the tile 
    */
    select_tile(event) {
        if (this.#game_status.solved == true) {
            return;
        };
        let tile = event.target;
        if (event.target.className.indexOf('tile') == -1) {
            tile = event.target.parentElement;
        };
        this.#set_selected_tile(tile.className);
        return tile
    };

    /**
     * Get the current tile degree from the inline style.
     * 
     * @param {Node} tile tile div
     * @returns {Number}    tile current degree
     */
    #get_tile_deg(tile) {
        let transform_list = tile.style.transform.split(" ");
        let deg;
        for (let i = 0; i < transform_list.length; i++) {
            if (transform_list[i].indexOf('rotate') > -1) {
                deg = parseInt(transform_list[i].slice(7, -4));
                break
            };
        };
        return deg;
    };

    /**
     * Change the rotaition indicator in the tiles array. 
     * 
     * @param {Node} tile tile div
     * @param {String} direction "right"/"left" to indecate the direction 
     */
    #rotate_array_tile(tile, direction) {
        let tile_index = tile.classList[1];
        let tile_rotaiton = this.#tiles_arry[tile_index][0];
        let new_rotaiton = tile_rotaiton + 1;
        if (direction == 'left') {
            new_rotaiton = tile_rotaiton - 1;
        };
        if (new_rotaiton > 3) {
            new_rotaiton = 0;
        } else if (new_rotaiton < 0) {
            new_rotaiton = 3;
        };
        this.#tiles_arry[tile_index][0] = new_rotaiton;
    };

    /**
     * Set the the tile new rotate degree.
     * 
     * @param {Node} tile tile div
     * @param {Number} deg degree to set
     */
    #set_tile_deg(tile, deg) {
        tile.style.transform = `rotate(${deg}deg) scale(${this.#tile_scale})`;
    };

    /**
     * Rotate the selected tile to the give direction.
     * 
     * @param {String} direction "right"/"left" to indecate the direction
     */
    rotate_selected(direction) {
        if ((this.#tiles_data.selected_tile == '') ||
            this.#game_status.checking) {
            return;
        };
        let tile = document.getElementsByClassName(this.#tiles_data.selected_tile)[0]
        let deg = this.#get_tile_deg(tile);
        let new_deg = deg + 90;
        if (direction == 'left') {
            new_deg = deg - 90;
        };
        tile.style.transition = "transform 1s";
        clearTimeout(this.#spin_timeout);
        this.#spin_timeout = setTimeout(() => { tile.style.transition = '' }, 1000);
        this.#set_tile_deg(tile, new_deg);
        this.#rotate_array_tile(tile, direction);
        this.check_board();
    };

    /**
    * Rest and populate "tile_array" of the tiles positions. Uses at the 
     * start and when changing sceen size to stay accurate.
    */
    populate_tile_position_array() {
        this.#tiles_data.tiles_pos = [];
        for (let el = 0; el < this.#game_tiles.length; el++) {
            this.#tiles_data.tiles_pos.push(this.#game_tiles[el].getBoundingClientRect());
        };
        this.#tiles_data.center_offset = Math.round(Math.sqrt((((this.#tiles_data.tiles_pos[0].width / this.#tile_scale) ** 2) / 2)) / 2);
    };

    /**
     * Set up tile to be draged on the screen.
    * 
    * @param {Event} event mousedown/touchstart event object
    */
    #mouse_down_on_tile(event) {
        if (this.#game_status.solved == true) {
            return;
        };
        this.#tiles_data.draging_tile = this.select_tile(event);
        this.#set_selected_tile(this.#tiles_data.draging_tile.className);
    };

    /**
    * When the pointer is moving with a tile "in hand", move the tile
     * to follow the pointer.
     * 
     * @param {Event} event mousemove/touchmove event object
     */
    #mouse_move_with_tile(mouse_pos) {
        if (this.#tiles_data.draging_tile) {
            this.#tiles_data.draging_tile.style.position = 'absolute';
            this.#tiles_data.draging_tile.style.left = `${mouse_pos.x - this.#tiles_data.center_offset}px`;
            this.#tiles_data.draging_tile.style.top = `${mouse_pos.y - this.#tiles_data.center_offset}px`;
            this.#tiles_data.draging_tile.style.zIndex = 1;
        };
    };

    /**
     * Clear draged tile dragin setting back to the original.
    */
    #clear_drag_settings() {
        if (this.#tiles_data.draging_tile) {
            let down_deg = this.#get_tile_deg(this.#tiles_data.draging_tile);
            this.#tiles_data.draging_tile.style = '';
            this.#set_tile_deg(this.#tiles_data.draging_tile, down_deg);
        };
    };

    /**
    * When releaseing a tile upon onther tile switch there places. 
    * 
    * @param {Event} event mouseup/touchend event object
    */
    #mouse_up_on_tile(mouse_pos) {
        if ((this.#game_status.solved == true) ||
            (this.#tiles_data.draging_tile == null) ||
            this.#game_status.checking) {
            return;
        };
        // restore #tiles_data.draging_tile back to the state before draging
        this.#clear_drag_settings();
        // check what tile was droped upon
        let tile_index = -1;
        for (let i = 0; i < this.#tiles_data.tiles_pos.length; i++) {
            if ((this.#tiles_data.tiles_pos[i].left + this.#tiles_data.center_offset < mouse_pos.x) &&
                (mouse_pos.x < this.#tiles_data.tiles_pos[i].right - this.#tiles_data.center_offset)) {
                if ((this.#tiles_data.tiles_pos[i].top + this.#tiles_data.center_offset < mouse_pos.y) &&
                    (mouse_pos.y < this.#tiles_data.tiles_pos[i].bottom - this.#tiles_data.center_offset)) {
                    tile_index = i;
                    break;
                };
            };
        };
        // switch tiles
        if ((tile_index != -1) &&
            (document.getElementsByClassName('tile')[tile_index].className != this.#tiles_data.draging_tile.className)) {
            const temp = document.getElementsByClassName('tile')[tile_index];
            document.getElementsByClassName('tile')[tile_index].outerHTML = this.#tiles_data.draging_tile.outerHTML;
            this.#tiles_data.draging_tile.outerHTML = temp.outerHTML;
            this.#set_selected_tile(this.#tiles_data.draging_tile.className);
            // readd event listeners after switch
            this.#add_tile_events(document.getElementsByClassName('tile')[tile_index]);
            this.#add_tile_events(document.getElementsByClassName(temp.className)[0]);
            this.check_board();
        };
        this.#tiles_data.draging_tile = null;
    };

    /**
    * Get the mouse/touch x,y positions.
    * 
    * @param {Event} event mouse/touch event object
    * @returns {Object} {x: x position, y: position}
    */
    #get_mouseevent_pos(event) {
        let x = event.pageX;
        let y = event.pageY;
        // correcting x and y for touch screen
        if (event.changedTouches) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
        };
        return { x: x, y: y };
    };

    /**
     * Add event listeners to the given tile.
     * 
     * @param {Node} tile tile div
     */
    #add_tile_events(tile) {
        tile.addEventListener("click", () => { this.select_tile(event) }, true);
        ["mousedown", "touchstart"].forEach(i => {
            tile.addEventListener(i, () => {
                this.#mouse_down_on_tile(event);
                event.preventDefault();
            }, true);
        });
        ["mousemove", "touchmove"].forEach(i => {
            tile.addEventListener(i, () => {
                this.#mouse_move_with_tile(this.#get_mouseevent_pos(event))
            }, true);
        });
        ["mouseup", "touchend"].forEach(i => {
            tile.addEventListener(i, () => {
                this.#mouse_up_on_tile(this.#get_mouseevent_pos(event))
            }, true);
        });
    };

    #add_events() {
        for (let el = 0; el < this.#game_tiles.length; el++) {
            this.#add_tile_events(this.#game_tiles[el]);
        };
    };

    mose_out_of_board() {
        this.#set_selected_tile('');
        this.#clear_drag_settings();
        this.#tiles_data.draging_tile = null;
    }
};

let game = new Puzzle();

window.addEventListener('resize', () => {
    game.resize_rearrange();
    game.populate_tile_position_array();
});
document.getElementById('game_window').addEventListener('mouseleave', () => { game.mose_out_of_board() });
