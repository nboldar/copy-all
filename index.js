'use strict';

const fs = require('fs');
const path = require('path');
const readDirectory = require('node-read-directory');

/**
 * @param {String} destination is path where you want to copy путь к папке куда надо скопировать содержимое исходной папки
 * @param {Array} srcArr is array of objects with info about copying files
 * @returns {Promise<void>}
 */
const copyToDest = async (destination, srcArr) => {
    try {
        for await (let entry of srcArr) {
            let chunkData = entry.dir.split(entry.root)[1];
            const destPath = destination + path.sep + chunkData;
            await fs.promises.mkdir(destPath, {recursive: true});
            if (entry.type === 'file') {
                await fs.promises.copyFile(
                    entry.dir + path.sep + entry.base,
                    destPath + path.sep + entry.base,
                    fs.constants.COPYFILE_FICLONE)
            }
        }
    } catch (err) {
        console.log(err);
    }
};
/**
 *
 * @param {String} source
 * @param {String} destination
 * @returns {Promise<void>}
 */
module.exports = async (source, destination) => {
    try {
        const srcArr = await readDirectory(source);
        return await copyToDest(destination, srcArr);
    } catch (err) {
        console.log(err)
    }
};