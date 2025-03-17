declare module "whisper-node" {
  interface WhisperSegment {
    start: string;
    end: string;
    speech: string;
  }

  function whisper(filePath: string, options?: Record<string, unknown>): Promise<WhisperSegment[]>;

  export default whisper;
}

declare module "fluent-ffmpeg" {
  import { ChildProcess } from "child_process";
  import { EventEmitter } from "events";

  // Interface for codec information returned by ffmpeg.
  export interface CodecData {
    audio: string;
    video: string;
    // Additional codec info can be added as needed.
  }

  // Interface for progress events.
  export interface ProgressData {
    frames: number;
    currentFps: number;
    currentKbps: number;
    targetSize: number;
    timemark: string;
    percent?: number;
  }

  // Main interface for an ffmpeg command.
  export interface FfmpegCommand extends EventEmitter {
    /**
     * Sets the input for the command.
     * @param source A file path, URL, or Buffer.
     */
    input(source: string | Buffer): this;
    input(source: string | Buffer, options: string | string[]): this;

    /**
     * Sets the output for the command.
     * @param target A file path.
     */
    output(target: string): this;

    /**
     * Specifies the output format.
     * @param format The format name (e.g. "wav", "mp4").
     */
    toFormat(format: string): this;

    /**
     * Starts processing the command.
     */
    run(): ChildProcess;

    /**
     * Shortcut to save the output to a file.
     * @param filename The output filename.
     */
    save(filename: string): void;

    // Event handlers.
    on(event: "start", callback: (commandLine: string) => void): this;
    on(event: "codecData", callback: (data: CodecData) => void): this;
    on(event: "progress", callback: (progress: ProgressData) => void): this;
    on(event: "stderr", callback: (stderrLine: string) => void): this;
    on(event: "error", callback: (err: Error, stdout: string, stderr: string) => void): this;
    on(event: "end", callback: () => void): this;
  }

  // The static interface to create a new ffmpeg command.
  export interface FfmpegStatic {
    (source?: string | Buffer): FfmpegCommand;
    /**
     * Specify the path to the ffmpeg binary.
     */
    setFfmpegPath(path: string): void;
    /**
     * Specify the path to the ffprobe binary.
     */
    setFfprobePath(path: string): void;
  }

  const ffmpeg: FfmpegStatic;
  export default ffmpeg;
}
