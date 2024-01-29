export default {
    id: 'roulette',
    version: '0.1',

    command_list: [
        { path: 'launch',  need_controller: true },
        { path: 'bet',     need_controller: false },
    ],

    messages_list: [
        { code: 'launch.fail',    path: 'failed_launch',  },
        { code: 'not_authorized', path: 'not_authorized', },
        { code: 'help',           path: 'help'            },
        { code: 'game_state',     path: 'game_state'      },
        { code: 'bet.count',      path: 'bet_count'       },
    ],

    models_list: [
        { id: 'table',  path: 'table',  global: false },
    ],
};
