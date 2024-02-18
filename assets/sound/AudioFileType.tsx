export interface AudioFile {
    id: number;
    uri: string;
    artist: string;
    album: string;
    title: string;
    duration: string;
    coverArt: string;
}

import { TaylorSwiftAudioFiles } from './Taylor_Swift/Taylor_Swift_AudioObject'
import { KanyeWestAudioFiles } from './Kanye_West/Kanye_West_AudioObject';
import { JorjaSmithAudioFiles } from './Jorja_Smith/Jorja_Smith_AudioObjects'
import { NickiMinajAudioObjects } from './Nicki_Minaj/NickiMinajAudioObjects';
import shuffleArray from '../../utils/shuffleArray';


const allAudioFiles: AudioFile[] = [
    ...TaylorSwiftAudioFiles,
    ...KanyeWestAudioFiles,
    ...JorjaSmithAudioFiles,
    ...NickiMinajAudioObjects,
];



const keyExtractor = (item: AudioFile) => item.id;

// const shuffledAudioFiles = shuffleArray(allAudioFiles, keyExtractor);
const shuffledAudioFiles = KanyeWestAudioFiles;

// const audioFiles: AudioFile[] = shuffleArray(JorjaSmithAudioFiles.concat(NickiMinajAudioObjects))



export default shuffledAudioFiles;