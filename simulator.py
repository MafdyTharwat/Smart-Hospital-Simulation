import simpy
import random
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from patient import Patient 

class HospitalSimulation:
    def __init__(self):
        self.service_names = ["طوارئ", "فحص", "متابعة"]
        self.patients_data = []
        self.model = RandomForestRegressor(n_estimators=50)
        self.train_ai_model()

    def train_ai_model(self):
        X_train = np.array([[0, 20], [0, 70], [1, 25], [1, 60], [2, 30], [2, 45]])
        y_train = np.array([45, 60, 15, 20, 10, 12])
        self.model.fit(X_train, y_train)

    def predict_duration_ai(self, service_idx, age):
        prediction = self.model.predict([[service_idx, age]])
        return int(prediction[0])

    def get_service_index(self, rand_num):
        if rand_num <= 200: return 0
        if rand_num <= 600: return 1
        return 2

    def patient_process(self, env, patient_id, doctors_resource, doctor_pool):
        arrival_time = env.now
        age = random.randint(5, 85)
        rand_val = random.randint(0, 999)
        idx = self.get_service_index(rand_val)
        serv_name = self.service_names[idx]
        serv_dur = self.predict_duration_ai(idx, age)
        
        prio = 1 if idx == 0 else 2
        
        with doctors_resource.request(priority=prio) as request:
            yield request
            doc_id = yield doctor_pool.get()
            
            p = Patient(patient_id, age, arrival_time, serv_name, serv_dur)
            p.doctor_id = doc_id
            p.start_time = env.now
            p.wait_time = p.start_time - arrival_time
            
            yield env.timeout(serv_dur)
            
            p.end_time = env.now
            self.patients_data.append(p.to_dict())
            yield doctor_pool.put(doc_id)

    def run_simulation(self, num_patients, num_doctors=2):
        self.patients_data = []
        env = simpy.Environment()
        doctors_resource = simpy.PriorityResource(env, capacity=num_doctors)
        
        doctor_pool = simpy.Store(env)
        for i in range(1, num_doctors + 1):
            doctor_pool.put(i)
        
        for i in range(1, num_patients + 1):
            env.process(self.patient_process(env, i, doctors_resource, doctor_pool))
            env.run(until=env.now + random.randint(2, 7))
            
        env.run()
        return sorted(self.patients_data, key=lambda x: x['id'])
