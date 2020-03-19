'use strict';

const fs = require('fs');
const path = require('path');
const readDirectory = require('node-read-directory');

/**
 * @param {String} destination is path where you want to copy content
 * @param {Array} srcArr is array of objects with info about copying files
 * @returns {Promise<void>}
 */
const copyToDest = async (destination, srcArr) => {
    try {
        if (typeof destination !== 'string') throw  new Error('Path of read dir should be string');
        destination = path.isAbsolute(destination) ? destination : path.resolve(process.cwd(), destination);
        for await (let entry of srcArr) {
            const copyingFolderBaseName = entry.dir.split(entry.readDir)[1];
            const destPath = destination + path.sep + copyingFolderBaseName;
            const pathToSourceEntity = entry.dir + path.sep + entry.base;
            const pathToDestEntity = destPath + path.sep + entry.base;

            await fs.promises.mkdir(destPath, {recursive: true});
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