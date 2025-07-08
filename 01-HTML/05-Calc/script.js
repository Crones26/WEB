// Основные переменные
let curr = "";              // Текущее введённое значение
let prev = null;            // Предыдущее значение (левый операнд)
let op = null;              // Оператор (+, -, *, /)
let justComputed = false;   // Флаг, что только что было вычисление
let mem = 0;                // Память

// Получаем дисплей (экран)
const display = document.getElementById("text");

// Получаем все кнопки
const buttons = document.querySelectorAll("button");

// Назначаем обработчик на каждую кнопку
buttons.forEach(function (button)
{
    button.addEventListener("click", function ()
    {
        let value = button.innerText;
        let id = button.id;
        handleClick(value, id);
    });
});

// Основная функция обработки клика
function handleClick(value, id)
{
    // Игнорируем ячейку памяти
    if (id === "mem-box") return;

    // Цифры и точка
    if ((value >= "0" && value <= "9") || value === ".")
    {
        if (justComputed)
        {
            // Если только что было вычисление — начинаем заново
            if (value === ".")
            {
                curr = "0.";
            } else {
                curr = value;
            }
            justComputed = false;
        } else {
            // Не даём ввести две точки
            if (!(value === "." && curr.includes(".")))
            {
                curr += value;
            }
        }
        updateDisplay();
    }

    // Удаление символа
    else if (value === "Backspace")
    {
        curr = curr.slice(0, -1);
        updateDisplay();
    }

    // Очистить всё
    else if (value === "C")
    {
        curr = "";
        prev = null;
        op = null;
        updateDisplay("0");
    }

    // Очистить только текущее значение
    else if (value === "CE")
    {
        curr = "";
        updateDisplay("0");
    }

    // Смена знака
    else if (value === "+/-")
    {
        let num = parseFloat(curr);
        curr = String(num * -1);
        updateDisplay();
    }

    // Квадратный корень
    else if (value === "sqrt")
    {
        let num = parseFloat(curr);
        curr = String(Math.sqrt(num || 0));
        updateDisplay();
        justComputed = true;
    }

    // Обратное значение
    else if (value === "1/x")
    {
        let num = parseFloat(curr);
        curr = String(1 / (num || 1e-100));
        updateDisplay();
        justComputed = true;
    }

    // Очистить память
    else if (value === "MC")
    {
        mem = 0;
        document.getElementById("mem-box").innerText = "";
    }

    // Прочитать из памяти
    else if (value === "MR")
    {
        curr = String(mem);
        updateDisplay();
    }

    // Сохранить в память
    else if (value === "MS")
    {
        mem = parseFloat(curr) || 0;
        document.getElementById("mem-box").innerText = "M";
    }

    // Прибавить к памяти
    else if (value === "M+")
    {
        mem += parseFloat(curr) || 0;
        document.getElementById("mem-box").innerText = "M";
    }

    // Процент от предыдущего
    else if (value === "%" && prev !== null && op)
    {
        let percentValue = parseFloat(curr) || 0;
        curr = String(prev * percentValue / 100);
        updateDisplay();
    }

    // Операторы + - * /
    else if (value === "+" || value === "-" || value === "*" || value === "/")
    {
        if (prev !== null && op !== null && curr !== "")
        {
            prev = calculate(prev, curr, op);
        } else
        {
            prev = parseFloat(curr) || 0;
        }
        op = value;
        curr = "";
        justComputed = false;
    }

    // Равно
    else if (value === "=")
    {
        if (op !== null && prev !== null && curr !== "")
        {
            curr = String(calculate(prev, curr, op));
            updateDisplay();
            prev = null;
            op = null;
            justComputed = true;
        }
    }
}

// Функция вычислений
function calculate(a, b, operator)
{
    a = parseFloat(a);
    b = parseFloat(b);

    if (operator === "+") return a + b;
    if (operator === "-" || operator === "–") return a - b;
    if (operator === "*") return a * b;
    if (operator === "/")
    {
        if (b === 0) return "Error";
        else return a / b;
    }
}

// Обновление дисплея
function updateDisplay(val)
{
    if (val === undefined)
    {
        if (curr === "") display.value = "0";
        else display.value = curr;
    } else {
        display.value = val;
    }
}