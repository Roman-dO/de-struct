/* Заготовленные ошибки */
global.Err = {
    UnreachableCode: ({}) => new Error('Код не должен быть достигнут'),

    ModelBuild:   ({ code, _global=false }) =>
        new Error(`Ошибка сборки ${ _global? 'GLOBAL': 'LOCAL' } модели ${code}`),

    AddonBuild:   ({ code }) => new Error('Аддон не собран'),
    MessageBuild: ({ code }) => new Error('Ошибка сборки сообщения'),
    CommandBuild: ({ code }) => new Error('Ошибка сборки команды'),

    ViewImport:       ({ location }) => new Error(`Ошибка импорта view по пути ${location}`),
    ViewBuild:        ({ location }) => new Error(`Ошибка сборки view по пути ${location}`),
    ControllerImport: ({ location }) => new Error(`Ошибка импорта controller по пути ${location}`),
    ControllerBuild:  ({ location }) => new Error(`Ошибка сборки controller по пути ${location}`),

    NoAddonsFolder:     ({}) => new Error('В корне проекта не найдена директория ./addons/'),
    InvalidAddonConfig: ({ location }) => new Error(`Конфиг аддона ${location} не валиден`),
    LoginDiscordError:  ({}) => new Error('Ошибка при авторизации бота'),
}
