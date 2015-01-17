ko.bindingHandlers.currency = {
    symbol: ko.observable('$'),
    update: function(element, valueAccessor, allBindingsAccessor){
        return ko.bindingHandlers.text.update(element,function(){
            var value = +(ko.utils.unwrapObservable(valueAccessor()) || 0),
                symbol = ko.utils.unwrapObservable(allBindingsAccessor().symbol === undefined
                            ? allBindingsAccessor().symbol
                            : ko.bindingHandlers.currency.symbol);
            return symbol + value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        });
    }
};

function CustomerViewModel() {
    // Data
    var self = this;
    self.customers = ko.observable();
    self.orders = ko.observableArray();
    self.customerOrder = ko.observable();
    self.ordersTotal = ko.observable();

    // Behaviours    
    self.goToCustomers = function() { location.hash = 'customers' };
    self.goToOrders = function() { location.hash = 'orders' };
    self.goToOrder = function(order) { location.hash = 'orders/' + order.id}

    var calculateTotal = function() {
        var total = 0;
        console.log(self.orders());
        for (var i=0,len=self.orders().length;i<len;i++) {
            total += self.orders()[i].total;
        }
        self.ordersTotal(total);
    }

    // Client-side routes    
    Sammy(function() {
        this.get('#customers', function() {
            console.log('Customers route');

            $('.welcome').hide();
            $('.customers').show();
            $('.orders').hide();
            $('.customerOrder').hide();

            $.get("/api/customers", self.customers);
        });

        this.get('#orders', function() {
            console.log('Orders route');

            $('.welcome').hide();
            $('.customers').hide();
            $('.orders').show();
            $('.customerOrder').hide();

            $.get("/api/orders", function(data) {
                self.orders(data);
                calculateTotal();
            });

        });

        this.get('#orders/:customerId', function() {
            console.log('Customer order route');

            $('.welcome').hide();
            $('.customers').hide();
            $('.orders').hide();
            $('.customerOrder').show();

            // $.get("/customers", { folder: this.params.folder }, self.chosenFolderData);
        });
    
        this.get('', function() {

            $('.welcome').show();
            $('.customers').hide();
            $('.orders').hide();
            $('.customerOrder').hide();

        });
    }).run();    
};

ko.applyBindings(new CustomerViewModel());
