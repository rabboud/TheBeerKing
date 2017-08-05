let Sip = window.OmzSIP;

const OmzSip = (registerPreferences) => {
    Sip = window.OmzSIP;
    return new Sip(registerPreferences);
};

export default OmzSip;
