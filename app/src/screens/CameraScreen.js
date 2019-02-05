import React from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { ImagePicker, Permissions } from 'expo';

export default class CameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    image: null,
    uploading: false,
  };

  async componentDidMount() {
    try {
      // Get camera permission
      const camPerm = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({
        hasCameraPermission: camPerm.status === 'granted',
      });

      // Get camera_roll & storage permission
      const camRollPerm = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({
        hasCameraRollPermission: camRollPerm.status === 'granted',
      });
    } catch (error) {
      // display the error to the user
      Alert.alert(error);
      console.log({ error });
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>
            Choose how you are going to provide the input image.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={this._pickImage} title="Select Image" />
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={this._takePhoto} title="Take a photo" />
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={this._reset} title="Reset" />
        </View>

        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}

        <StatusBar barStyle="default" />
      </View>
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    const { image } = this.state;

    // if there is no image assigned yet don't render
    if (!image) {
      return;
    }

    return (
      <View style={styles.imageContainer}>
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>

        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          {image}
        </Text>
      </View>
    );
  };

  // share picture via social medias triggered by long press on image URL
  _share = () => {
    Share.share({
      message: `Check out this photo: ${this.state.image}`,
      title: 'Check out this photo!',
      url: this.state.image,
    });
  };

  // copy link URL triggered by press on image URL
  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    Alert.alert('Copied URL to clipboard');
  };

  // remove currently display image
  _reset = () => {
    this.setState({ image: null });
  };

  // take photo with the phone camera
  _takePhoto = async () => {
    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    this._handleImagePicked(pickerResult);
  };

  // choose photo from camera roll
  _pickImage = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    this._handleImagePicked(pickerResult);
  };

  // handle the chosen image
  _handleImagePicked = async (pickerResult) => {
    let uploadResponse; let
      uploadResult;

    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        // set the picture to the state - display it locally
        this.setState({
          image: pickerResult.uri,
        });
      }
    } catch (error) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ error });

      Alert.alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };
}

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 10,
    width: 250,
    borderRadius: 3,
    elevation: 2,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.2,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 5,
  },
  buttonContainer: {
    marginHorizontal: 5,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginHorizontal: 35,
    marginBottom: 15,
  },
  mainText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
});
