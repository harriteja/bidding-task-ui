var UICOntroller = (function () {
    var DOMstrings = {
        inputRole: '.role',
        inputButton: '.add_btn',
        inputRequest: '.select_request',
        inputName: '.add_name',
        inputSave: '.save'
    };

    return {
        getInput: function () {
            return {
                role: document.querySelector(DOMstrings.inputRole).value,
                request: document.querySelector(DOMstrings.inputRequest).value,
                name: document.querySelector(DOMstrings.inputName).value
            };
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();


var controller = (function (uiCtrl) {

    var bidInput = {
        "bidRequestItemList": [
            {
                "description": "string",
                "item": "string",
                "quantity": 0
            }
        ],
        "endDate": "2019-06-05T04:03:38.877Z",
        "startDate": "2019-06-05T04:03:38.878Z",
        "title": "string"
    };

    var bid = function (title, startDate, endDate, bidRequestItemList) {
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.bidRequestItemList = function (bidRequestItemList) {
            // var dfd = JSON.parse(bidRequestItemList);
            // for(var i = 0; i < dfd.length; i++){
            //     var data = JSON.parse(JSON.stringify(dfd[i]));
            //     console.log("s"+data);
            // };
        }();
    };
    var setUpEventListeners = function () {
        var dom = uiCtrl.getDOMstrings();
        console.log(dom);
        document.querySelector(dom.inputButton).addEventListener('click', getBids);
        document.querySelector(dom.inputSave).addEventListener('click', saveBid);
    };

    var saveBid = function (bid) {
        console.log("dff" + JSON.stringify(bid));
        var xhr = new XMLHttpRequest();
        console.log(xhr);
        var url = "http://localhost:8076/manager/save";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("accept", "*/*");
        xhr.setRequestHeader("Access-Control-Allow-Credentials", false);
        xhr.setRequestHeader("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE, OPTIONS');
        xhr.setRequestHeader("Access-Control-Allow-Headers", '*');
        xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
        var data = JSON.stringify(bid);
        console.log("xhr" + JSON.stringify(xhr));
        xhr.send(data);
        console.log(bid);
    };

    var getBids = function () {
        var input = UICOntroller.getInput();
        if (input.role == 'bid_creator') {
            var h = controller.getAll();
            var p = [];
            var k = '<table border="1" id="example"><thead><tr><th>Bid Id</th><th>Title</th><th>Start Date</th><th>End Date</th><th>Expired</th></thead>';
            var biditem = '<table border="1" id="example"><tr><th>Bid Item Id</th><th>Bid Id</th><th>Item</th><th>Quantity</th>' +
                '<th>Description</th></thead>';
            var response = '<table border="1" id="example"><tr><th>Bid Item Id</th><th>Rank</th><th>Name</th><th>Quantity</th>' +
                '<th>Amount</th><th>isAccepted</th></thead>';
            h.then(function (result) {
                p = result;
                k = k + '<tbody>'
                for (var i = 0; i < p.length; i++) {
                    k += '<tr>';
                    k += '<td>' + p[i].id + '</td>';
                    k += '<td>' + p[i].title + '</td>';
                    k += '<td>' + new Date(p[i].startDate) + '</td>';
                    k += '<td>' + new Date(p[i].endDate) + '</td>';
                    k += '<td>' + p[i].expired + '</td>';
                    k += '</tr>';
                }
                k += '</tbody>'
                biditem += '<tbody>';
                for (var i = 0; i < p.length; i++) {
                    if (p[i].bidRequestItemList != null) {
                        var f = [];
                        f = p[i].bidRequestItemList;
                        for (var j = 0; j < f.length; j++) {
                            biditem += '<tr>';
                            biditem += '<td>' + f[j].id + '</td>';
                            biditem += '<td>' + p[i].id + '</td>';
                            biditem += '<td>' + f[j].item + '</td>';
                            biditem += '<td>' + f[j].quantity + '</td>';
                            biditem += '<td>' + f[j].description + '</td>';
                            biditem += '</tr>';
                        }
                    }
                }
                biditem += '</tbody>';
                response += '<tbody>';
                for (var i = 0; i < p.length; i++) {
                    if (p[i].bidRequestItemList != null) {
                        var f = [];
                        f = p[i].bidRequestItemList;
                        for (var j = 0; j < f.length; j++) {
                            if (f[j] != null) {
                                console.log('f[i].supplierResponseList' + JSON.stringify(f[i]) + f.length)
                                var a = [];
                                a = f[j].supplierResponseList;
                                if (a != null) {
                                    if (a.length != null) {
                                        for (var z = 0; z < a.length; z++) {
                                            response += '<tr>';
                                            response += '<td>' + p[i].id + '</td>';
                                            response += '<td>' + a[z].rank + '</td>';
                                            response += '<td>' + a[z].name + '</td>';
                                            response += '<td>' + a[z].quantity + '</td>';
                                            response += '<td>' + a[z].amount + '</td>';
                                            response += '<td>' + a[z].isAccepted + '</td>';
                                            response += '</tr>';
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                response += '</tbody>';
                console.log(response);
                if (input.request == 'get_all') {
                    $('#createBid').hide();
                    $('#tableReponse').show();
                    $('#tableDivItem').show();
                    $('#tableDiv').show();
                    $('#tableDiv').html(k + '</table>');
                    $('#tableDivItem').html(biditem + '</table>');
                    $('#tableReponse').html(response + '</table>');
                } else {
                    $('#createBid').attr("style", "margin-top: 10px; margin-left: 250px; margin-right: 250px;");;
                    $(document).ready(function () {
                        $(".add-row").click(function () {
                            var item = $("#item").val();
                            var quantity = $("#quantity").val();
                            var description = $("#description").val();
                            var markup = "<tr><td>" + item + "</td><td>" + quantity + "</td><td>" + description + "</td></tr>";
                            $("table tbody").append(markup);
                        });
                    });
                    $('#tableDiv').hide();
                    $('#tableDivItem').hide();
                    $('#tableReponse').hide();
                }
            });
        } else {
            $('#tableDiv').hide();
            $('#createBid').hide();
            $('#tableDivItem').hide();
            $('#tableReponse').hide();
            if (input.name != null) {
                var h = controller.getAllBidsByName(input.name);
                var p = [];
                var k = '<table border="1" id="example"><thead><tr><th>Bid Id</th><th>Title</th><th>Start Date</th><th>End Date</th><th>Expired</th></thead>';
                var biditem = '<table border="1" id="example"><tr><th>Bid Item Id</th><th>Bid Id</th><th>Item</th><th>Quantity</th>' +
                    '<th>Description</th></thead>';
                var response = '<table border="1" id="example"><tr><th>Bid Item Id</th><th>Rank</th><th>Name</th><th>Quantity</th>' +
                    '<th>Amount</th><th>isAccepted</th></thead>';
                h.then(function (result) {
                    console.log('getByName'+JSON.stringify(result))
                    p = result;
                    k = k + '<tbody>'
                    for (var i = 0; i < p.length; i++) {
                        k += '<tr>';
                        k += '<td>' + p[i].id + '</td>';
                        k += '<td>' + p[i].title + '</td>';
                        k += '<td>' + new Date(p[i].startDate) + '</td>';
                        k += '<td>' + new Date(p[i].endDate) + '</td>';
                        k += '<td>' + p[i].expired + '</td>';
                        k += '</tr>';
                    }
                    k += '</tbody>'
                    biditem += '<tbody>';
                    for (var i = 0; i < p.length; i++) {
                        if (p[i].bidRequestItemList != null) {
                            var f = [];
                            f = p[i].bidRequestItemList;
                            for (var j = 0; j < f.length; j++) {
                                biditem += '<tr>';
                                biditem += '<td>' + f[j].id + '</td>';
                                biditem += '<td>' + p[i].id + '</td>';
                                biditem += '<td>' + f[j].item + '</td>';
                                biditem += '<td>' + f[j].quantity + '</td>';
                                biditem += '<td>' + f[j].description + '</td>';
                                biditem += '</tr>';
                            }
                        }
                    }
                    biditem += '</tbody>';
                    response += '<tbody>';
                    for (var i = 0; i < p.length; i++) {
                        if (p[i].bidRequestItemList != null) {
                            var f = [];
                            f = p[i].bidRequestItemList;
                            for (var j = 0; j < f.length; j++) {
                                if (f[j] != null) {
                                    console.log('f[i].supplierResponseList' + JSON.stringify(f[i]) + f.length)
                                    var a = [];
                                    a = f[j].supplierResponseList;
                                    if (a != null) {
                                        if (a.length != null) {
                                            for (var z = 0; z < a.length; z++) {
                                                response += '<tr>';
                                                response += '<td>' + p[i].id + '</td>';
                                                response += '<td>' + a[z].rank + '</td>';
                                                response += '<td>' + a[z].name + '</td>';
                                                response += '<td>' + a[z].quantity + '</td>';
                                                response += '<td>' + a[z].amount + '</td>';
                                                response += '<td>' + a[z].isAccepted + '</td>';
                                                response += '</tr>';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    response += '</tbody>';
                    console.log(response);
                    if (input.request == 'get_all') {
                        $('#createBid').hide();
                        $('#tableReponse').show();
                        $('#tableDivItem').show();
                        $('#tableDiv').show();
                        $('#tableDiv').html(k + '</table>');
                        $('#tableDivItem').html(biditem + '</table>');
                        $('#tableReponse').html(response + '</table>');
                    } else {
                        $('#createBid').attr("style", "margin-top: 10px; margin-left: 250px; margin-right: 250px;");;
                        $(document).ready(function () {
                            $(".add-row").click(function () {
                                var item = $("#item").val();
                                var quantity = $("#quantity").val();
                                var description = $("#description").val();
                                var markup = "<tr><td>" + item + "</td><td>" + quantity + "</td><td>" + description + "</td></tr>";
                                $("table tbody").append(markup);
                            });
                        });
                        $('#tableDiv').hide();
                        $('#tableDivItem').hide();
                        $('#tableReponse').hide();
                    }
                });
            }
        }
    };





    var getAllRequestedBids = async () => {
        var response = await fetch('http://localhost:8076/manager/get_all?active=true&inactive=true');
        console.log('getAllRequestBids ' + JSON.stringify(response));
        console.log(JSON.stringify(response));
        return await response.json();
    };


    var getAllBids = async (name) => {
        const response = await fetch('http://localhost:8076/suppliers/get_all?name='+name);
        console.log(response);
        return await response.json();
    };

    return {
        getAll: function () {
            return getAllRequestedBids();
        },
        getAllBidsByName: function (name) {
            return getAllBids(name);
        },
        init: function () {
            console.log('Application has started.');
            uiCtrl.getDOMstrings();
            getAllRequestedBids();
            setUpEventListeners();
        }
    }
})(UICOntroller);

controller.init();