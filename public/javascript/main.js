function CustomerViewModel() {
    // Data
    var self = this;
    self.customerData = ko.observable();
    // self.chosenFolderId = ko.observable();
    // self.chosenMailData = ko.observable();

    // Behaviours    
    self.goToCustomers = function() { location.hash = 'customers' };
    self.goToOrders = function() { location.hash = 'orders' };
    // self.goToMail = function(mail) { location.hash = mail.folder + '/' + mail.id };

    // Client-side routes    
    Sammy(function() {
        this.get('#customers', function() {
            console.log('Customers route');

            $('.welcome').hide();
            $('.customers').show();

            $.get("/api/customers", self.customerData);
        });

        this.get('#orders', function() {
            console.log('Orders route');
        });

        this.get('#orders/:customerId', function() {
            console.log('Customer order route');
            // $.get("/customers", { folder: this.params.folder }, self.chosenFolderData);
        });
    
        this.get('', function() {
            $('.welcome').show();
            $('.customers').hide();
        });
    }).run();    
};

ko.applyBindings(new CustomerViewModel());
