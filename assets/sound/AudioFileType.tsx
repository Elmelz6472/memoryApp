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
import shuffleArray from '../../utils/shuffleArray';

const audioFiles: AudioFile[] = shuffleArray(KanyeWestAudioFiles.concat(TaylorSwiftAudioFiles))

export default audioFiles