class Session {
    static set (key, value) {
        sessionStorage.setItem(key, value);
    }

    static get (key) {
        return sessionStorage.getItem(key);
    }

    static clear () {
        sessionStorage.clear();
    }
}

export default Session;
