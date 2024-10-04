import { getStage, setStage } from "../models/stage.model.js"



export const moveStageHandler = (userId, payload) => {

    // 현재 스테이지  대상 스테이지
    // 유저 현재 스테이지 정보
    let currentStages = getStage(userId);

    if (!currentStages.length) {
        return { status: 'fail', message: "no stages found for user" }
    }


    // 오름차순 가장 큰 스테이지 ID 확인 <- 유저의 현재 스테이지
    currentStages.sort((a, b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length - 1];

    // 클라이언트 vs 서버 비교
    if (currentStage.id !== payload.currentStage) {
        return { status: 'fail', message: 'current stage mismatch' };
    }

    // 점수 검증
    const serverTime = Date.now(); // 현재 타임스탬프
    // 
    const elapsedTime = (serverTime - currentStage.timestamp) / 1000;


    // 다음 스테이지로 넘어갈 때
    // 5 = 임의로 정한 오차 범위
    if (elapsedTime < 100 || elapsedTime > 105) {
        return { status: 'fail', message: "invalid elapsed time" };
    }


    // targetStage 검증 < - 게임 에셋에 존재하는가
    const { stages } = getGameAssets();

    if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
        return { status: 'fail', message: 'target stage not found' };
    }


    setStage(userId, payload.targetStage, serverTime);
    return { status: "success" }
}



