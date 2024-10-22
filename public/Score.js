import { send } from 'express/lib/response.js';
import { sendEvent } from './Socket.js';

class Score {
  score = 0; // 점수
  scoreIncrement = 0; //
  HIGH_SCORE_KEY = 'highScore';
  currentStage = 1000; // 현재 스테이지 ID
  stageChanged = {};  // 스테이지 변경 확인용 플래그

  constructor(ctx, scaleRatio, stageTable, itemTable, itemController) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageTable = stageTable; // 외부에서 전달된 스테이지 테이블 사용
    this.itemTable = itemTable;
    this.itemController = itemController; // itemController 저장

    // 모든 스테이지에 대해 stageChanged 초기화
    this.stageTable.forEach((stage) => {
      this.stageChanged[stage.id] = false;
    })
  }

  update(deltaTime) {
    //this.score += deltaTime * 0.001;
    const currentStageInfo = this.stageTable.find((stage) => stage.id === this.currentStage);
    const scorePerSecond = currentStageInfo ? currentStageInfo.scorePerSecond : 1;

    // 증가 분 누적
    this.scoreIncrement += deltaTime * 0.001 * scorePerSecond; // 해주지 않으면 점수가 1, 2, 3 씩 올라가지 않고 그냥 빠르게 올라가기만 함

    // 증가분이 scorePerSecond 만큼 쌓이면 score에 반영 후 초기화
    if (this.scoreIncrement >= scorePerSecond) {
      this.score += scorePerSecond;
      this.scoreIncrement -= scorePerSecond;
    }

    // // 점수가 100점 이상이 될 시 서버에 메세지 전송
    // if (Math.floor(this.score) === 100 && this.stageChange) {
    //   this.stageChange = false;
    //   sendEvent(11, { currentStage: 1000, targetStage: 1001 });

    this.checkStageChange();

  }

  checkStageChange() {
    for (let i = 0; i < this.stageTable.length; i++) {
      const stage = this.stageTable[i];

      // 현재 점수가 스테이지 점수 이상이고 해당 스테이지로 변경된 적이 없을 때
      if (Math.floor(this.score) >= stage.score && !this.stageChanged[stage.id] && stage.id !== 1000) { // 
        const previousStage = this.currentStage; // 현재 스테이지를 이전 스테이지로 할당
        this.currentStage = stage.id; // 현재 스테이지에 다음 스테이지 할당

        // 해당 스테이지로 변경됨을 표시
        this.stageChanged[stage.id] = true;

        // 서버로 이벤트 전송
        sendEvent(11, { this.currentStage: previousStage, targerStage: this.currentStage });

        // 아이템 컨트롤러에 현재 스테이지 설정
        if (this.itemController) {
          this.itemController.setCurrentStage(this.currentStage);
        }
        // 스테이지 변경 후 반복 종료
        break;
      }
    }
  }

  getItem(itemId) {
    this.score += 0;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
