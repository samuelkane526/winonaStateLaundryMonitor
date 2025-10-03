# 🧺 Laundry - Active Machines

A simple web app that displays the real-time status of washers and dryers in a laundry room. It fetches machine data from a local server and visually indicates whether each machine is **Running** or **Free**, along with the remaining time.

_Size Note: I have it preset to poll Prentiss-Lucas halls machines, but it can work with any machine on campus as long as you enter in the correct URLs. These can be collected
by using a barcode scanning app on the machine tags._

## 🚀 Features

- Displays 12 washers and 12 dryers in a responsive grid layout.
- Toggle between washer and dryer views using a themed switch.
- Real-time status updates with color-coded indicators.
- Clean, modern UI with light/dark theme toggle.
- Mobile-friendly layout.

## 🛠️ How It Works

- The app fetches machine status from a local server endpoint:
  ```
  http://localhost:8000/?url=<machine_url>
  ```
- Each machine's status is determined by checking if the page contains the phrase `"Start a New machine"`.
- If running, the remaining time is extracted and displayed.
- The UI updates dynamically based on the fetched data.

## 🧪 How to Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/laundry-active-machines.git
   cd laundry-active-machines
   ```

2. **Start your local server** (must proxy requests to the `mycscgo.com` URLs):
   - You can use a simple proxy server or a backend that fetches and returns the HTML content of the machine URLs.
   - Example using Python:
     ```bash
     python3 -m http.server 8000
     ```

3. **Open `index.html` in your browser:**
   ```bash
   open index.html
   ```

4. **Toggle between washers and dryers** using the switch in the top-right corner.

## 📦 Dependencies

- Font Awesome (for sun/moon icons)
- A local server to handle CORS and proxy requests

---
