interface Milestone {
    date: string
    event: string
    cuteDescription: string
    uri?: string
}

const milestones: Milestone[] = [
    {
        date: '9th march',
        event: 'happy ending',
        cuteDescription: 'Happy ending!',
        uri: 'https://bucket-memoryapp.nyc3.cdn.digitaloceanspaces.com/memories/photoshoot/IMG_3770.jpeg'
    },
    {
        date: 'Milestone 2 Date',
        event: 'Milestone 2 Event',
        cuteDescription: 'Milestone 2 Cute Description',
        uri: 'https://bucket-memoryapp.nyc3.cdn.digitaloceanspaces.com/memories/dates/36B40572-8AAA-4E1B-AC42-855271545D36.mov'
    },
]

export default milestones
