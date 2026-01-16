export type VideoStandard = 'PAL' | 'NTSC';
export type VideoResolution = 'SD' | 'HD';

export type Timecode = {
  hours: number;
  minutes: number;
  seconds: number;
  frames: number;
};

export type Clip = {
  id: string;
  name: string;
  description: string;
  standard: VideoStandard;
  resolution: VideoResolution;
  startTimecode: Timecode;
  endTimecode: Timecode;
};
