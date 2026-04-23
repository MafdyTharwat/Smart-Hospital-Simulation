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
| **Backend** | Python 3.10.20, FastAPI, SimPy (Simulation Engine) |
| **AI / ML** | Scikit-learn, NumPy |
| **Frontend** | Vue.js 3, Axios, Chart.js |
| **Data Format** | JSON |

## Optimization & AI Insights

The system provides a "Day Analysis" feature that identifies peak hours. Based on the simulation data, the AI generates intelligent recommendations:
* **Resource Balancing:** Suggests increasing the number of doctors during high-pressure periods.
* **Predictive Scheduling:** Estimates waiting times before the simulation even finishes, thanks to the trained ML model.

## Screenshots
<img width="3839" height="2159" alt="Screenshot 2026-04-23 150948" src="https://github.com/user-attachments/assets/eddfc11d-0cd6-45b2-8c22-cda3d422e275" />
<img width="3836" height="2159" alt="Screenshot 2026-04-23 151007" src="https://github.com/user-attachments/assets/9d645815-d2aa-4e3e-a76c-4fa8d8b08955" />
<img width="3839" height="2159" alt="Screenshot 2026-04-23 151018" src="https://github.com/user-attachments/assets/433452dd-471d-4870-acb1-b495d65674e0" />


