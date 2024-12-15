import AsyncStorage from '@react-native-async-storage/async-storage';
import {sendMsgToWeb} from '../types';

const KEY_NAME = 'database';

const useStorage = (sendMsgToWeb: sendMsgToWeb) => {
  const loadDatabase = async () => {
    const database = await AsyncStorage.getItem(KEY_NAME);
    const data = database ? JSON.parse(database) : {};
    sendMsgToWeb('loadDatabase', data);
  };

  const saveDatabase = async (data: any) => {
    await AsyncStorage.setItem(KEY_NAME, JSON.stringify(data));
  };

  return {loadDatabase, saveDatabase};
};

export default useStorage;
