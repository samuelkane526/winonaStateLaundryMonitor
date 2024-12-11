const washerUrls = [
    "https://mycscgo.com/laundry/press-start/5d800035-7332-4998-8310-cf3eb0415ba3",
    "https://mycscgo.com/laundry/press-start/87797b9f-19d1-48a7-a489-7be95409ea75",
    "https://mycscgo.com/laundry/press-start/22cb56d9-b753-4bd7-aa57-df31b2e44d8b",
    "https://mycscgo.com/laundry/press-start/e724c774-fae9-42ce-9bc6-c211cda529a3",
    "https://mycscgo.com/laundry/press-start/bc0fe60b-a73f-4efb-9a72-e9a7108b5a09",
    "https://mycscgo.com/laundry/press-start/df63ad31-c41c-4fb1-b262-09121f90282c",
    "https://mycscgo.com/laundry/press-start/e3993b38-790a-46ee-a554-f3827b03e69d",
    "https://mycscgo.com/laundry/press-start/553559b8-7d3c-4d57-9a90-c9e4d321159f",
    "https://mycscgo.com/laundry/press-start/2401b3f4-7a73-47b2-8dca-79994e5f3fa7",
    "https://mycscgo.com/laundry/press-start/1320adb2-5082-427e-9e1a-cfb8d30efa60",
    "https://mycscgo.com/laundry/press-start/48e86ec8-95b8-4d8a-9411-dfc25400b080",
    "https://mycscgo.com/laundry/press-start/c921675a-0712-4da5-9ba3-21fc68ac497b"
];

const dryerUrls = [
    "https://mycscgo.com/laundry/press-start/ada4ea38-1147-431c-8961-4a07a4130",
    "https://mycscgo.com/laundry/press-start/ada4ea38-1147-431c-8961-4a07a4130f40",
    "https://mycscgo.com/laundry/press-start/a8f56244-edb7-4b51-876d-1e6569bc82c9",
    "https://mycscgo.com/laundry/press-start/c0277587-0293-4c41-aeee-77a98d78700e",
    "https://mycscgo.com/laundry/press-start/6920e882-9539-4e2e-8e8b-16d8eb79c123",
    "https://mycscgo.com/laundry/press-start/cb117dce-6a86-4936-8289-2081c9eacb67",
    "https://mycscgo.com/laundry/press-start/92d97bd3-0d0d-4e65-a978-e29e79618fc8",
    "https://mycscgo.com/laundry/press-start/2598e412-2a48-4ad1-a488-85556709f60e",
    "https://mycscgo.com/laundry/press-start/b88560e5-61a6-48db-9003-b1fd10d6c086",
    "https://mycscgo.com/laundry/press-start/4fae7d8f-5100-4354-9cc0-92af4c040897",
    "https://mycscgo.com/laundry/press-start/33a5dd4a-e53f-407b-a2d0-e7ba12dd8ff0",
    "https://mycscgo.com/laundry/press-start/ac2e7475-ae51-47ab-9dc2-b19d666a3276"
];

const report = {
    "type": "",
    "timeStamp": "",
    "0": { "name": "", "isRunning": false, time: "" },
    "1": { "name": "", "isRunning": false, time: "" },
    "2": { "name": "", "isRunning": false, time: "" },
    "3": { "name": "", "isRunning": false, time: "" },
    "4": { "name": "", "isRunning": false, time: "" },
    "5": { "name": "", "isRunning": false, time: "" },
    "6": { "name": "", "isRunning": false, time: "" },
    "7": { "name": "", "isRunning": false, time: "" },
    "8": { "name": "", "isRunning": false, time: "" },
    "9": { "name": "", "isRunning": false, time: "" },
    "10": { "name": "", "isRunning": false, time: "" },
    "11": { "name": "", "isRunning": false, time: "" }
};

var storedWashers;
var storedDryers;

const washerOrder = ["25", "26", "27", "28", "29", "30", "43", "44", "45", "46", "47", "48"];
const dryerOrder = ["32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43"];

window.washerOrder = washerOrder;
window.dryerOrder = dryerOrder;

const machineCon = document.querySelector(".machinesCon");

