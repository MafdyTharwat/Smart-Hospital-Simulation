# Smart Hospital AI Simulation System

An advanced, full-stack simulation platform designed to optimize hospital resource management. This project bridges the gap between **Discrete Event Simulation**, **Machine Learning**, and **Interactive Data Engineering** to provide actionable insights for hospital administrators.

## Project Objective
The goal of this system is to help hospital management understand and optimize patient flow. By simulating various scenarios, the system identifies potential bottlenecks and tests resource allocation strategies before real-world implementation.

## Key Features

* **AI-Driven Duration Prediction**: Implements a `RandomForestRegressor` model to predict consultation durations based on patient age and service type, moving beyond simple random distributions.
* **Priority-Based Triage**: A custom queuing system that prioritizes "Emergency" (طوارئ) cases over routine check-ups using specialized simulation logic.
* **Advanced Analytics Suite**: Interactive visualizations powered by **Chart.js**, including:
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
<img width="3839" height="2159" alt="Screenshot 2026-04-27 170325" src="https://github.com/user-attachments/assets/b0bafd4f-f1da-4717-98cf-de45d281e929" />
<img width="3839" height="2159" alt="Screenshot 2026-04-27 170443" src="https://github.com/user-attachments/assets/b1f4fc35-ea57-412a-b112-ba0cb56d94c8" />
<img width="3839" height="2159" alt="Screenshot 2026-04-27 170458" src="https://github.com/user-attachments/assets/7c696257-53d3-4f68-a655-2bb1e2545af2" />
<img width="3837" height="2157" alt="Screenshot 2026-04-27 170514" src="https://github.com/user-attachments/assets/494e63e8-ca89-4323-8408-7b5b71440e0a" />
<img width="3838" height="2159" alt="Screenshot 2026-04-27 170524" src="https://github.com/user-attachments/assets/8ca799a8-4ee3-4304-919d-8036f9dad2d9" />
<img width="3839" height="2159" alt="Screenshot 2026-04-27 170537" src="https://github.com/user-attachments/assets/a980ac56-dc4b-4e07-b5ea-0de25bdbaa1e" />
