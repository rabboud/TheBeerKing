import Http from 'superagent';

/*
    Input params must be like:
    params: {
        query: {},
        set: {},
        send: {}
    }
*/

class Request {
    static do (httpMethod = '', uri = '', params = {}) {
        return new Promise((resolve, reject) => {
            // console.log(`Requesting with\n SET:`, params.set, 'QUERY', params.query, 'SEND', params.send);
            Http(httpMethod, uri)
                .set(params.set || {})
                .query(params.query || {})
                .send(params.send || {})
                .on('error', (error) => {
                    reject(error);
                })
                .end((error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.body, result);
                    }
                });
        });
    }
}

export default Request;
