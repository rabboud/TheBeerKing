import Request from '../request';
import Settings from './settings';

const resource = Settings.URI;
const hash = Settings.HASH;
const set = {
    hash,
    'X-Requested-By': 'GlassFish REST HTML interface'
};

class AppearanceDataSource {
    static fetch () {
        const params = {
            set: set
        };

        return Request.do('GET', `${resource}/invite`, params);
    }
}

export default AppearanceDataSource;
