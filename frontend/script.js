const timeDisplay = document.getElementById("time");
const buttonStart = document.getElementById("btnStart");
const buttonStop = document.getElementById("btnStop");
const buttonOrder = document.getElementById("btnOrder");
const buttonRestart = document.getElementById("btnRestart");
const notificationArea = document.getElementById("notification");
const receiptList = document.getElementById("receiptList");


let currentOrder = "";

let timeLeft = 1;
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

        if(timeLeft <= 0){
            clearInterval(timerId);
            timeDisplay.innerHTML = "00:00";
            notificationArea.innerHTML = `
        "Order is ready."`
        saveCompletedOrder(currentOrder);
        timeLeft = 1500;
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

        currentOrder = orderInfo.name;
    } catch (error) {
        console.log("Error:", error);
    }
}

buttonOrder.addEventListener("click", () => {
    takeOrder();
});

async function saveCompletedOrder(SushiName) {
    try {
        const response = await fetch('http://localhost:3000/api/orders/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: SushiName})
        });
        if(response.ok){
            console.log("Order saved to db.")
            updateReceipt();
        }
    } catch (error) {
        console.log("Error:", error);
    }
}

async function updateReceipt() {
    try {
        const response = await fetch('http://localhost:3000/api/orders/history');
        const pastOrders = await response.json();

        receiptList.innerHTML = "";
        
        pastOrders.forEach((order) => {
            if(order.Num > 1){
                receiptList.innerHTML += `<li>x${order.Num} ${order.SushiName}</li>`
            } else {
                receiptList.innerHTML += `<li> ${order.SushiName}</li>`;
            }
        });


    } catch (error) {
        
    }
}

updateReceipt();