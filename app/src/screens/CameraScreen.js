import React from "react";

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
  Alert
} from "react-native";
import { ImagePicker, Permissions, Calendar, Notifications } from "expo";
import { uploadImageAsync } from "../../api/uploadImage";
import { withNavigation } from "react-navigation";

import { _storeData, _retrieveData } from "../helpers/localStorage";

class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      uploading: false,
      calendarEvent: null
    };
  }

  static navigationOptions = {
    headerRight: (
      <Button
        onPress={() =>
          Alert.alert(
            "Dummy Button",
            "I should help to navigate to the created calendar event once an event has been created. Currently, I don't do much. The goal would be to only be active when the user has created an event (i.e. uploaded an image) and then to navigate back to the screen with the calendar event displayed."
          )
        }
        title="To Event"
      />
    )
  };

  async componentDidMount() {
    try {
      // get camera, camera roll and storage permission
      await Permissions.askAsync(Permissions.CAMERA);
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
      await Permissions.askAsync(Permissions.CALENDAR);
      await Permissions.askAsync(Permissions.NOTIFICATIONS);
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
          alignItems: "center",
          justifyContent: "flex-end"
        }}
      >
        <StatusBar barStyle="default" />

        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}

        <View style={styles.textContainer}>
          <Text style={styles.mainText}>
            Choose how you are going to provide the input image.
          </Text>
        </View>

        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Button onPress={this._pickImage} title="Select Image" />
          </View>
        <View style = {styles.headerLeft}>
        <Button onPress={this._addToCalendar} title="Add to Calendar" />
        </View>
          <View style={styles.buttonContainer}>
            <Button onPress={this._takePhoto} title="Take a photo" />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={this._reset} title="Reset" />
          </View>
        </View>
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
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center"
            }
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
            overflow: "hidden"
          }}
        >
          <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />
        </View>

        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 10
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
      title: "Check out this photo!",
      url: this.state.image
    });
  };

  // copy link URL triggered by press on image URL
  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    Alert.alert("Copied URL to clipboard");
  };

  // remove currently display image
  _reset = () => {
    this.setState({ image: null, calendarEvent: null });
  };

  // take photo with the phone camera
  _takePhoto = async () => {
    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1
    });

    this._handleImagePicked(pickerResult);
  };


  



  // choose photo from camera roll
  _pickImage = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1
    });

    this._handleImagePicked(pickerResult);
  };

  // handle the chosen image
  _handleImagePicked = async pickerResult => {
    let uploadResponse;
    let uploadResult;
    let responseJson;

    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        // upload the image to server
        uploadResponse = await uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();

        if (!uploadResult.uploaded) {
          console.log("Uploaded to server failed.");
          this.setState({
            image: null,
            calendarEvent: null
          });
          Alert.alert("Image Upload Failed!", "Uploaded to server failed.");
        } else if (!uploadResult.success) {
          console.log(
            "Uploaded to server successfull but no result from Google Cloud."
          );
          this.setState({
            image: null,
            calendarEvent: null
          });
          Alert.alert(
            "No Feedback from Google Cloud",
            "Uploaded to server successfull but no result from Google Cloud."
          );
        } else {
          // Upload was sucessfull and got result from Google Cloud
          this.setState({
            // set state to URL of upload location
            image: uploadResult.location,
            // set process result of Google Cloud
            calendarEvent: uploadResult
          });

          console.log(this.state.calendarEvent);
          // Currently stores the received event locally
          // TODO: decide what we store and how
          // TODO: forwarding the key: "event" to the Calendar screen
          _storeData("event", uploadResult.calendarEvent).then(
            // navigate to the new screen as last action
            this.props.navigation.navigate("Calendar", {
              photoUri: uploadResult.location,
              eventName: "event"
            })
          );
        }
      }
    } catch (error) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ responseJson });
      console.log({ error });

      Alert.alert("Upload Failed!", error.message);
    } finally {
      this.setState({ uploading: false });
    }
  };
}

export default withNavigation(CameraScreen);

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 10,
    marginBottom: 10,
    width: 300,
    borderRadius: 3,
    elevation: 2,
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.2,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 5
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20
  },
  buttonContainer: {
    marginHorizontal: 5
  },
  textContainer: {
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10
  },
  mainText: {
    fontSize: 16,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  }
});
