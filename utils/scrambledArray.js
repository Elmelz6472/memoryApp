function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getScrambledArray(inputArray, m) {
    if (m > inputArray.length) {
        m = inputArray.length
    }

    const newArray = [...inputArray];
    shuffleArray(newArray);

    return newArray.slice(0, m);
}

export default getScrambledArray;