class Patient:
    def __init__(self, patient_id, age, arrival_time, service_type, duration):
        self.id = patient_id
        self.age = age
        self.arrival_time = arrival_time
        self.service_type = service_type
        self.duration = duration
        self.doctor_id = 0 # initial val, It will be updated in simulation
        self.start_time = 0
        self.end_time = 0
        self.wait_time = 0

    def to_dict(self):
        return {
            "id": self.id,
            "age": self.age,
            "arrival_time": self.arrival_time,
            "service_type": self.service_type,
            "duration": self.duration,
            "doctor_id": self.doctor_id,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "wait_time": self.wait_time
        }