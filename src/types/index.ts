export type MsgType =
  | 'startRecording'
  | 'pauseRecording'
  | 'resumeRecording'
  | 'stopRecording'
  | 'openCamera'
  | 'takePhoto'
  | 'loadDatabase'
  | 'saveDatabase';

export type sendMsgToWeb = (type: MsgType, data?: any) => void;
