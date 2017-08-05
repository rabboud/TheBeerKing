class Model {
    constructor (customer) {
        this.customerId = customer && customer.customerId !== null ? customer.customerId : '';
        this.customerKey = customer && customer.customerKey !== null ? customer.customerKey : '';
        this.department = customer && customer.department !== null ? customer.department : '';
        this.departmentId = customer && customer.departmentId !== null ? customer.departmentId : '';
        this.name = customer && customer.name !== null ? customer.name : '';
        this.email = customer && customer.email !== null ? customer.email : '';
        this.phone = customer && customer.phone !== null ? customer.phone : '';
        this.cpf = customer && customer.cpf !== null ? customer.cpf : '';
        this.photo = customer && customer.photo !== null ? customer.photo : '';
        this.browser = customer && customer.browser !== null ? customer.browser : '';
        this.ip = customer && customer.ip !== null ? customer.ip : '';
        this.so = customer && customer.os !== null ? customer.os : '';
        this.pageSource = customer && customer.source !== null ? customer.source : '';
        this.lastURL = customer && customer.source !== null ? customer.source : '';
        this.navigationHistory = [customer && customer.source !== null ? customer.source : ''];
        this.externalHistory = customer && customer.externalHistory !== null ? customer.externalHistory : '';
        this.remoteUrl = customer && customer.remoteUrl !== null ? customer.remoteUrl : '';
        this.state = customer && customer.state !== null ? customer.state : '';
        this.firstContact = customer && customer.firstContact !== null ? customer.firstContact : '';
        this.historyCount = customer && customer.historyCount !== null ? parseInt(customer.historyCount, 10) : '';
    }
}

export default Model;
