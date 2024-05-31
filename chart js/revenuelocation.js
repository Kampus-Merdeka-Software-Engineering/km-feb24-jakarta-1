// Function to calculate revenue per location for a specific month
function calculateRevenuePerLocation(data, month = null) {
    const revenuePerLocation = {};

    data.forEach(item => {
        const location = item.Lokasi;
        const revenue = parseFloat(item.Pendapatan);
        const itemMonth = parseInt(item.TransMonth);

        if (!month || itemMonth === month) {
            if (revenuePerLocation[location]) {
                revenuePerLocation[location] += revenue;
            } else {
                revenuePerLocation[location] = revenue;
            }
        }
    });

    return revenuePerLocation;
}

// Function to update the chart
function updateChart(chart, labels, revenue, colors) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = revenue;
    chart.data.datasets[0].backgroundColor = colors;
    chart.data.datasets[0].borderColor = colors.map(color => color.replace(/0\.2\)$/, '1)'));
    chart.update();
}

// Load JSON data and initialize event listeners
fetch('data json/revenue_per_location.json')
    .then(response => response.json())
    .then(data => {
        // Initial revenue calculation for all months
        const initialRevenuePerLocation = calculateRevenuePerLocation(data);
        const initialLabels = Object.keys(initialRevenuePerLocation).sort((a, b) => initialRevenuePerLocation[b] - initialRevenuePerLocation[a]);
        const initialRevenue = initialLabels.map(location => initialRevenuePerLocation[location]);

        // Define the colors for each location
        const locationColors = {
            'GuttenPlans': '#116A7B',
            'EB Public Library': '#CDC2AE',
            'Brunswick Sq Mall': '#ECE5C7',
            'Earle Asphalt': '#C2DEDC'
        };

        const initialColors = initialLabels.map(location => locationColors[location] || '#000000');

        // Create the chart
        const ctx = document.getElementById('barChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: initialLabels,
                datasets: [{
                    label: 'Revenue',
                    data: initialRevenue,
                    backgroundColor: initialColors,
                    borderColor: initialColors.map(color => color.replace(/0\.2\)$/, '1)')),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Location'
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
                    datalabels: {
                        color: '#000000',
                        anchor: 'end',
                        align: 'top',
                        formatter: function(value) {
                            return value.toFixed(2);
                        }
                    },
                    legend: {
                        display: true,
                        labels: {
                            generateLabels: function(chart) {
                                const labels = chart.data.labels;
                                return labels.map(label => ({
                                    text: label,
                                    fillStyle: locationColors[label] || '#000000',
                                    strokeStyle: locationColors[label] || '#000000',
                                    lineWidth: 1,
                                    hidden: false,
                                    index: labels.indexOf(label)
                                }));
                            }
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });

        // Event listener for month filter
        document.getElementById('month-filter').addEventListener('change', function() {
            const selectedMonth = parseInt(this.value);
            const filteredRevenuePerLocation = calculateRevenuePerLocation(data, selectedMonth);
            const filteredLabels = Object.keys(filteredRevenuePerLocation).sort((a, b) => filteredRevenuePerLocation[b] - filteredRevenuePerLocation[a]);
            const filteredRevenue = filteredLabels.map(location => filteredRevenuePerLocation[location]);
            const filteredColors = filteredLabels.map(location => locationColors[location] || '#000000');

            updateChart(chart, filteredLabels, filteredRevenue, filteredColors);
        });
    })
    .catch(error => console.error('Error loading the JSON data:', error));
