let curr = "";
let prev = null;
let op = null;
let justComputed = false;
let mem = 0;

const display = document.getElementById("text");
const btns = document.querySelectorAll("button");

btns.forEach(b => b.addEventListener("click", () => handle(b.innerText, b.id)));

function handle(v, id) {
    if (id === "mem-box") return;
    if (v >= "0" && v <= "9" || v === ".") {
        if (justComputed) curr = v === "." ? "0." : v, justComputed = false;
        else if (!(v === "." && curr.includes("."))) curr += v;
        update();
    }
    else if (v === "Backspace") { curr = curr.slice(0, -1); update(); }
    else if (v === "C") { curr = ""; prev = op = null; update("0"); }
    else if (v === "CE") { curr = ""; update("0"); }
    else if (v === "+/-") { curr = String(parseFloat(curr) * -1); update(); }
    else if (v === "sqrt") { curr = String(Math.sqrt(parseFloat(curr) || 0)); update(); justComputed = true; }
    else if (v === "1/x") { curr = String(1 / (parseFloat(curr) || 1e-100)); update(); justComputed = true; }
    else if (v === "MC") { mem = 0; document.getElementById("mem-box").innerText = ""; }
    else if (v === "MR") { curr = String(mem); update(); }
    else if (v === "MS") { mem = parseFloat(curr) || 0; document.getElementById("mem-box").innerText = "M"; }
    else if (v === "M+") { mem += parseFloat(curr) || 0; document.getElementById("mem-box").innerText = "M"; }
    else if (v === "%" && prev !== null && op) {
        curr = String(prev * (parseFloat(curr) || 0) / 100); update();
    }
    else if (["+", "-", "*", "/"].includes(v)) {
        if (prev !== null && op && curr !== "") {
            prev = calc(prev, curr, op);
        } else prev = parseFloat(curr) || 0;
        op = v; curr = ""; justComputed = false;
    }
    else if (v === "=") {
        if (op && prev !== null && curr !== "") {
            curr = String(calc(prev, curr, op));
            update();
            prev = null; op = null; justComputed = true;
        }
    }
}

function calc(a, b, o) {
    a = parseFloat(a); b = parseFloat(b);
    if (o === "+") return a + b;
    if (o === "–" || o === "-") return a - b;
    if (o === "*") return a * b;
    if (o === "/") return b ? a / b : "Error";
}

function update(val) {
    display.value = val === undefined ? (curr || "0") : val;
}