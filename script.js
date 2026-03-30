let running = false;
let balance = 1000;
let profit = 0;

function startBot() {
    running = true;
    document.querySelector(".status").innerText = "● نشط";
    document.querySelector(".status").style.color = "green";

    setInterval(runBot, 3000);
}

function runBot() {

    if (!running) return;

    let signal = Math.random() > 0.5 ? "BUY" : "SELL";

    let el = document.createElement("p");

    el.className = signal === "BUY" ? "signal-buy" : "signal-sell";

    el.innerText = signal;

    document.getElementById("signals").prepend(el);

    if (Math.random() > 0.4) {
        profit += 10;
        balance += 10;
    } else {
        profit -= 5;
        balance -= 5;
    }

    document.getElementById("profit").innerText = "$" + profit.toFixed(2);
    document.getElementById("balance").innerText = "$" + balance.toFixed(2);
}
