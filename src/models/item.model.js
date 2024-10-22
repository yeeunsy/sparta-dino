export const collectItem = (uuid, itemId) => {
    const itemScore = getItemScore(itemId); // 아이템 점수 불러오기
    if (!itemScore) {
        return { status: 'fail', message: 'Invalid item' };
    }

    // 아이템을 플레이어에게 추가
    addItemToPlayer(uuid, itemId, itemScore);

    return { status: 'success', message: 'Item collected', score: itemScore };
}