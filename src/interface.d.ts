export interface IAudioAPI {
    save: (buffer: ArrayBuffer) => Promise<string>,
}

declare global {
    interface Window {
        audioAPI: IAudioAPI
    }
}