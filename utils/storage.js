import fs from "node:fs";
import url from "node:url";
import mongoose from 'mongoose';


// Ссылки для сохранений
const DATAFILE_PATH = {
    all: './data/data.js',
};
for (let key in DATAFILE_PATH) {
    const to_path = DATAFILE_PATH[key];

    // Перевод ссылок в абсолютные uri из относительных
    DATAFILE_PATH[key] = url.pathToFileURL(to_path);
}


const storage = {
    data: {},
    ToSaveLoadTime: 5000,
    _load_task: {},

    async RecordLoading() {
        if (this._load_task === null) {
            this._load_task = setTimeout(() => {
                load_data();
            }, this.ToSaveLoadTime);
        }
    },
    IsLoading() {
        return (this._load_task === null);
    },

    _save_task: {},
    async RecordSaving() {
        if (this._save_task === null) {
            this._save_task = setTimeout(() => {
                store_data()
            }, this.ToSaveLoadTime);
        }
    },

    IsSaving() {
        return (this._save_task === null);
    },

    set(values) {
        for (let el of Array.isArray(values)? values: [values])
            this.data[el.key] = el.value;
        this.RecordSaving();
    },
    remove(key) {
        for (let el of Array.isArray(key)? key: [key])
            delete this.data[el];
        this.RecordSaving();
    },
    get(key) {
        if (Array.isArray(key)) {
            return key.map(key => {
                return this.data[key];
            });
        }
        return this.data[key];
    },
}


export default storage;
