document.addEventListener('DOMContentLoaded', function() {
    fetch('data json/categoryproduct.json')
        .then(response => response.json())
        .then(data => {
            // Calculate total for each location
            const locationTotals = {};
            data.forEach(item => {
                const location = item.Lokasi;
                const total = parseInt(item.total);
                if (locationTotals[location]) {
                    locationTotals[location] += total;
                } else {
                    locationTotals[location] = total;
                }
            });

            // Sort locations by total in descending order
            const sortedLocations = Object.keys(locationTotals).sort((a, b) => locationTotals[b] - locationTotals[a]);

            // Get unique categories
            const categories = [...new Set(data.map(item => item.Kategori))];

            // Define the colors for each category
            const categoryColors = {
                'Food': '#116A7B',
                'Non Carbonated': '#CDC2AE',
                'Carbonated': '#ECE5C7',
                'Water': '#C2DEDC'
            };

            // Prepare datasets
            const datasets = categories.map(category => {
                return {
                    label: category,
                    data: sortedLocations.map(location => {
                        const item = data.find(d => d.Lokasi === location && d.Kategori === category);
                        return item ? parseInt(item.total) : 0;
                    }),
                    backgroundColor: categoryColors[category] || '#000000'  // Default to black if category is not found
                };
            });

            // Create the chart
            const ctx = document.getElementById('stackedBar').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedLocations,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    indexAxis: 'y',  // This is the key option for horizontal bars
                    plugins: {
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        },
                        legend: {
                            position: 'top'
                        },
                        datalabels: {
                            formatter: (value, ctx) => {
                                return value;
                            },
                            color: '#000',
                            anchor: 'end',
                            align: 'start',
                            offset: 10,
                            borderRadius: 0, // Remove border radius
                            backgroundColor: null, // No background color
                            padding: 0, // Remove padding
                            font: {
                                size: 10 // Smaller font size
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value;
                                }
                            },
                            title: {
                                display: true,
                                text: 'Total'
                            }
                        },
                        y: {
                            stacked: true
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
        });
});
