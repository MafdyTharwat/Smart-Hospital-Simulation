const { createApp } = Vue;

createApp({
    data() {
        return {
            currentView: 'simulation',
            patients: 10,
            doctors: 1,
            tableData: [],
            avgWait: null,
            recommendation: null,
            waitChartObj: null,
            dayChartObj: null,
            
            serviceChartObj: null,
            ageDistChartObj: null,
            ageWaitChartObj: null,
            analyticsData: null 
        }
    },
    methods: 
    {
        formatTime(minutes) 
        {
            let totalMins = (9 * 60) + minutes;
            let h = Math.floor(totalMins / 60);
            let m = totalMins % 60;
            let period = h >= 12 ? 'PM' : 'AM';
            let displayH = h % 12 || 12;
            let displayM = m < 10 ? '0' + m : m;
            return `${displayH}:${displayM} ${period}`;
        },
        async runSim() 
        {
            try 
            {
                const res = await axios.get(`http://127.0.0.1:8008/run-simulation`, {
                    params: { patients: this.patients, doctors: this.doctors }
                });
                
                this.tableData = res.data.table_data;
                this.avgWait = res.data.average_waiting_time;
                this.renderWaitChart();

                if (res.data.analytics) 
                {
                    this.analyticsData = res.data.analytics;
                    this.renderAnalyticsCharts();
                }
            } 
            catch (err) 
            {
                alert("تأكد من تشغيل السيرفر (main.py) على بورت 8008");
            }
        },
        async analyzeDay() 
        {
            try 
            {
                const res = await axios.get(`http://127.0.0.1:8008/day-analysis`, {
                    params: { doctors: this.doctors }
                });
                document.getElementById('analysisSection').style.display = 'block';
                this.renderDayChart(res.data);
            } 
            catch (err) 
            {
                alert("تأكد من وجود 'day-analysis' في الـ Backend");
            }
        },
        renderWaitChart() 
        {
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
        renderAnalyticsCharts() 
        {
            this.$nextTick(() => {
                const data = this.analyticsData;

                const ctxService = document.getElementById('serviceChart').getContext('2d');
                if (this.serviceChartObj) this.serviceChartObj.destroy();
                this.serviceChartObj = new Chart(ctxService, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(data.service_dist),
                        datasets: [{
                            data: Object.values(data.service_dist),
                            backgroundColor: ['#3498db', '#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6']
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });

                const ctxAge = document.getElementById('ageDistChart').getContext('2d');
                if (this.ageDistChartObj) this.ageDistChartObj.destroy();
                this.ageDistChartObj = new Chart(ctxAge, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(data.age_dist),
                        datasets: [{
                            label: 'عدد المرضى',
                            data: Object.values(data.age_dist),
                            backgroundColor: 'rgba(44, 62, 80, 0.7)',
                            borderColor: '#2c3e50',
                            borderWidth: 1
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });

                const ctxAgeWait = document.getElementById('ageWaitChart').getContext('2d');
                if (this.ageWaitChartObj) this.ageWaitChartObj.destroy();
                this.ageWaitChartObj = new Chart(ctxAgeWait, {
                    type: 'line',
                    data: {
                        labels: Object.keys(data.age_wait_avg),
                        datasets: [{
                            label: 'متوسط الانتظار (دقيقة)',
                            data: Object.values(data.age_wait_avg),
                            borderColor: '#e67e22',
                            backgroundColor: 'rgba(230, 126, 34, 0.1)',
                            fill: true,
                            tension: 0.3
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            });
        },
        renderDayChart(data) 
        {
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
        },

        async exportToExcel() 
        {
            if (this.tableData.length === 0) return alert("لا توجد بيانات!");

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Simulation Results');

            sheet.columns = [
                { header: 'المريض', key: 'id', width: 10 },
                { header: 'وقت الوصول', key: 'arrival', width: 15 },
                { header: 'الخدمة', key: 'service', width: 15 },
                { header: 'العمر', key: 'age', width: 10 },
                { header: 'مدة الكشف (د)', key: 'duration', width: 15 },
                { header: 'بداية الكشف (Formula)', key: 'start', width: 20 },
                { header: 'نهاية الكشف (Formula)', key: 'end', width: 20 },
                { header: 'وقت الانتظار (Formula)', key: 'wait', width: 20 }
            ];

            this.tableData.forEach((row, index) => {
                const rowIndex = index + 2;
        
                const arrivalExcelTime = ((9 * 60) + row.arrival_time) / 1440;

                sheet.addRow({
                    id: row.id,
                    arrival: arrivalExcelTime,
                    service: row.service_type,
                    age: row.age,
                    duration: row.duration,
                });

            if (index === 0) 
            {
                sheet.getCell(`F${rowIndex}`).value = { 
                    formula: `B${rowIndex}`, 
                    result: ((9 * 60) + row.start_time) / 1440 
                };
            } 
            else 
            {
                sheet.getCell(`F${rowIndex}`).value = { 
                    formula: `MAX(B${rowIndex}, G${rowIndex - 1})`, 
                    result: ((9 * 60) + row.start_time) / 1440 
                };
            }

            sheet.getCell(`G${rowIndex}`).value = {
                formula: `F${rowIndex}+(E${rowIndex}/1440)`,
                result: ((9 * 60) + row.end_time) / 1440
            };

            sheet.getCell(`H${rowIndex}`).value = {
                formula: `(F${rowIndex}-B${rowIndex})*1440`,
                result: row.wait_time
            };

            sheet.getCell(`B${rowIndex}`).numFmt = 'hh:mm AM/PM';
            sheet.getCell(`F${rowIndex}`).numFmt = 'hh:mm AM/PM';
            sheet.getCell(`G${rowIndex}`).numFmt = 'hh:mm AM/PM';
            sheet.getCell(`H${rowIndex}`).numFmt = '0 "min"';
            });

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), 'Hospital_Simulation_Report.xlsx');
        }
    }
}).mount('#app');