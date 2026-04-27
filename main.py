import os
import uvicorn
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from simulator import HospitalSimulation

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

sim_engine = HospitalSimulation()

def process_analytics(results):
    service_counts = {}
    for p in results:
        s_type = p['service_type']
        service_counts[s_type] = service_counts.get(s_type, 0) + 1

    age_bins = [f"{i}-{i+9}" for i in range(0, 90, 10)]
    age_counts = {bin: 0 for bin in age_bins}
    age_waits = {bin: [] for bin in age_bins}

    for p in results:
        age = p['age']
        bin_idx = min(age // 10, 8) 
        bin_name = age_bins[bin_idx]
        age_counts[bin_name] += 1
        age_waits[bin_name].append(p['wait_time'])

    avg_waits_per_age = {}
    for bin_name, waits in age_waits.items():
        avg_waits_per_age[bin_name] = round(sum(waits)/len(waits), 2) if waits else 0

    return {
        "service_dist": service_counts,
        "age_dist": age_counts,
        "age_wait_avg": avg_waits_per_age
    }

@app.get("/run-simulation")
def run_sim(patients: int = 10, doctors: int = 2):
    try:
        sim = HospitalSimulation()
        results = sim.run_simulation(patients, doctors) 

        analytics = process_analytics(results)
        
        avg_wait = sum(p['wait_time'] for p in results) / len(results) if results else 0
        
        return {
            "table_data": results,
            "average_waiting_time": round(avg_wait, 2),
            "total_customers": len(results),
            "analytics": analytics
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/day-analysis")
def day_analysis(doctors: int = 1):
    try:
        sim = HospitalSimulation()
        periods = [
            {"name": "الصباح (9-12)", "patients": 20},
            {"name": "الظهر (12-3)", "patients": 8},
            {"name": "المساء (3-6)", "patients": 15}
        ]
        
        report = []
        for p in periods:
            results = sim.run_simulation(p["patients"], doctors)
            if results:
                avg_wait = sum(res['wait_time'] for res in results) / len(results)
                report.append({
                    "period": p["name"],
                    "avg_wait": round(avg_wait, 2)
                })
            else:
                report.append({"period": p["name"], "avg_wait": 0})
        return report
    except Exception as e:
        print("Error in analysis:", traceback.format_exc())
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8008)