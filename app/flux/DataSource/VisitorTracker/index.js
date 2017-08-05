import Request from '../request';
import Settings from './settings';
const uriVisitors = Settings.VISITORS_URI;
const uriVisitorDetail = Settings.VISITOR_DETAIL_URI;
const uriVisitorInvite = Settings.VISITOR_INVITE_URI;
const uriVisitorMessage = Settings.VISITOR_MESSAGE_URI;
const uriReports = Settings.REPORTS;

class VisitorTrackerDataSource {
    static getVisitors (accountId) {
        const uri = uriVisitors + `/${accountId}`;
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', uri, params);
    }

    static getVisitorDetails (customerId) {
        const uri = uriVisitorDetail + `/${customerId}`;
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', uri, params);
    }

    static inviteVisitor (customerId, subscriberId, department, message) {
        const uri = uriVisitorInvite + `/${customerId}?agent=${subscriberId}&department=${department}&message=${message}`;
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', uri, params);
    }

    static getInviteData (agentId) {
        const uri = uriVisitorMessage + `?agent_id=${agentId}`;
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', uri, params);
    }

    static fetchTotalCount (accountId) {
        const uri = uriReports;

        return Request.do('GET', `${uri}?id=${accountId}&action=quantityOnSite`);
    }
}

export default VisitorTrackerDataSource;
