<template>
    <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>
<script>
import axios from 'axios'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: { Bar },
    data() {
        return {
            chartData: {
                labels: [],
                datasets: [{ data: [] }]
            },
            chartOptions: {
                responsive: true
            }
        }
    },

    methods: {
        async getHistory() {
            const token = localStorage.getItem("token");

            const response = await axios.get('http://localhost:8888/api/V1/historique', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).catch(error => {
                console.log(error)
            })

            const months = new Map();
            response.data.result.forEach(history => {
                const month = new Date(history.timestamp).getMonth();
                if (months.has(month)) {
                    months.set(month, months.get(month) + 1);
                } else {
                    months.set(month, 1);
                }
            });

            const labels = [];
            const data = [];
            months.forEach((value, key) => {
                labels.push(this.getMonthName(key));
                data.push(value);
            });

            this.chartData = {
                labels: labels,
                datasets: [{ data: data }]
            }
        },
        getMonthName(monthIndex) {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return monthNames[monthIndex];
        }
    },
    created() {
        this.getHistory()
    }
}
</script>