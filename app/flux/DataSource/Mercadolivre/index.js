import Request from '../request';
import Settings from './settings';

const resource = Settings.URI;
const appId = Settings.MERCADOLIVREAPPID;
const uriMercadoLivre = Settings.MERCADOLIVRE;
const uriAuthMercadoLivre = Settings.AUTHMERCADOLIVRE;

class MercadolivreDataSource {
    static authorize (departmentId) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${uriAuthMercadoLivre}?response_type=code&client_id=${appId}&redirect_uri=${uriMercadoLivre}?departmentId=${departmentId}`, params);
    }

    static fetchAll (accountId) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${resource}?accountId=${accountId}`, params);
    }
}

export default MercadolivreDataSource;
