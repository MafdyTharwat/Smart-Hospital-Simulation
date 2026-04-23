import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from simulator import HospitalSimulation

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

sim_engine = HospitalSimulation()

@app.get("/run-simulation")
def run_sim(patients: int = 10, doctors: int = 2):
    try:
        sim = HospitalSimulation()
        # Ensuring passing no. doctors
        results = sim.run_simulation(patients, doctors) 
        
        avg_wait = sum(p['wait_time'] for p in results) / len(results) if results else 0
        
        return {
            "table_data": results,
            "average_waiting_time": round(avg_wait, 2),
            "total_customers": len(results)
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
        # run sim for each period
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
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8008)