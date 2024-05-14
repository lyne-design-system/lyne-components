export interface FailedFiles {
  browserName: string;
  name: string;
  failedFile: string;
  diffFile: string;
  baselineFile: string;
  isNew: boolean;
  vierports: string;
}

export type ScreenshotMap = Record<string, Record<string, Record<string, FailedFiles[]>>>;
