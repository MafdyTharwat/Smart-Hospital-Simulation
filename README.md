# Smart Hospital AI Simulation System

An advanced, full-stack simulation platform designed to optimize hospital resource management. This project bridges the gap between **Discrete Event Simulation (DES)**, **Machine Learning**, and **Interactive Data Engineering** to provide actionable insights for hospital administrators.

---

## Project Objective
The goal of this system is to help hospital management understand and optimize patient flow. By simulating various scenarios (e.g., changing doctor availability or patient volume), the system identifies potential bottlenecks and tests resource allocation strategies before real-world implementation.

## Key Features

* **AI-Driven Duration Prediction**: Implements a `RandomForestRegressor` model to predict consultation durations based on patient age and service type, moving beyond simple random distributions.
* **Priority-Based Triage**: A custom queuing system that prioritizes "Emergency" (طوارئ) cases over routine check-ups using specialized simulation logic.
* **📊 Advanced Analytics Suite**: Interactive visualizations powered by **Chart.js**, including:
    * **Service Distribution**: Departmental load balancing.
    * **Demographic Insights**: Correlation between age groups and waiting times.
    * **Hourly Pressure Analysis**: Identifying peak bottleneck periods.
* **Interactive Excel Export**: A professional-grade export feature using **ExcelJS** that generates `.xlsx` files with **dynamic formulas**. If a user modifies a value (like a duration) in the sheet, all subsequent times and wait periods update automatically.
* **Integrated User Guide**: An Arabic-language summary within the UI to explain AI integration and system steps to non-technical stakeholders.

##Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Python 3.10, FastAPI, SimPy (Simulation Engine) |
| **AI / ML** | Scikit-learn (Random Forest), NumPy, Pandas |
| **Frontend** | Vue.js 3, Axios, Chart.js |
| **Data Export** | **ExcelJS**, **FileSaver.js** (Formula-based Dynamic Sheets) |
| **Data Format** | JSON |

##AI Insights & Optimization

The system doesn't just simulate; it analyzes. The "Day Analysis" module processes simulation logs to provide:
1.  **Bottleneck Identification**: Pinpoints the exact hour where patient inflow exceeds doctor capacity.
2.  **Smart Recommendations**: Generates AI-driven advice (e.g., "Add an extra doctor during the 1:00 PM peak") to maintain waiting times below critical thresholds.
3.  **Predictive Scheduling**: Estimates waiting times before the simulation even finishes, thanks to the trained ML model.

##Dynamic Spreadsheet Logic
The export module embeds live logic into the generated report:
* **Smart Start Time**: Calculated as `=MAX(Arrival_Time, Previous_Patient_End_Time)`.
* **Live End Time**: Linked as `=Start_Time + (Duration / 1440)`.
* **Automatic Wait Time**: Updates instantly if arrival or service times are adjusted manually.

##Screenshots
<img width="3839" height="2159" alt="Simulation View" src="https://github.com/user-attachments/assets/eddfc11d-0cd6-45b2-8c22-cda3d422e275" />
<img width="3836" height="2159" alt="Analytics Dashboard" src="https://github.com/user-attachments/assets/9d645815-d2aa-4e3e-a76c-4fa8d8b08955" />
<img width="3839" height="2159" alt="System Summary" src="https://github.com/user-attachments/assets/433452dd-471d-4870-acb1-b495d65674e0" />
