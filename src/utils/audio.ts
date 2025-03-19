import toWav from 'audiobuffer-to-wav';

/**
 * Encodes an AudioBuffer to a WAV file with the specified sample rate.
 *
 * @param audioBuffer - The AudioBuffer to encode.
 * @param sampleRate - The desired sample rate for the WAV file (default is 16000 Hz).
 * @returns A Promise that resolves to an ArrayBuffer containing the WAV file data.
 */
export async function encodeWAV(
    audioBuffer: AudioBuffer,
    sampleRate: number = 16000
): Promise<ArrayBuffer> {
    // Check if resampling is necessary
    if (audioBuffer.sampleRate === sampleRate) {
        // Encode directly to WAV without resampling
        return toWav(audioBuffer);
    }

    // Resample the audio using OfflineAudioContext
    const numberOfChannels = audioBuffer.numberOfChannels;
    const duration = audioBuffer.duration;
    const offlineContext = new OfflineAudioContext(
        numberOfChannels,
        duration * sampleRate,
        sampleRate
    );

    // Create a buffer source and connect it to the offline context
    const bufferSource = offlineContext.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(offlineContext.destination);
    bufferSource.start(0);

    // Render the resampled audio
    const resampledBuffer = await offlineContext.startRendering();

    // Encode the resampled AudioBuffer to WAV
    return toWav(resampledBuffer);
}
