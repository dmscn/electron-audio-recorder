import { useState, useRef } from 'react';
import { encodeWAV } from '../utils/audio';

export function useAudioRecorder() {
  const [audio, setAudio] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedBlobRef = useRef<Blob | null>(null);

  const start = async () => {
    if (!navigator.mediaDevices) {
      console.error('Media devices are not available');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      mediaRecorder.addEventListener('stop', () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        recordedBlobRef.current = blob;
        const audioUrl = URL.createObjectURL(blob);
        setAudio(audioUrl);
        setIsSaved(false);
      });
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone', err);
    }
  };

  const stop = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const save = async () => {
    if (recordedBlobRef.current) {
      try {
        // Decode the WebM audio data into an AudioBuffer
        const arrayBuffer = await recordedBlobRef.current.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Encode the AudioBuffer to a WAV ArrayBuffer with a sample rate of 16,000 Hz
        const wavArrayBuffer = await encodeWAV(audioBuffer, 16000);

        // Send the base64-encoded WAV data to the main process for storage
        const { success, record: { data } } = await window.audioAPI.save(wavArrayBuffer, 'user');
        if (success && data) {
          const wavUrl = `data:audio/wav;base64,${data}`;
          setAudio(wavUrl);
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error processing audio:', error);
      }
    }
  };


  return { audio, isRecording, start, stop, save, isSaved };
}
