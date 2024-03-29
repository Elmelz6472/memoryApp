type KeyExtractor<T> = (item: T) => string | number

const shuffleArray = <T>(array: T[], keyExtractor?: KeyExtractor<T>): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

const shuffleArrayId = <T>(array: T[], keyExtractor: KeyExtractor<T>): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

export default shuffleArray
