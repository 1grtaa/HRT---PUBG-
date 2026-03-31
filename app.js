const API = "https://hrt-pubg.vercel.app";

async function addUser() {

    await fetch(API + "/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            api: document.getElementById("api").value,
            secret: document.getElementById("secret").value,
            amount: document.getElementById("amount").value,
            targetProfit: document.getElementById("profit").value
        })
    });

    alert("تم بدء التداول");
}

async function getSignal() {

    let res = await fetch(API + "/signal");
    let data = await res.json();

    let el = document.createElement("p");
    el.innerText = `${data.signal} | ${data.price}`;

    document.getElementById("signals").prepend(el);
}

async function getUsers() {
    let res = await fetch(API + "/users-count");
    let data = await res.json();
    document.getElementById("users").innerText = data.count;
}

setInterval(getSignal, 5000);
setInterval(getUsers, 5000);
