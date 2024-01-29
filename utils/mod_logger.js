import fs from 'node:fs'
import url from "node:url";


const urls = {
    all: url.pathToFileURL('./utils/log/all.log'),
    target: url.pathToFileURL('./utils/log/target.log'),
};
const prev_logger = console.log;
console.dirs = {
    debug: '[DEBUG]',
    target: '[TARGET]',
};


function ClearLogs() {
    for (let key in urls) {
        let url = urls[key];
        let file = fs.openSync(url, 'w+');
        fs.closeSync(file);
    }
}


// Очистка логов
ClearLogs();


console.log = (...args) => {
    let date = new Date();
    if (!args.find((el) => Object.values(console.dirs).includes(el)))
        args.unshift(console.dirs.debug);
    try {
        const str = `$<${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()}> ${args.join(' ')}\n`;

        if (args[0]) {
            switch (args[0]) {
                case console.dirs.target:
                    const target_log = fs.openSync(urls.target, 'a');
                    fs.writeSync(target_log, str);
                    fs.closeSync(target_log);
                    break;
                default:
                    prev_logger(...args);

                    const default_log = fs.openSync(urls.all, 'a');
                    fs.writeSync(default_log, str);
                    fs.closeSync(default_log);
                    break;
            }
        }
    }
    catch (e) {
        console.warn('Ошибка при записи в файл последнего сообщения... Аргументы: ', ...args);
    }
}
