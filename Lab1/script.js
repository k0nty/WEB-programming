console.log(`
    Функція розв'язує прямокутний трикутник за двома заданими елементами.
    Порядок аргументів: triangle(значення1, "тип1", значення2, "тип2")
    
    Доступні типи:
    - "leg" – катет
    - "hypotenuse" – гіпотенуза
    - "adjacent angle" – прилеглий до катета кут (у градусах)
    - "opposite angle" – протилежний до катета кут (у градусах)
    - "angle" – один із гострих кутів (у градусах, коли задана гіпотенуза)
    
    Приклади виклику:
    - triangle(3, "leg", 4, "hypotenuse") – катет і гіпотенуза
    - triangle(5, "leg", 6, "leg") – два катети
    - triangle(30, "opposite angle", 4, "leg") – протилежний кут і катет
    - triangle(8, "hypotenuse", 45, "angle") – гіпотенуза і кут
    
    Повернені значення:
    - "success" – обчислення успішне, результат виведено в консоль
    - "failed" – некоректний тип аргументу
    - "Zero or negative input" – введено нуль або від’ємне значення
    - "Invalid angle" – кут <= 0° або >= 90°
    - "Invalid hypotenuse" – катет >= гіпотенузи
`);


function toRadians(deg){
    return deg * (Math.PI / 180);
}

function toDegrees(rad){
    return rad * (180 / Math.PI);
}

function triangle(a1, t1, a2, t2){
    const types = ["leg", "hypotenuse", "adjacent angle", "opposite angle", "angle"];

    if (!types.includes(t1) || !types.includes(t2)) {
        return "failed";
    }
    
    if (a1 <= 0 || a2 <= 0) {
        return "Zero or negative input";
    }
    
    const angleInput = t1 == types[2] || t1 == types[3] || t1 == types[4] ? a1 : t2 == types[2] || t2 == types[3] || t2 == types[4] ? a2 : null;
    if (angleInput !== null && (angleInput <= 0 || angleInput >= 90)) return "Invalid angle";

    let a, b, c, alpha, beta;
    //hypotenuse    leg
    if ((t1 == types[0] && t2 == types[1]) || (t1 == types[1] && t2 == types[0])){
        a = t1 == types[0] ? a1 : a2;
        c = t1 == types[1] ? a1 : a2;
        b = Math.sqrt(Math.pow(c, 2) - Math.pow(a, 2));
        alpha = toDegrees(Math.asin(a / c));
        beta = toDegrees(Math.asin(b / c));
    }
    //leg   leg
    if (t1 == types[0] && t2 == types[0]) {
        a = a1;
        b = a2;
        c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        alpha = toDegrees(Math.atan(a / b));
        beta = toDegrees(Math.atan(b / a));
    }
    //opposite angle    leg
    if((t1 == types[0] && t2 == types[3]) || (t1 == types[3] && t2 == types[0])){
        a = t1 == types[0] ? a1 : a2;
        alpha = t1 == types[3] ? a1 : a2;
        c = a / Math.sin(toRadians(alpha));
        b = a / Math.tan(toRadians(alpha));
        beta = 90 - alpha;
    }
    //adjacent angle    leg
    if((t1 == types[0] && t2 == types[2]) || (t1 == types[2] && t2 == types[0])){
        b = t1 == types[0] ? a1 : a2;
        beta = t1 == types[2] ? a1 : a2;
        c = b / Math.cos(toRadians(beta));
        a = b * Math.tan(toRadians(beta));
        alpha = 90 - beta;
    }
    //hypotenuse    angle
    if ((t1 == types[1] && t2 == types[4]) || (t2 == types[1] && t1 == types[4])) {
        let c = t1 == types[1] ? a1 : a2;
        let alpha = t1 == types[4] ? a1 : a2;
        a = c * Math.sin(toRadians(alpha));
        b = c * Math.cos(toRadians(alpha));
        beta = 90 - alpha;
    }

    if (((t1 == types[0] && t2 == types[1]) || (t1 == types[1] && t2 == types[0])) && a >= c) return "Invalid hypotenuse";

    a = Number(a.toFixed(4));
    b = Number(b.toFixed(4));
    c = Number(c.toFixed(4));
    alpha = Number(alpha.toFixed(4));
    beta = Number(beta.toFixed(4));

    console.log(`a = ${a}`);
    console.log(`b = ${b}`);
    console.log(`c = ${c}`);
    console.log(`alpha = ${alpha}`);
    console.log(`beta = ${beta}`);
    return "success";
}