document.addEventListener('DOMContentLoaded', function() {
    const monthDropdown = document.getElementById('month-filter-category2');
    const locationDropdown = document.getElementById('location-filter-category2');
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    let pieChart;

    function updatePieChart(data) {
        const categories = [...new Set(data.map(item => item.Kategori))];
        const transactionData = categories.map(category => {
            return data
                .filter(item => item.Kategori === category)
                .reduce((total, item) => total + parseInt(item.Total_Transactions), 0);
        });

        const categoryColors = {
            'Food': '#116A7B',
            'Non Carbonated': '#CDC2AE',
            'Carbonated': '#ECE5C7',
            'Water': '#C2DEDC'
        };

        if (pieChart) {
            pieChart.destroy();
        }

        pieChart = new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: transactionData,
                    backgroundColor: categories.map(category => categoryColors[category] || '#000000')  // Default to black if category is not found
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 10 
                            }
                        }
                    },
                    datalabels: {
                        formatter: (value, ctx) => {
                            let datasets = ctx.chart.data.datasets;
                            if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
                                let sum = datasets[0].data.reduce((a, b) => a + b, 0);
                                let percentage = Math.round((value / sum) * 100) + '%';
                                return `${value} (${percentage})`;
                            } else {
                                return value;
                            }
                        },
                        color: '#000000',
                        anchor: 'end',
                        align: 'start',
                        offset: 10,
                        borderRadius: 4,
                        backgroundColor: (ctx) => {
                            return ctx.dataset.backgroundColor;
                        },
                        font: {
                            size: 9 
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    function fetchDataAndUpdateChart(month, location) {
        fetch('data json/categorytransaction.json')
            .then(response => response.json())
            .then(data => {
                let filteredData = data;
                if (month) {
                    filteredData = filteredData.filter(item => item.TransMonth === month);
                }
                if (location) {
                    filteredData = filteredData.filter(item => item.Lokasi === location);
                }
                updatePieChart(filteredData);
            })
            .catch(error => console.error('Error loading the JSON data:', error));
    }

    monthDropdown.addEventListener('change', function() {
        const selectedMonth = monthDropdown.value;
        const selectedLocation = locationDropdown.value;
        fetchDataAndUpdateChart(selectedMonth, selectedLocation);
    });

    locationDropdown.addEventListener('change', function() {
        const selectedMonth = monthDropdown.value;
        const selectedLocation = locationDropdown.value;
        fetchDataAndUpdateChart(selectedMonth, selectedLocation);
    });

    fetchDataAndUpdateChart();
});
