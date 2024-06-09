document.addEventListener('DOMContentLoaded', function () {
    const locationFilter = document.getElementById('location-filter-product');
    let originalData;

    fetch('data json/productseason.json')
        .then(response => response.json())
        .then(data => {
            originalData = data;
            updateChart(data);
        });

    locationFilter.addEventListener('change', function() {
        const selectedLocation = locationFilter.value;
        const filteredData = selectedLocation ? originalData.filter(item => item.Location === selectedLocation) : originalData;
        updateChart(filteredData);
    });

    function updateChart(data) {
        const groupedData = data.reduce((acc, item) => {
            const { Season, Category, Total_Transaction } = item;
            if (!acc[Season]) acc[Season] = {};
            if (!acc[Season][Category]) acc[Season][Category] = 0;
            acc[Season][Category] += parseFloat(Total_Transaction);
            return acc;
        }, {});

        const seasonTotals = {};
        Object.keys(groupedData).forEach(season => {
            seasonTotals[season] = Object.values(groupedData[season]).reduce((acc, transactions) => acc + transactions, 0);
        });

        const sortedSeasons = Object.keys(seasonTotals).sort((a, b) => seasonTotals[b] - seasonTotals[a]);

        const categories = Array.from(new Set(data.map(item => item.Category)));

        const categoryColors = {
            'Food': '#116A7B',
            'Non Carbonated': '#CDC2AE',
            'Carbonated': '#ECE5C7',
            'Water': '#C2DEDC'
        };

        const datasets = categories.map(category => {
            return {
                label: category,
                data: sortedSeasons.map(season => groupedData[season][category] || 0),
                backgroundColor: categoryColors[category] || '#000000',
            };
        });

        const ctx = document.getElementById('100stackedChart').getContext('2d');
        if (window.stackedChart) {
            window.stackedChart.data.labels = sortedSeasons;
            window.stackedChart.data.datasets = datasets;
            window.stackedChart.update();
        } else {
            window.stackedChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedSeasons,
                    datasets: datasets,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, 
                    scales: {
                        x: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Season'
                            },
                            ticks: {
                                maxRotation: 90,
                                minRotation: 45
                            }
                        },
                        y: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Total Transactions'
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
                                    const percentage = (context.raw / total * 100).toFixed(2) + '%';
                                    return context.dataset.label + ': ' + context.raw.toFixed(2) + ' (' + percentage + ')';
                                },
                            },
                        },
                        legend: {
                            position: 'top'
                        },
                        datalabels: {
                            formatter: (value, ctx) => {
                                return value.toString();
                            },
                            color: '#000',
                            anchor: 'end',
                            align: 'start',
                            offset: 10,
                            font: {
                                size: 10
                            },
                            backgroundColor: null,
                            borderRadius: 0,
                            padding: 0
                        }
                    },
                },
                plugins: [ChartDataLabels]
            });
        }
    }
});
