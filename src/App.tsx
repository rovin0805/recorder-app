import React, {useRef} from 'react';
import {
  LogBox,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {Camera} from 'react-native-vision-camera';
import {MsgType} from './types';
import useAudioRecorder from './hooks/useAudioRecorder';
import useCamera from './hooks/useCamera';
import useStorage from './hooks/useStorage';

LogBox.ignoreLogs(['rn-recordback']);

function App(): React.JSX.Element {
  const webViewRef = useRef<WebView | null>(null);

  const sendMsgToWeb = (type: MsgType, data?: any) => {
    const message = JSON.stringify({type, data});
    webViewRef?.current?.postMessage(message);
  };

  const {startRecording, pauseRecording, resumeRecording, stopRecording} =
    useAudioRecorder(sendMsgToWeb);
  const {cameraRef, device, isCameraOpen, openCamera, closeCamera, takePhoto} =
    useCamera(sendMsgToWeb);
  const {loadDatabase, saveDatabase} = useStorage(sendMsgToWeb);

  const handleOnMessageFromWeb = ({nativeEvent}: WebViewMessageEvent) => {
    const {type, data} = JSON.parse(nativeEvent.data);
    console.log('🚀 ~ handleOnMessageFromWeb:', type, data);

    switch (type as MsgType) {
      case 'startRecording':
        startRecording();
        break;
      case 'pauseRecording':
        pauseRecording();
        break;
      case 'resumeRecording':
        resumeRecording();
        break;
      case 'stopRecording':
        stopRecording();
        break;
      case 'openCamera':
        openCamera();
        break;
      case 'loadDatabase':
        loadDatabase();
        break;
      case 'saveDatabase':
        saveDatabase(data);
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        ref={webViewRef}
        source={{
          uri:
            Platform.OS === 'android'
              ? 'http://10.0.2.2:3000'
              : 'http://localhost:3000',
        }}
        onMessage={handleOnMessageFromWeb} // web에서 받은 메세지 처리
        webviewDebuggingEnabled
      />

      {isCameraOpen && device && (
        <View style={styles.camera}>
          <Camera
            ref={cameraRef}
            device={device}
            photo
            isActive
            photoQualityBalance="speed"
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity
            style={styles.cameraCloseButton}
            onPress={closeCamera}>
            <Text style={styles.cameraCloseText}>CLOSE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cameraPhotoButton}
            onPress={takePhoto}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  camera: {
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  cameraCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  cameraCloseText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cameraPhotoButton: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    bottom: 60,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
});
