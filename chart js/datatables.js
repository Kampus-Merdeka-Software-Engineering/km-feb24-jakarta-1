$(document).ready(function () {

    var dataTable;

    function updateDataTable(month, location) {
        $.ajax({
            url: 'data json/top10.json',
            method: 'GET',
            success: function (response) {
                var filteredData = response.top10;
                if (month) {
                    filteredData = filteredData.filter(function (item) {
                        return item.TransMonth === month;
                    });
                }
                if (location) {
                    filteredData = filteredData.filter(function (item) {
                        return item.Lokasi === location;
                    });
                }

                var productTotals = {};

                filteredData.forEach(function (item) {
                    if (productTotals[item.Produk]) {
                        productTotals[item.Produk] += parseInt(item.total);
                    } else {
                        productTotals[item.Produk] = parseInt(item.total);
                    }
                });

                var processedData = [];
                for (var product in productTotals) {
                    if (productTotals.hasOwnProperty(product)) {
                        processedData.push({
                            Product: product,
                            total: productTotals[product]
                        });
                    }
                }

                if (dataTable) {
                    dataTable.destroy();
                }

                dataTable = $('#top').DataTable({
                    data: processedData,
                    columns: [
                        { data: 'Product', title: 'Product' },
                        { data: 'total', title: 'Total' }
                    ],
                    order: [[1, 'desc']]
                });
            }
        });
    }

    updateDataTable('', '');

    $('#month-filter-product').on('change', function () {
        var selectedMonth = $(this).val();
        var selectedLocation = $('#location-filter-producttop').val();
        updateDataTable(selectedMonth, selectedLocation);
    });

    $('#location-filter-producttop').on('change', function () {
        var selectedLocation = $(this).val();
        var selectedMonth = $('#month-filter-product').val();
        updateDataTable(selectedMonth, selectedLocation);
    });
});
