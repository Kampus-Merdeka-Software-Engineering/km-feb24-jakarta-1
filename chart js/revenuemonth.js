function getMonthName(monthNumber) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1];
}

let chart;

function createOrUpdateChart(labels, revenue) {
    const revenueColor = '#116A7B';
    const ctx = document.getElementById('lineChart').getContext('2d');

    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = revenue;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue',
                    data: revenue,
                    borderColor: revenueColor,
                    backgroundColor: 'rgba(255, 255, 255, 0)', 
                    borderWidth: 2,
                    fill: false 
                }]
            },
            options: {
                responsive: true, 
                maintainAspectRatio: false, 
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Revenue'
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: revenueColor 
                        }
                    },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        color: revenueColor,
                        font: {
                            weight: 'bold'
                        },
                        formatter: function(value) {
                            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }
}

function calculateRevenuePerMonth(data) {
    const revenuePerMonth = {};

    data.forEach(item => {
        const month = parseInt(item.TransMonth);
        const revenue = parseFloat(item.Pendapatan);
        if (revenuePerMonth[month]) {
            revenuePerMonth[month] += revenue;
        } else {
            revenuePerMonth[month] = revenue;
        }
    });

    const sortedMonths = Object.keys(revenuePerMonth).sort((a, b) => a - b);
    const labels = sortedMonths.map(month => getMonthName(month));
    const revenue = sortedMonths.map(month => revenuePerMonth[month]);

    return { labels, revenue };
}


fetch('data json/revenue_per_month.json')
    .then(response => response.json())
    .then(data => {
        
        const { labels, revenue } = calculateRevenuePerMonth(data);
        createOrUpdateChart(labels, revenue);

        document.getElementById('location-filter').addEventListener('change', function() {
            const selectedLocation = this.value;
            if (selectedLocation) {
                const filteredData = data.filter(item => item.Lokasi === selectedLocation);
                const { labels, revenue } = calculateRevenuePerMonth(filteredData);
                createOrUpdateChart(labels, revenue);
            } else {
                const { labels, revenue } = calculateRevenuePerMonth(data);
                createOrUpdateChart(labels, revenue);
            }
        });

        document.getElementById('location-filter').dispatchEvent(new Event('change'));
    })
    .catch(error => console.error('Error loading the JSON data:', error));