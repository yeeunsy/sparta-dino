// 스테이지 일정 점수 달성 시 다음 스테이지 이동
import { getStage, setStage } from "../models/stage.model.js"
import { getGameAssets } from '../init/assets.js';


// 스테이지 설정 
export const moveStageHandler = (userId, payload) => {

    // 현재 스테이지 다음으로 넘어갈 대상 스테이지 정보 전달
    // 유저 현재 스테이지 정보
    let currentStages = getStage(userId);

    if (!currentStages.length) {
        return { status: 'fail', message: "no stages found for user" }
    }

    // 오름차순 가장 큰 스테이지 ID 확인 <- 유저의 현재 스테이지
    currentStages.sort((a, b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length - 1];

    // payload의 CurrentStage와 비교 (클라이언트 vs 서버 비교)
    if (currentStage.id !== payload.currentStage) {
        return { status: 'fail', message: 'current stage mismatch' };
    }

    // 게임 에셋에서 스테이지 정보 가져오기
    const { stage } = getGameAssets();

    // 현재 스테이지의 정보를 stageTable에서 가져오기
    const currentStageInfo = stages.data.find((stage) => stage.id === payload.currentStage);
    if (!currentStageInfo) {
        return { status: "fail", message: "Current stage info not found" };
    }

    // 목표 스테이지의 정보를 stageTable에서 가져오기
    const targetStageInfo = stages.data.find((stage) => stage.id === payload.targetStage);
    if (!targetStageInfo) {
        return { status: "fail", message: "Target stage info not found" };
    }

    // 점수 검증
    const serverTime = Date.now(); // 현재 타임스탬프
    //
    const userItems = getUserItems(userId);
    const totalScore = calculateTotalScore(currentStage, serverTime, true, userItems);
    //const elapsedTime = (serverTime - currentStage.timestamp) / 1000;


    if (targetStageInfo.score > totalScore) {
        return { status: 'fail', message: 'target stage not found' };
    }

    // 유저의 다음 스테이지 정보 업데이트 + 현재 시간
    setStage(userId, payload.targetStage, serverTime);
    return { status: "success", handler: 11 }; // 
}



