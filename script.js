async function start() {

    let api = document.getElementById("api").value;
    let secret = document.getElementById("secret").value;

    let res = await fetch("https://hrt-pubg.vercel.app/start", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ api, secret })
    });

    let data = await res.json();

    document.getElementById("status").innerText = data.status;
}
