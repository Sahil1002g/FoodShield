# 🍏 FoodShield – Smart Food Safety & Health Scanner

FoodShield is a mobile-based application that helps users analyze food products for **health risks, allergens, and nutritional quality** using barcode scanning and intelligent backend processing.

It combines a **React Native frontend** with a **Python backend** to deliver real-time food safety insights.

---

## 🚀 Features

* 📷 Scan food products using barcode
* 🧠 Analyze product health using NutriScore & NOVA classification
* ⚠️ Detect allergens and harmful ingredients
* 📊 Generate health score (0–12)
* 🟢 Risk classification (Safe / Caution / Unsafe)
* 🌐 Integration with Open Food Facts dataset

---

## 🏗️ Tech Stack

### Frontend (Mobile App)

* React Native
* Expo
* TypeScript
* Tailwind (NativeWind)

### Backend

* Python
* FastAPI / Flask (based on your implementation)
* REST APIs

### Dataset

* Open Food Facts (CSV / JSON)

---

## 📂 Project Structure

```
FoodShield/
│
├── frontend/foodshield/     # React Native App
├── Backend/                 # Python Backend
├── .gitignore
├── README.md
```

---

# ⚙️ Setup & Installation Guide

Follow these steps to run the project locally 👇

---

## 🔹 1. Clone Repository

```bash
git clone https://github.com/Sahil1002g/FoodShield.git
cd FoodShield
```

---

## 🔹 2. Setup Backend (Python)

### 📌 Step 1: Navigate to backend

```bash
cd Backend
```

### 📌 Step 2: Create virtual environment

```bash
python -m venv venv
```

Activate it:

**Windows:**

```bash
venv\Scripts\activate
```

**Mac/Linux:**

```bash
source venv/bin/activate
```

---

### 📌 Step 3: Install dependencies

```bash
pip install -r requirements.txt
```

---

### 📌 Step 4: Run backend server

```bash
python app.py
```

👉 OR (if using FastAPI):

```bash
uvicorn app:app --reload
```

---

## 🔹 3. Setup Frontend (React Native)

### 📌 Step 1: Navigate to frontend

```bash
cd ../frontend/foodshield
```

---

### 📌 Step 2: Install dependencies

```bash
npm install
```

---

### 📌 Step 3: Start the app

```bash
npx start
```

👉 Then:

* Scan QR code using Expo Go app
* OR run on emulator

---

## 🔹 4. Environment Variables (Important)

Create `.env` file in frontend/backend if needed:

Example:

```
API_URL=http://localhost:8000
```

---

## 🔄 How It Works

1. User scans product barcode
2. Frontend sends request to backend
3. Backend fetches product data
4. Health score is calculated:

```
Score = NutriScore + NOVA + Nutrient Checks
```

5. App displays:

* Health Score
* Risk Level
* Ingredient warnings

---

## 📊 Health Score Logic

* NutriScore (A–E → 5 to 1 points)
* NOVA Group (1–4 → 4 to 0 points)
* Nutrient Levels:

  * Salt
  * Sugar
  * Saturated Fat

### Output:

* 9–12 → 🟢 Safe
* 6–8 → 🟡 Caution
* 0–5 → 🔴 Unsafe

---

## 🧪 Future Improvements

* AI-based food recommendation system
* Personalized allergy detection
* Product comparison feature
* Cloud deployment (AWS / Render)

---

## 🤝 Contributing

Pull requests are welcome!
Feel free to open issues for suggestions or bugs.

---

## 📧 Contact

**Sahil Gilbile**
📍 India
🔗 GitHub: https://github.com/Sahil1002g

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
