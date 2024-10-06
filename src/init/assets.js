import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


let gameAssets = {};

// 경로 찾기
const _filename = fileURLToPath(import.meta.url); // 절대 경로
const _dirname = path.dirname(_filename); // 파일명

// 최상위 경로 + assets 폴더
const basePath = path.join(_dirname, '../../assets');

// 파일 읽기 함수
// 비동기 병렬로 파일 읽기
const readFileAsync = (filename) => {
    return new Promise((resolve, reject) => {
        // fs 메서드로 파일 읽기 ( 필요 인자 : path, options, callback )
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
// 게임 설정
export const loadGameAssets = async () => {

    try {
        // 데이터 테이블 파일 불러오기
        const [stages, items, itemUnlocks] = await Promise.all([
            readFileAsync('stage.json'),
            readFileAsync('item.json'),
            readFileAsync('item_unlock.json'),
        ]);

        // 게임 에셋 설정
        gameAssets = { stages, items, itemUnlocks };
        return gameAssets;
    } catch (e) {
        throw new Error('failed' + e.message);
    }
}

export const getGameAssets = () => {
    return gameAssets;
}