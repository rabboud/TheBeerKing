import Request from '../request';
import Settings from './settings';

const resourceList = Settings.URI_LIST;

class ProfileDataSource {
    static fetchAll (receiveParams) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${resourceList}?accountId=${receiveParams.accountId}`, params);
    }
}

export default ProfileDataSource;
