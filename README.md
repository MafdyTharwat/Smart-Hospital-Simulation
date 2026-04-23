# Smart Hospital AI Simulation System

An advanced, full-stack simulation platform designed to optimize hospital resource management. This project leverages **Discrete Event Simulation (DES)** and **Machine Learning** to predict patient service times and visualize bottleneck periods in real-time.

## Key Features

* **AI-Driven Duration Prediction**: Implements a `RandomForestRegressor` model to predict consultation durations based on patient age and service type.
* **Priority-Based Triage**: A custom queuing system that prioritizes "Emergency" (طوارئ) cases over routine check-ups.
* **Dynamic Resource Allocation**: Uses `simpy.Store` to manage a pool of doctors, ensuring each patient is assigned a specific, traceable doctor ID.
* **Interactive Analytics**: Real-time data visualization using **Chart.js** to track individual waiting times and hourly resource pressure.
* **Modern Full-Stack Architecture**: A decoupled system with a **FastAPI** backend and a responsive **Vue.js** frontend.

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Python 3.x, FastAPI, SimPy (Simulation Engine) |
| **AI / ML** | Scikit-learn, NumPy |
| **Frontend** | Vue.js 3, Axios, Chart.js |
| **Data Format** | JSON |
