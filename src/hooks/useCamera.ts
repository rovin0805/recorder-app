import {useRef, useState} from 'react';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import {MsgType} from '../types';

const useCamera = (sendMsgToWeb: (type: MsgType, data?: any) => void) => {
  const cameraRef = useRef<Camera | null>(null);
  const device = useCameraDevice('back');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const openCamera = async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'granted') {
      setIsCameraOpen(true);
    }
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const takePhoto = async () => {
    const file = await cameraRef.current?.takePhoto({
      flash: 'off',
    });
    if (file != null) {
      const base64Image = await RNFS.readFile(file.path, 'base64');
      const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;
      sendMsgToWeb('takePhoto', imageDataUrl);
    }
  };

  return {
    cameraRef,
    device,
    isCameraOpen,
    openCamera,
    closeCamera,
    takePhoto,
  };
};

export default useCamera;
