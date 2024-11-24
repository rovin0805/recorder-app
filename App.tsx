/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Platform, SafeAreaView} from 'react-native';
import WebView from 'react-native-webview';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        source={{
          uri:
            Platform.OS === 'android'
              ? 'http://10.0.2.2:3000'
              : 'http://localhost:3000',
        }}
      />
    </SafeAreaView>
  );
}

export default App;
