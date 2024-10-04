


// key: uuid, value: array -> stage 정보 배열
const stages = {};

// 초기화
export const createStage = (uuid) => {
    stages[uuid] = [];
}

export const getStage = (uuid) => {
    return stages[uuid];
}

export const setStage = (uuid, id, timestamp) => {
    return stages[uuid].push({ id, timestamp });
}