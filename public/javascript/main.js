(function(){
    var format = function(value) {
        toks = value.toFixed(2).replace('-', '').split('.');
        var display = '$' + $.map(toks[0].split('').reverse(), function(elm, i) {
            return [(i % 3 === 0 && i > 0 ? ',' : ''), elm];
        }).reverse().join('') + '.' + toks[1];

        return value < 0 ? '-' + display : display;
    };

    ko.subscribable.fn.money = function() {
        var target = this;
        
        var writeTarget = function(value) {
            var stripped=value.replace(/[^0-9.-]/g, '');
            
            target(parseFloat(stripped));
        };
        
        var result = ko.computed({
            read: function() {
                return target();
            },
            write: writeTarget
        });

        result.formatted = ko.computed({
            read: function() {
                if (target()) {
                    return format(target());
                }
            },
            write: writeTarget
        });
        
        result.isNegative = ko.computed(function(){
            return target()<0;
        });

        return result;
    };
})();


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

            $.get("api/customers/" + this.params.customerId, self.customerOrder);
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
