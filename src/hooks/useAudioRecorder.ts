import {useRef} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import AudioRecorderPlayer, {
  AVEncodingOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import {sendMsgToWeb} from '../types';

const useAudioRecorder = (sendMsgToWeb: sendMsgToWeb) => {
  const audioRecorderRef = useRef(new AudioRecorderPlayer());

  const requestAosPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external storage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  };

  const startRecording = async () => {
    try {
      await requestAosPermission();

      await audioRecorderRef.current.startRecorder(undefined, {
        AVFormatIDKeyIOS: AVEncodingOption.mp4,
        OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
      });

      sendMsgToWeb('startRecording');
    } catch (error) {
      console.error('🚀 ~ startRecording ~ error', error);
    }
  };

  const stopRecording = async () => {
    try {
      const filePath = await audioRecorderRef.current.stopRecorder();
      const ext = filePath.split('.').pop(); // 확장자 추출
      const base64Audio = await RNFS.readFile(filePath, 'base64');

      const data = {
        audio: base64Audio,
        mimeType: 'audio/mp4',
        ext,
      };
      sendMsgToWeb('stopRecording', data);
    } catch (error) {
      console.error('🚀 ~ stopRecording ~ error:', error);
    }
  };

  const pauseRecording = async () => {
    try {
      await audioRecorderRef.current.pauseRecorder();
      sendMsgToWeb('pauseRecording');
    } catch (error) {
      console.error('🚀 ~ pauseRecording ~ error:', error);
    }
  };

  const resumeRecording = async () => {
    try {
      await audioRecorderRef.current.resumeRecorder();
      sendMsgToWeb('resumeRecording');
    } catch (error) {
      console.error('🚀 ~ resumeRecording ~ error:');
    }
  };

  return {startRecording, stopRecording, pauseRecording, resumeRecording};
};

export default useAudioRecorder;
