import './autoload/models.js';


export default {
    id: 'base',
    version: '0.1',

    command_list: [
        { path: 'hello',   need_controller: true },
        { path: 'balance', need_controller: true },
        { path: 'reg',     need_controller: true },
        { path: 'reset',   need_controller: true },
    ],

    messages_list: [
        { code: 'not_authorized', path: 'not_authorized',  },
        { code: 'balance',        path: 'balance',         },
        { code: 'eph-hello',      path: 'hello',           },
        { code: 'shared-hello',   path: 'hello_share',     },
    ],

    autoload: [
        { path: '/autoload/schemes.js', type: 'onload', add: [ 'models' ] },
        { path: '/autoload/test.js',    type: 'onload', add: [ 'views', 'controllers', 'models' ] },
    ],

    models_list: [
        { id: 'player',  path: 'player',  global: true },
        { id: 'table',   path: 'table',   global: true },
        { id: 'admins',  path: 'admins',  global: true },
    ],
};
