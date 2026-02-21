const timeDisplay = document.getElementById("time");
const buttonStart = document.getElementById("btnStart");
const buttonStop = document.getElementById("btnStop");
const buttonOrder = document.getElementById("btnOrder");
const buttonRestart = document.getElementById("btnRestart");
const notificationArea = document.getElementById("notification");

let timeLeft = 1500;
let timerId;

let API_URL = "http://localhost:3000/api/order"

buttonStart.addEventListener("click", () => {
    clearInterval(timerId);
    timerId = setInterval(() => {
        timeLeft--;

        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        let displayMins = minutes.toString().padStart(2, "0");
        let displaySecs = seconds.toString().padStart(2, "0");

        timeDisplay.innerHTML = `
        ${displayMins}:${displaySecs}`

        if(timeLeft < 0){
            clearInterval(timerId);
            notificationArea.innerHTML = `
        "Order is ready."`
        }
    }, 1000);
});

buttonStop.addEventListener("click", () => {
    clearInterval(timerId);
});

buttonRestart.addEventListener("click", () => {
    timeDisplay.textContent = "25:00";
    clearInterval(timerId);
    timeLeft = 1500;
});

async function takeOrder(url = API_URL) {
    try {
        const order = await fetch(url);
        const orderInfo = await order.json();

        notificationArea.innerHTML = `
        "New order: ${orderInfo.name}"`
    } catch (error) {
        console.log("Error:", error);
    }
}

buttonOrder.addEventListener("click", () => {
    takeOrder();
});

