// 게임 시작 핸들러
import { getGameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';


export const gameStart = (uuid, payload) => {
    
    const { stages } = getGameAssets();

    //
    clearStage(uuid);

    // stages 배열 0번째 = 첫 번째 스테이지
    setStage(uuid, stages.data[0].id, payload.timestamp);
    console.log('stage: ', getStage(uuid));

    return { status: 'success' }
}

export const gameEnd = (uuid, payload) => {

    // 클라이언트 게임 종료 시 타임스탬프와 총 점수
    const { timestamp:gameEndTime, score } = payload;
    const stages = getStage(uuid);

    if (!stages.length) {
        return { status: "fail", message: "No stages found for user" };
    }

    // 각 스테이지 지속 시간을 계산하여 총 점수 계산
    let totalScore = 0;

    stages.forEach((stage, index) => {
        let stageEndTime;
        
        if (index === stage.length - 1) {
            stageEndTime = gameEndTime;
        } else {
            stageEndTime = stages[index + 1].timestamp;
        }
        
        const stageDuration = (stageEndTime - stage.timestamp) / 1000;
        totalScore += stageDuration; // 1초당 1점
    })

    // 점수와 타임스탬프 검증
    if (Math.abs(score - totalScore) > 5) {
        return { status: "fail", message: "Score verification failed" };
    }

    // DB 저장 시

    return { status: 'success', message: "game end", score };
}

















