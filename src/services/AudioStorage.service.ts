// src/services/AudioStorageService.ts
import Store from 'electron-store';

export interface AudioRecord {
    data: string;    // base64-encoded audio data
    owner: string;   // owner identifier
    timestamp: number;
}

class AudioStorageService {
    private store: Store;
    private readonly recordingsKey = 'recordings';

    constructor() {
        this.store = new Store();
        // Initialize the recordings array if it doesn't exist
        if (!this.store.get(this.recordingsKey)) {
            this.store.set(this.recordingsKey, [] as AudioRecord[]);
        }
    }

    /**
     * Save an audio recording.
     * @param base64Data - The base64-encoded audio data.
     * @param owner - A string identifying who recorded the audio.
     * @returns A Promise resolving to the saved AudioRecord.
     */
    public async saveRecording(base64Data: string, owner: string): Promise<AudioRecord> {
        const newRecord: AudioRecord = {
            data: base64Data,
            owner,
            timestamp: Date.now(),
        };
        const recordings = this.getRecordings();
        recordings.push(newRecord);
        this.store.set(this.recordingsKey, recordings);
        return newRecord;
    }

    /**
     * Retrieve all stored recordings.
     * @returns An array of AudioRecord objects.
     */
    public getRecordings(): AudioRecord[] {
        return this.store.get(this.recordingsKey, []) as AudioRecord[];
    }
}

export default new AudioStorageService();