async function main() {
    await createMachine(null, "washer");
    await scanwashers();
    await scandryers();
}

var onWasherPage = true;
document.querySelector(".theme-checkbox").addEventListener("change", function() {
    onWasherPage = !onWasherPage;
    const body = document.querySelector("body");
    let color = this.checked ? "rgba(253, 245, 196, 0.9)" : "rgba(174, 205, 225, 0.9)";
    body.style.background = `linear-gradient(to bottom, ${color}, transparent)`;
    while (machineCon.firstChild) machineCon.removeChild(machineCon.lastChild);
    this.checked ? createMachine(storedDryers, "dryer") : createMachine(storedWashers, "washer");
});

var createMachine = async (storedData, type) => {
    if (storedData && storedData.type !== type) storedData = null;
    window[type + "Order"].forEach((e) => {
        let newMachine = document.createElement("div");
        newMachine.classList.add(e, type);
        newMachine.innerHTML = `
            <div class="machine-box">
                <div class="machine-type">${type.charAt(0).toUpperCase() + type.slice(1)} ${e}</div>
                <hr>
                <div class="machine-time"></div>
                <div class="status">Loading...</div>
            </div>
        `;
        machineCon.appendChild(newMachine);
    });
    !storedData ? await window["scan" + type + "s"]() : updateAllMachines(storedData, type);
    console.log(`Completed ${type}s: ${new Date().getTime()}`);
}

const isRunning = async (url) => {
    try {
        const response = await fetch(`http://localhost:8000/?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        var text = await response.text();
        const includes = text.includes("Start a New machine");
        return [includes, includes ? text.substring(851829, 851829 + 50).match(/\d+/)[0] : "0"];
    } catch (e) {
        console.log("Error: " + e);
        return false;
    }
}

var updateAllMachines = (report, type) => {
    Object.entries(report).forEach(([key, value], i) => {
        if (key !== "timeStamp" && key !== "type") {
            document.querySelector(`[class="${window[type + "Order"][i]} ${type}"]`).children[0].children[2].textContent = value.time + " min";
            var machine = document.querySelector(`[class="${window[type + "Order"][i]} ${type}"]`).children[0].children[3];
            machine.textContent = value.isRunning ? "Running..." : "Free";
            machine.style.color = value.isRunning ? "red" : "green";
        }
    });
};

var scanwashers = async () => {
    let washerReport = { ...report };
    washerReport.type = "washer";
    washerReport.timeStamp = new Date().getTime();

    const promises = washerUrls.map(async (url, i) => {
        let [running, time] = await isRunning(url);
        washerReport[i] = {
            name: washerOrder[i],
            isRunning: running,
            time: time
        };
        if (onWasherPage) {
            document.querySelector(`[class="${washerOrder[i]} washer"]`).children[0].children[2].textContent = time + " min";
            var machineStatus = document.querySelector(`[class="${washerOrder[i]} washer"]`).children[0].children[3];
            machineStatus.textContent = running ? "Running..." : "Free";
            machineStatus.style.color = running ? "red" : "green";
        }
    });
    await Promise.all(promises);
    storedWashers = washerReport;
    return washerReport;
};

var scandryers = async () => {
    console.log("Running...");
    let dryerReport = { ...report };
    dryerReport.type = "dryer";
    dryerReport.timeStamp = new Date().getTime();

    const promises = dryerUrls.map(async (url, i) => {
        let [running, time] = await isRunning(url);
        dryerReport[i] = {
            name: dryerOrder[i],
            isRunning: running,
            time: time
        };
        if (!onWasherPage) {
            try {
                document.querySelector(`[class="${dryerOrder[i]} dryer"]`).children[0].children[2].textContent = time + " min";
                var machineStatus = document.querySelector(`[class="${dryerOrder[i]} dryer"]`).children[0].children[3];
                machineStatus.textContent = running ? "Running..." : "Free";
                machineStatus.style.color = running ? "red" : "green";
            } catch (e) { console.log("Error updating machine status:", e); }
        }
    });
    await Promise.all(promises);
    storedDryers = dryerReport;
    return dryerReport;
};

main();