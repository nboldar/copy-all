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
        if (typeof destination !== 'string') throw  new Error('Path of read dir should be string');
        destination = path.isAbsolute(destination) ? destination : path.resolve(process.cwd(), destination);
        for await (let entry of srcArr) {
            let copyingFolderBaseName = entry.dir.split(entry.readDir)[1];
            console.dir(copyingFolderBaseName, {showHidden: true, depth: 10, colors: true});
            const destPath = destination + path.sep + copyingFolderBaseName;
            await fs.promises.mkdir(destPath, {recursive: true});
            const pathToSourceEntity = entry.dir + path.sep + entry.base;
            const pathToDestEntity = destPath + path.sep + entry.base;
            const stats = await fs.promises.stat(pathToSourceEntity);
            if (stats.isFile()) {
                await fs.promises.copyFile(
                    pathToSourceEntity,
                    pathToDestEntity,
                    fs.constants.COPYFILE_FICLONE)
            } else {
                await fs.promises.mkdir(pathToDestEntity, {recursive: true});
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