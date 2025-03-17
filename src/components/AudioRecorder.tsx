import React from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

const AudioRecorder = () => {
  const { audio, isRecording, start, stop, save, isSaved } = useAudioRecorder();

  return (
    <div className="flex flex-col items-center p-4">
      {/* Display recorded audio if available */}
      {audio && (
        <div className="mb-4 flex items-center">
          <audio
            controls
            src={audio}
            className={`mr-2 border p-1 ${isSaved ? 'border-green-500' : 'border-blue-500'}`}
          />
          {/* Save button only appears if the file hasn’t been converted yet */}
          {!isSaved && (
            <button
              onClick={save}
              className="p-2 bg-gray-300 hover:bg-gray-400 rounded"
              title="Save Audio"
            >
              {/* You can use any save icon here; this is just an example */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-800"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17 8a1 1 0 01-1 1h-3v6H7v-6H4a1 1 0 110-2h3V5a1 1 0 011-1h4a1 1 0 011 1v2h3a1 1 0 011 1z" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Recording button */}
      {!isRecording ? (
        <button
          onClick={start}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stop}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Stop Recording
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;
