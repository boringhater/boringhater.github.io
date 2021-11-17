split_btn.onclick = function() {
    let input_str = words_input.value;
    if (input_str.length !=0) {
        let words_map = splitWords(input_str);
        updateWordsList(words_map);
        clearInputs();
    }
}

function splitWords(input_str) {
    let words_arr = input_str.split("-").map(word => word.trim());
    let ret_map = new Map();
    words_arr
        .filter(element => isNaN(element))
        .sort()
        .forEach((word, id) => ret_map.set(`a${id + 1}`, word));
    words_arr
        .filter(element => !isNaN(element))
        .sort((a, b) => a - b)
        .forEach((number, id) => ret_map.set(`n${id + 1}`, number));
    return ret_map;
}

function updateWordsList(words_map) {
    words_list.innerHTML = "";
    words_map.forEach((value, id) => {
        let btn = document.createElement('button');
        btn.setAttribute("id", "word_btn");
        btn.innerHTML = id + ' ' + value;
        btn.onclick = function () {
            writeWord(value);
        }
        words_list.append(btn);
    });
}

function writeWord(new_word) {
    let words = red_box.innerHTML;
    red_box.innerHTML = words + ' ' + new_word;
}

function clearInputs() {
    red_box.innerHTML = '';
    words_input.value = '';
}

