class Model {
    constructor (partner) {
        this.id = partner && partner.id !== null ? partner.id : '';
        this.name = partner && partner.name !== null ? partner.name : '';
        this.token = partner && partner.token !== null ? partner.token : '';
        this.url = partner && partner.url !== null ? partner.url : '';
        this.logoId = partner && partner.logo_id !== null ? partner.logo_id : '';
        this.logoUrl = partner && partner.logo_url !== null ? partner.logo_url : '';
        this.createdAt = partner && partner.created_at !== null ? partner.created_at : '';
        this.updatedAt = partner && partner.updated_at !== null ? partner.updated_at : '';
    }
}

export default Model;
