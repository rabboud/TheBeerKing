import Request from '../request';
import Settings from './settings';

const resource = Settings.URI;

class PartnerDataSource {
    static fetch (partner) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${resource}/${partner}`, params);
    }
}

export default PartnerDataSource;
