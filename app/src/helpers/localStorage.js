import { AsyncStorage } from "react-native";

// This is a quick implementation to save the received calendar event locally
// Documentation can be found here: https://docs.expo.io/versions/latest/react-native/asyncstorage/

// TODO: Discuss how we want to implement storing the events

export async function _storeData(key, item) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    // Error saving data
    console.log({ error });
    console.error(error);
  }
}

export async function _retrieveData(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    // Error retrieving data
    console.log({ error });
    console.error(error);
  }
}
