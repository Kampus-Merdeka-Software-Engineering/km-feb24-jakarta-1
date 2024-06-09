document.addEventListener('DOMContentLoaded', function() {
    fetch('data json/categoryproduct.json')
        .then(response => response.json())
        .then(data => {
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

            const sortedLocations = Object.keys(locationTotals).sort((a, b) => locationTotals[b] - locationTotals[a]);

            const categories = [...new Set(data.map(item => item.Kategori))];

            const categoryColors = {
                'Food': '#116A7B',
                'Non Carbonated': '#CDC2AE',
                'Carbonated': '#ECE5C7',
                'Water': '#C2DEDC'
            };

            const datasets = categories.map(category => {
                return {
                    label: category,
                    data: sortedLocations.map(location => {
                        const item = data.find(d => d.Lokasi === location && d.Kategori === category);
                        return item ? parseInt(item.total) : 0;
                    }),
                    backgroundColor: categoryColors[category] || '#000000'  
                };
            });

            const ctx = document.getElementById('stackedBar').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedLocations,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',  
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
                            borderRadius: 0, 
                            backgroundColor: null, 
                            padding: 0, 
                            font: {
                                size: 10 
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            beginAtZero: true,
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 5,
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
                            stacked: true,
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 5
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
        })
        .catch(error => console.error('Error loading the JSON data:', error));
});
