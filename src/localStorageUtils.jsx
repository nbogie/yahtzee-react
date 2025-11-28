const key = 'highScores';

function readHighScoresOrEmpty() {
    const highScoresStr = localStorage.getItem(key);
    let highScores = [];

    try {
        const temp = JSON.parse(highScoresStr);
        if (temp) {
            highScores = temp;
        }
    } catch (error) {
        console.log("couldn't parse json", error)
    }
    return highScores;
}
export function saveHighScore(total) {
    const highScores = readHighScoresOrEmpty();
    highScores.push([total, new Date()]);
    highScores.sort(([sc1, ...junk1], [sc2, ...junk2]) => sc2 - sc1)

    // debugger;
    localStorage.setItem(key, JSON.stringify(highScores.slice(0, 10)));
}

export function loadHighScores() {
    return readHighScoresOrEmpty();
}
export function wipeHighScores() {
    localStorage.setItem(key, JSON.stringify([]));
}