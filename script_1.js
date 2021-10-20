function check() {
    var a_side = parseFloat(document.getElementById('a_side').value);
    var b_side = parseFloat(document.getElementById('b_side').value);
    var c_side = parseFloat(document.getElementById('c_side').value);
    if (((a_side + b_side) > c_side) && ((b_side + c_side) > a_side) && ((a_side + c_side) > b_side)) {
        if (a_side == b_side || a_side == c_side || b_side == c_side) {
            if (a_side == b_side && a_side == c_side) {
                document.getElementById("result").innerHTML = "Равносторонний";
                document.getElementById("res_image").innerHTML = "<img src=\"tr-3.jpg\" width=\"100px \" height=\"100px \">";
            }
            else {
                document.getElementById("result").innerHTML = "Равнобедренный";
                document.getElementById("res_image").innerHTML = "<img src=\"tr-2.jpg\" width=\"100px \" height=\"100px \">";
            }
        }
        else {
            document.getElementById("result").innerHTML = "Существует";
            document.getElementById("res_image").innerHTML = "<img src=\"tr-1.jpg\" width=\"100px \" height=\"100px \">";
        }
    }
    else {
        document.getElementById("result").innerHTML = "Треугольник не существует";
        document.getElementById("res_image").innerHTML = "<img src=\"tr-4.jpg\" width=\"100px \" height=\"100px \">";
    }

}

document.getElementById('check').addEventListener('click', check);