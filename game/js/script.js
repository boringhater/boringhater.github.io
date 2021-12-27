let jars = document.querySelectorAll(".jar-arrow-wrap");
let new_level_btns = document.querySelectorAll(".new-level-btn");
let chosen_from = null;
let audio = new Audio("assets/sounds/water.wav");
let music = new Audio("assets/sounds/music.mp3");
let moves = 0;
let start_timestamp = null;
let game_works = false;
let sound_bool = true;
let username = null;
let jars_map = new Map();
let a, b, nod, i, needed;
let visual_time = 0;
let score_list = [];

class score_values {
    name
    score
    date
    constructor(name, score) {
        this.name = name;
        this.score = score;
        this.date = new Date();
    }
}

class jar_values {
    max_water
    has_water
    water_info_id
    constructor(max_water, has_water, water_info_id) {
        this.max_water = max_water;
        this.has_water = has_water;
        this.water_info_id = water_info_id;
    }
}

var intervalID = window.setInterval(upd_timer, 1000);
const timer = document.getElementById("timer");
function upd_timer() {
    if (game_works) {
        visual_time++;
        timer.innerHTML = time_to_timer(visual_time);
    }
}

for (const nlb of new_level_btns) {
    nlb.addEventListener("click", function () { make_game(); });
}

const music_slider = document.getElementById("music_slider");
music_slider.onchange = function () {
    music.volume = this.value / 100;
}
music_slider.oninput = function () {
    music.volume = this.value / 100;
}

let sound_btn = document.getElementById("sound_btn");
sound_btn.onclick = function () {
    if (sound_bool) {
        sound_btn.style.backgroundImage = "url(\"assets/images/no_sound.png\")";
        audio.volume = 0;
        sound_bool = false;
    }
    else {
        sound_btn.style.backgroundImage = "url(\"assets/images/sound.png\")";
        audio.volume = 1;
        sound_bool = true;
    }
}

const play_btn = document.getElementById("play_btn");
play_btn.onclick = function () {
    username = document.getElementById("username").value;
    if (username != null && username != "") {
        make_game();
        document.getElementById("start_overlay").style.display = "none";
    }
    else {
        alert("Введите имя игрока");
    }

}

const theme_btn = document.getElementById("theme_btn");
let theme = 1;
theme_btn.onclick = function () {
    if (theme == 1) {
        document.getElementById("theme").href = "assets/css/game_style2.css";
        theme = 2;
    }
    else {
        document.getElementById("theme").href = "assets/css/game_style1.css";
        theme = 1;
    }
}

save_btn.onclick = function () {
    let text = get_scores_info();
    let cur_date = new Date();
    var filename = "game_scores_" + cur_date.getDay() + "." + cur_date.getMonth() + "_" + cur_date.getHours() + "." + cur_date.getMinutes() + ".txt";
    download(filename, text);
}

