# NumberFit Assessment

This is a simple cross-platform mobile application built with **React Native + Expo** for an assessment. The app scans a QR code, fetches quiz data from a **mock Postman API**, displays the question, and submits the answer to receive coordinates.

---

## Features

- QR Code scanner using `expo-camera`
- Mock API integration (GET and POST)
- Multiple-choice question UI
- Submits answer and receives coordinates
- Opens location in Google Maps

---

## How It Works

1. **Start the App**  
   Launches with the camera ready on the home screen. If camera permission is not granted, a button prompts the user.

2. **Scan QR Code**  
   The QR code contains a relative endpoint path (e.g., `/endpoint243252`). The app adds a hardcoded base URL and sends a **GET** request to fetch the quiz data.

3. **Display Quiz**  
   Shows question image, text, and multiple-choice options.

4. **Submit Answer**  
   On submit, sends a **POST** request to the same endpoint. The mock API returns a response with coordinates.

5. **View Coordinates**  
   Coordinates are shown via alert with an option to open in Google Maps.
