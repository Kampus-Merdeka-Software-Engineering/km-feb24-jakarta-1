const lineChartConfig = {
    type: 'line',
    data: lineChartData,
    options: {
        layout: {
            padding: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20
            }
        },
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                enabled: true
            }
        }
    }
};

const barChartConfig = {
    type: 'bar',
    data: barChartData,
    options: {
        layout: {
            padding: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20
            }
        },
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                enabled: true
            }
        }
    }
};

const pieChartConfig = {
    type: 'pie',
    data: pieChartData,
    options: {
        layout: {
            padding: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20
            }
        },
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                enabled: true
            }
        }
    }
};

const stacked100ChartConfig = {
    type: 'bar',
    data: stackedBar100Data,
    options: {
        layout: {
            padding: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20
            }
        },
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                enabled: true
            }
        }
    }
};

const lineChart = new Chart(document.getElementById('lineChart'), lineChartConfig);
const barChart = new Chart(document.getElementById('barChart'), barChartConfig);
const stackedBar = new Chart(document.getElementById('stackedBar'), barChartConfig);
const pieChart = new Chart(document.getElementById('pieChart'), pieChartConfig);
const stacked100Chart = new Chart(document.getElementById('100stackedChart'), stacked100ChartConfig);
