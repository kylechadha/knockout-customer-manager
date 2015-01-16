function CustomerViewModel() {
    // Data
    var self = this;
    self.folders = ['Inbox', 'Archive', 'Sent', 'Spam'];
    self.chosenFolderId = ko.observable();
    self.chosenFolderData = ko.observable();
    self.chosenMailData = ko.observable();

    // Behaviours    
    self.goToFolder = function(folder) { location.hash = folder };
    self.goToMail = function(mail) { location.hash = mail.folder + '/' + mail.id };

    // Client-side routes    
    Sammy(function() {
        this.get('customers', function() {
            console.log('Customers route');
            // self.chosenFolderId(this.params.folder);
            // self.chosenMailData(null);
            // $.get("/mail", { folder: this.params.folder }, self.chosenFolderData);
        });

        this.get('orders', function() {
            console.log('Orders route');
        });

        this.get('orders/:customerId', function() {
            console.log('Customer order route');
        });
    
        this.get('');
    }).run();    
};

ko.applyBindings(new CustomerViewModel());