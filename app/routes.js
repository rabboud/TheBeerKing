import app from './app';
import {
    User,
    Department,
    OfficeHour,
    Account,
    Telegram,
    Facebook,
    Webhook,
    Interaction,
    Visitor,
    Code,
    Sip,
    Inbox,
    Login,
    Mirror,
    Tags,
    Widget,
    Dashboard,
    Email,
    Meli,
    Integrations
} from './screens';

const NotFound = {
    path: '*',
    component: Visitor.component
};

export default {
    path: '/',
    component: app,
    indexRoute: Visitor,
    childRoutes: [
        User,
        Department,
        OfficeHour,
        Account,
        Telegram,
        Facebook,
        Webhook,
        Interaction,
        Code,
        Sip,
        Inbox,
        Login,
        Mirror,
        Tags,
        Widget,
        Dashboard,
        Email,
        Meli,
        Integrations,
        NotFound
    ]
};
