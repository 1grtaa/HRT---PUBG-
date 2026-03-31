async function start() {
    await fetch("/start", { method: "POST" });
    setInterval(load, 3000);
}

async function load() {
    let res = await fetch("/data");
    let data = await res.json();

    let div = document.getElementById("logs");
    div.innerHTML = "";

    data.logs.forEach(l => {
        let p = document.createElement("p");
        p.innerText = JSON.stringify(l);
        div.appendChild(p);
    });
}
