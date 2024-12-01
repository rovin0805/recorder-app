import React, {useRef} from 'react';
import {Platform, SafeAreaView} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {MsgType} from './types';
import useAudioRecorder from './hooks/useAudioRecorder';

function App(): React.JSX.Element {
  const webViewRef = useRef<WebView | null>(null);

  const sendMsgToWeb = (type: MsgType, data?: any) => {
    const message = JSON.stringify({type, data});
    webViewRef?.current?.postMessage(message);
  };

  const {startRecording, pauseRecording, resumeRecording, stopRecording} =
    useAudioRecorder(sendMsgToWeb);

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
        // web에서 받은 메세지 처리
        onMessage={handleOnMessageFromWeb}
        webviewDebuggingEnabled
      />
    </SafeAreaView>
  );
}

export default App;
