/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.26672777268561, "KoPercent": 0.7332722273143905};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.06438467807660962, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05514705882352941, 500, 1500, "https://edge.ali2bd.com/api/public/v1/products/search?keyword=%5B%27Home%20Accessories%27%2C%20%27Kitchen%20Accessories%27%5D&shop_id=4"], "isController": false}, {"data": [0.07352941176470588, 500, 1500, "https://edge.ali2bd.com/api/public/v1/products/search?keyword=Bags&shop_id=4"], "isController": false}, {"data": [0.19117647058823528, 500, 1500, "https://ali2bd.com/products?keyword=Women+Dress&shop_id=4"], "isController": false}, {"data": [0.0, 500, 1500, "https://ali2bd.com/"], "isController": false}, {"data": [0.09926470588235294, 500, 1500, "https://edge.ali2bd.com/api/public/v1/products/search?keyword=%5B%27bags%27%2C%20%27shoes%27%2C%20%27watches%27%2C%20%27dress%27%5D&shop_id=4"], "isController": false}, {"data": [0.051470588235294115, 500, 1500, "https://edge.ali2bd.com/api/public/v1/products/search?keyword=Shoes&shop_id=4"], "isController": false}, {"data": [0.0661764705882353, 500, 1500, "https://edge.ali2bd.com/api/public/v1/products/search?keyword=Men%27s%20Fashion%2C%20Jewelry%2C%20Dress%2C%20Fashion%2C%20Women%27s%20Fashion&shop_id=4"], "isController": false}, {"data": [0.04411764705882353, 500, 1500, "https://edge.ali2bd.com/api/public/v1/products/search?keyword=Toys%2C%20Kids%2C%20Babies&shop_id=4"], "isController": false}, {"data": [0.0, 500, 1500, "Ali2BD-Test"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1091, 8, 0.7332722273143905, 20763.328139321722, 4, 276761, 4643.0, 90813.40000000001, 126142.59999999987, 166131.8399999996, 0.034654742047221104, 4.176682115340781, 0.011382471473842673], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://edge.ali2bd.com/api/public/v1/products/search?keyword=%5B%27Home%20Accessories%27%2C%20%27Kitchen%20Accessories%27%5D&shop_id=4", 136, 1, 0.7352941176470589, 7977.801470588236, 4, 151665, 4685.0, 12809.899999999998, 18144.650000000034, 143174.2399999999, 0.004337385578333279, 0.20518193958131917, 0.0014169444859136067], "isController": false}, {"data": ["https://edge.ali2bd.com/api/public/v1/products/search?keyword=Bags&shop_id=4", 136, 0, 0.0, 5068.617647058826, 367, 33348, 3811.5, 9286.9, 16937.500000000004, 29784.529999999955, 0.00433862094253605, 0.19300373830614048, 0.0012032894020314827], "isController": false}, {"data": ["https://ali2bd.com/products?keyword=Women+Dress&shop_id=4", 136, 0, 0.0, 4512.14705882353, 709, 22776, 1803.5, 12831.5, 14938.850000000006, 22120.729999999992, 0.004338216687352411, 0.6791694038368401, 0.0018047659265743427], "isController": false}, {"data": ["https://ali2bd.com/", 139, 7, 5.0359712230215825, 121145.00719424464, 52393, 276761, 113898.0, 162764.0, 189764.0, 275058.6, 0.004422099937549769, 2.3376824126166014, 0.0015911805193454147], "isController": false}, {"data": ["https://edge.ali2bd.com/api/public/v1/products/search?keyword=%5B%27bags%27%2C%20%27shoes%27%2C%20%27watches%27%2C%20%27dress%27%5D&shop_id=4", 136, 0, 0.0, 4381.9044117647045, 379, 54279, 3583.5, 7545.599999999999, 11390.750000000005, 41401.519999999844, 0.004340029988968984, 0.20493188178331131, 0.0014537405138831656], "isController": false}, {"data": ["https://edge.ali2bd.com/api/public/v1/products/search?keyword=Shoes&shop_id=4", 136, 0, 0.0, 4802.477941176471, 370, 20689, 3807.5, 9430.8, 12379.400000000005, 19903.11999999999, 0.00433840378959571, 0.19411347639405913, 0.0012074658984714622], "isController": false}, {"data": ["https://edge.ali2bd.com/api/public/v1/products/search?keyword=Men%27s%20Fashion%2C%20Jewelry%2C%20Dress%2C%20Fashion%2C%20Women%27s%20Fashion&shop_id=4", 136, 0, 0.0, 6218.838235294118, 370, 81028, 3897.0, 8037.099999999999, 22390.50000000001, 76073.69999999994, 0.004339527849797454, 0.1987178689472162, 0.0014705235975387859], "isController": false}, {"data": ["https://edge.ali2bd.com/api/public/v1/products/search?keyword=Toys%2C%20Kids%2C%20Babies&shop_id=4", 136, 0, 0.0, 9785.529411764703, 419, 88572, 6709.5, 18601.399999999994, 23908.150000000012, 75891.35999999984, 0.004333795424270446, 0.1752698226806889, 0.0012781310723922604], "isController": false}, {"data": ["Ali2BD-Test", 136, 8, 5.882352941176471, 164691.5808823528, 103590, 286509, 161150.0, 199583.19999999998, 220259.50000000006, 284334.87999999995, 0.004325287439998165, 4.128755545859305, 0.011360432807581923], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 7, 87.5, 0.6416131989000916], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: edge.ali2bd.com:443 failed to respond", 1, 12.5, 0.09165902841429881], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1091, 8, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: edge.ali2bd.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://edge.ali2bd.com/api/public/v1/products/search?keyword=%5B%27Home%20Accessories%27%2C%20%27Kitchen%20Accessories%27%5D&shop_id=4", 136, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: edge.ali2bd.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://ali2bd.com/", 139, 7, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
