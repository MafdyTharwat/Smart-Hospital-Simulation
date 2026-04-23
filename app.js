const { createApp } = Vue;

createApp({
    data() {
        return {
            patients: 10,
            doctors: 1,
            tableData: [],
            avgWait: null,
            recommendation: null,
            waitChartObj: null,
            dayChartObj: null
        }
    },
    methods: {
        formatTime(minutes) {
            let totalMins = (9 * 60) + minutes;
            let h = Math.floor(totalMins / 60);
            let m = totalMins % 60;
            let period = h >= 12 ? 'PM' : 'AM';
            let displayH = h % 12 || 12;
            let displayM = m < 10 ? '0' + m : m;
            return `${displayH}:${displayM} ${period}`;
        },
        async runSim() {
            try {
                const res = await axios.get(`http://127.0.0.1:8008/run-simulation`, {
                    params: { patients: this.patients, doctors: this.doctors }
                });
                this.tableData = res.data.table_data;
                this.avgWait = res.data.average_waiting_time;
                this.renderWaitChart();
            } catch (err) {
                alert("تأكد من تشغيل السيرفر (main.py)");
            }
        },
        async analyzeDay() {
            try {
                const res = await axios.get(`http://127.0.0.1:8008/day-analysis`, {
                    params: { doctors: this.doctors }
                });
                document.getElementById('analysisSection').style.display = 'block';
                this.renderDayChart(res.data);
            } catch (err) {
                alert("تأكد من وجود 'day-analysis' في الـ Backend");
            }
        },
        renderWaitChart() {
            this.$nextTick(() => {
                const ctx = document.getElementById('waitChart').getContext('2d');
                if (this.waitChartObj) this.waitChartObj.destroy();
                this.waitChartObj = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: this.tableData.map(p => `مريض ${p.id}`),
                        datasets: [{
                            label: 'وقت الانتظار (دقيقة)',
                            data: this.tableData.map(p => p.wait_time),
                            backgroundColor: 'rgba(52, 152, 219, 0.6)',
                            borderColor: '#2980b9',
                            borderWidth: 1
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            });
        },
        renderDayChart(data) {
            this.$nextTick(() => {
                const ctx = document.getElementById('dayChart').getContext('2d');
                if (this.dayChartObj) this.dayChartObj.destroy();
                
                const peak = data.reduce((prev, curr) => (prev.avg_wait > curr.avg_wait) ? prev : curr);
                this.recommendation = peak.avg_wait > 7 
                    ? `فترة ${peak.period} تشهد ضغطاً عالياً. يوصى الموديل بزيادة طبيب إضافي في هذه الفترة.`
                    : `توزيع الموارد الحالي مثالي لكافة فترات اليوم.`;

                this.dayChartObj = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.map(d => d.period),
                        datasets: [{
                            label: 'متوسط الانتظار (دقيقة)',
                            data: data.map(d => d.avg_wait),
                            borderColor: '#e67e22',
                            backgroundColor: 'rgba(230, 126, 34, 0.2)',
                            fill: true, tension: 0.4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            });
        }
    }
}).mount('#app');