function download(file, text) {
    var element = document.createElement('a');
    element.setAttribute('href',
        'data:text/plain;charset=utf-8,'
        + encodeURIComponent(text));
    element.setAttribute('download', file);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

for (const jar of jars) {
    jar.addEventListener("mouseover", function () {
        if (chosen_from == null) {    //Ставим стрелочку туда, откуда можем взять воду
            if (jars_map.get(jar.id).has_water > 0) {
                jar.querySelector('.arrow').style = '.arrow';
                jar.querySelector('.arrow').style.opacity = 100;
            }
        }
        else if (chosen_from != jar.id) { //Выбираем, куда можем заливать воду
            if (jars_map.get(jar.id).has_water < jars_map.get(jar.id).max_water) {
                jar.querySelector('.arrow').style.transform = 'rotate(180deg)';
                jar.querySelector('.arrow').style.opacity = 100;
            }
        }
    })
    jar.addEventListener("mouseout", function () {
        if (chosen_from == jar.id) { //Оставить стрелку на выбранной колбе
            jar.querySelector('.arrow').style.opacity = 100;
        }
        else { //Убрать стрелку с невыбранной колбы
            jar.querySelector('.arrow').style.opacity = 0;
        }
    })
    jar.addEventListener("click", function () {
        if (chosen_from != null) {
            if (chosen_from != jar.id) { //Залить в jar воду из chosen_from
                if (jars_map.get(jar.id).has_water < jars_map.get(jar.id).max_water) {
                    pour(chosen_from, jar.id);
                    document.getElementById(chosen_from).querySelector('.arrow').style.opacity = 0;
                    chosen_from = null;
                    jar.querySelector('.arrow').style = '.arrow';
                }
            }
            else { //Ткнули на уже выбранное -> отменить выбор chosen_from
                jar.querySelector('.arrow').style = '.arrow'
                jar.querySelector('.arrow').style.opacity = 0;;
                chosen_from = null;
            }
        }
        else { //Выбираем, откуда берем воду
            if (jars_map.get(jar.id).has_water > 0) {
                chosen_from = jar.id;
                jar.querySelector('.arrow').style.opacity = 100;
            }
        }
    })
    jar.parentElement.querySelector('.plus-btn').addEventListener("click", function () { //заполнить водой по кнопке +
        if (jars_map.get(jar.id).has_water < jars_map.get(jar.id).max_water) {
            fill(jar.id);
        }
    })
    jar.parentElement.querySelector('.minus-btn').addEventListener("click", function () { //слить воду по кнопке -
        if (jars_map.get(jar.id).has_water > 0) {
            spill(jar.id);
        }
    })
}

function get_nod(a, b) { //нод чисел
    while (a != b) {
        if (a > b) {
            tmp = a;
            a = b;
            b = tmp;
        }
        b = b - a;
    }

    return a;
}

function fill(to_id) { //заполнить
    if (game_works) {
        jars_map.set(to_id, new jar_values(jars_map.get(to_id).max_water, jars_map.get(to_id).max_water, jars_map.get(to_id).water_info_id));
        audio.play();
        new_move();
        update_water_info(to_id);
        set_water_level(to_id);
    }
}

function spill(from_id) { //вылить
    if (game_works) {
        jars_map.set(from_id, new jar_values(jars_map.get(from_id).max_water, 0, jars_map.get(from_id).water_info_id));
        audio.play();
        new_move();
        update_water_info(from_id);
        set_water_level(from_id);
    }
}

function pour(from_id, to_id) { //перелить из 1 в 2
    if (game_works) {
        let space_left = jars_map.get(to_id).max_water - jars_map.get(to_id).has_water;
        if (jars_map.get(from_id).has_water > space_left) {
            jars_map.set(to_id, new jar_values(jars_map.get(to_id).max_water, jars_map.get(to_id).max_water, jars_map.get(to_id).water_info_id));
            jars_map.set(from_id, new jar_values(jars_map.get(from_id).max_water, jars_map.get(from_id).has_water - space_left, jars_map.get(from_id).water_info_id));
        }
        else {
            jars_map.set(to_id, new jar_values(jars_map.get(to_id).max_water, jars_map.get(to_id).has_water + jars_map.get(from_id).has_water, jars_map.get(to_id).water_info_id));
            jars_map.set(from_id, new jar_values(jars_map.get(from_id).max_water, 0, jars_map.get(from_id).water_info_id));
        }
        audio.play();
        new_move();
        update_water_info(from_id);
        update_water_info(to_id);
        set_water_level(from_id);
        set_water_level(to_id);
    }
}

function update_water_info(jar_id) {
    document.getElementById(jars_map.get(jar_id).water_info_id).innerHTML = jars_map.get(jar_id).has_water + "/" + jars_map.get(jar_id).max_water;
}

function new_move() {
    moves++;
    document.getElementById("moves_info").innerHTML = "Moves: " + moves;
    for (let jar_values of jars_map.values()) {
        if (jar_values.has_water == needed) {
            win();
        }
    }
}

function make_game() { //НОРМАЛЬНО ПОСЧИТАТЬ i, needed
    moves = 0;
    a = Math.floor(Math.random() * 10) + 2;
    jars_map.set("jar_wrap_left", new jar_values(a, 0, "water_info_left"));
    update_water_info("jar_wrap_left");
    b = 0;
    do {
        b = Math.floor(Math.random() * 12) + 2;
    } while (a == b);
    jars_map.set("jar_wrap_right", new jar_values(b, 0, "water_info_right"));
    update_water_info("jar_wrap_right");
    nod = get_nod(a, b);
    do {
        needed = nod * (Math.round(Math.random() * (a + b) / nod) + 1);
    } while (needed % nod != 0 || needed == a || needed == b || needed == 0);
    i = Math.round((a + b) * (Math.random() / 2 + 1));
    if (i <= needed) { i = needed + 3; };
    jars_map.set("jar_wrap_center", new jar_values(i, 0, "water_info_center"));
    for (const jar of jars) {
        set_water_level(jar.id);
    }
    update_water_info("jar_wrap_center");
    document.getElementById("game_task").innerHTML = "Need: " + needed;
    document.getElementById("moves_info").innerHTML = "Moves: " + moves;
    start_timestamp = new Date();
    game_works = true;
    music.play();
    visual_time = 0;
    timer.innerHTML = "0:00";
}

function get_score() {
    return Math.round(10 * ((10 / Math.sqrt(moves + 4))) / (Date.now() - start_timestamp) * 50000);
}

function win() {
    game_works = false;
    let score = get_score();
    score_list.push(new score_values(username, score));
    document.getElementById("win_overlay").style.display = "flex";
    document.getElementById("win_overlay").innerHTML = "<div class=\"new-level-btn\" id=\"nlb\" style=\"width:20%\"></div></br><div class=\"big-text\">Good Job,<br>" + username + "!</br>Score: " + score + "</div>";
    document.getElementById("nlb").addEventListener('click', function () { make_game(); document.getElementById("win_overlay").style.display = "none"; });
}

function set_water_level(jar_id) {
    let water_lvl = 70 * (jars_map.get(jar_id).has_water / jars_map.get(jar_id).max_water);
    if (water_lvl < 5) {
        water_lvl = 0;
        document.getElementById(jar_id).querySelector('.water-bottom').style.opacity = 0;
        document.getElementById(jar_id).querySelector('.water').style.opacity = 0;
    }
    else {
        document.getElementById(jar_id).querySelector('.water-bottom').style.opacity = 0.5;
        document.getElementById(jar_id).querySelector('.water').style.opacity = 0.5;
    }
    document.getElementById(jar_id).querySelector('.water').style.height = water_lvl + "%";
}

function time_to_timer(seconds) {
    if (seconds % 60 > 9) {
        return Math.floor(seconds / 60) + ":" + (seconds % 60);
    }
    return Math.floor(seconds / 60) + ":0" + (seconds % 60);
}

function get_scores_info() {
    let text = "username,score,date\n";
    for (const game of score_list) {
        text += "\n" + game.name + "," + game.score + "," + game.date;
    }
    return text;
}