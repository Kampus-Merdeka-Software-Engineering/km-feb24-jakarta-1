$(document).ready(function () {
    $.ajax({
        url: 'data json/top10.json',
        method: 'GET',
        success: function (response) {
            var data = response.top10;
            var productTotals = {};

            // Calculate total count for each product
            data.forEach(function (item) {
                if (productTotals[item.Produk]) {
                    productTotals[item.Produk] += parseInt(item.total);
                } else {
                    productTotals[item.Produk] = parseInt(item.total);
                }
            });

            // Convert data to an array of objects
            var processedData = [];
            for (var product in productTotals) {
                if (productTotals.hasOwnProperty(product)) {
                    processedData.push({
                        Product: product, // Change column name to "Product"
                        total: productTotals[product]
                    });
                }
            }

            // Initialize DataTable with processed data
            $('#top').DataTable({
                data: processedData,
                columns: [
                    { data: 'Product', title: 'Product' }, // Change column name to "Product"
                    { data: 'total', title: 'Total' }
                ],
                // Sort by total count in descending order initially
                order: [[1, 'desc']]
            });
        }
    });
});
