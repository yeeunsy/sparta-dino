import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


let gameAssets = {};


const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// 최상위 경로 + assets 폴더
const basePath = path.join(_dirname, '../../assets');

// 파일 읽기 함수 (비동기 병렬)
const readFileAsync = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {

            if (err) {
                reject(err);
                return;
            }

            resolve(JSON.parse(data));
        })
    })
}



//promise.all()
export const loadGameAssets = async () => {

    try {
        const [stages, items, itemUnlocks] = await Promise.all([
            readFileAsync('stage.json'),
            readFileAsync('item.json'),
            readFileAsync('item_unlock.json'),
        ]);

        gameAssets = { stages, items, itemUnlocks };
        return gameAssets;
    } catch (e) {
        throw new Error('failed' + e.message);
    }
}

export const getGameAssets = () => {
    return gameAssets;
}