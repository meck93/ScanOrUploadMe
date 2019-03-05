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
import { ImagePicker, Permissions } from "expo";
import { uploadBase64 } from "../../api/uploadImage";
import { withNavigation } from "react-navigation";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addEvent, setCurrentEvent } from "../actions/eventActions";

class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      uploading: false,
      calendarEvent: null
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Button
          title="To Event"
          onPress={navigation.getParam("calEventNavigation")}
        />
      )
    };
  };

  async componentDidMount() {
    try {
      // get camera, camera roll and storage permission
      await Permissions.askAsync(Permissions.CAMERA);
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
      await Permissions.askAsync(Permissions.CALENDAR);
      await Permissions.askAsync(Permissions.NOTIFICATIONS);

      // static navigation buttons
      this.props.navigation.setParams({
        calEventNavigation: this._navigateToCalendarEventScreen
      });
    } catch (error) {
      // display the error to the user
      Alert.alert(error);
      console.log({ error });
    }
  }

  _navigateToCalendarEventScreen = () => {
    this.props.navigation.navigate("Calendar");
  };

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
          <Image
            source={{ uri: image }}
            style={{ height: "90%", width: "100%", resizeMode: "contain" }}
          />
        </View>

        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingTop: 5 }}
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
      quality: 1,
      base64: true
    });

    this._handleImagePickedBase64(pickerResult);
  };

  // choose photo from camera roll
  _pickImage = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      base64: true
    });

    this._handleImagePickedBase64(pickerResult);
  };

  _handleImagePickedBase64 = async pickerResult => {
    let uploadResponse;
    let uploadResult;
    let responseJson;

    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        // upload the image to server
        uploadResponse = await uploadBase64(pickerResult);
        uploadResult = await uploadResponse.json();

        if (!uploadResult.uploaded) {
          console.log("Uploaded to server failed.");
          Alert.alert("Image Upload Failed!", "Uploaded to server failed.");
        } else if (!uploadResult.success) {
          console.log(
            "Uploaded to server successfull but no result from Google Cloud."
          );
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

          // add the local URI of the image to the event
          let event = uploadResult.calendarEvent;
          event.uri = uploadResult.location;

          // the event to the global event store
          this.props.addEvent(event);

          // set the event as the current event
          this.props.setCurrentEvent(uploadResult.calendarEvent.id);

          // navigate to the calendarEvent screen
          this.props.navigation.navigate("Calendar");
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

const mapStateToProps = state => {
  const { events } = state;
  return { events };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addEvent,
      setCurrentEvent
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(CameraScreen));

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    width: 300,
    height: 500,
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
    marginBottom: 5,
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
