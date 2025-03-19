export interface IAudioAPI {
    save: (wavArrayBuffer: ArrayBuffer, owner: string) => Promise<{ success: boolean; record?: { filename: string, data: string, owner: string }, error?: string }>,
}

declare global {
    interface Window {
        audioAPI: IAudioAPI
    }
}