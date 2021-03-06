import React from "react";

import {
  ActivityIndicator,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  Platform
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { uploadBase64 } from "../../api/uploadImage";
import { withNavigation } from "react-navigation";

// Actionbuttons
import ActionButton from "react-native-action-button";
import { Ionicons } from "@expo/vector-icons";

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
            style={{ height: "100%", width: "100%", resizeMode: "contain" }}
          />
        </View>
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
        // create object to send to server
        pickerResult["lang"] = this.props.settings.scanLanguage;

        // upload the image to server
        uploadResponse = await uploadBase64(
          pickerResult,
          this.props.security.accessToken
        );
        uploadResult = await uploadResponse.json();

        if (!uploadResult.uploaded) {
          console.log(uploadResult.msg);
          Alert.alert("Image Upload Failed!", uploadResult.msg);
        } else if (!uploadResult.success) {
          console.log("Error: Processing Upload!", uploadResult.msg);
          Alert.alert("Error: Processing Upload!", uploadResult.msg);
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

  render() {
    return (
      <View style={styles.mainContainer}>
        <StatusBar barStyle="default" />

        <View style={styles.textContainer}>
          <Text style={styles.mainText}>
            Choose how you are going to provide the input image.
          </Text>
        </View>

        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}

        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Take a picture"
            onPress={this._takePhoto}
          >
            <Ionicons
              name={Platform.OS === "ios" ? "ios-camera" : "md-camera"}
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>

          <ActionButton.Item
            buttonColor="#3498db"
            title="Select an image"
            onPress={this._pickImage}
          >
            <Ionicons
              name={Platform.OS === "ios" ? "ios-image" : "md-image"}
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>

          <ActionButton.Item
            buttonColor="#1abc9c"
            title="Reset Homescreen"
            onPress={this._reset}
          >
            <Ionicons
              name={Platform.OS === "ios" ? "ios-close" : "md-close"}
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { events, security, settings } = state;
  return { events, security, settings };
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
  actionButtonIcon: {
    color: "white",
    fontSize: 20,
    height: 22
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20
  },
  imageContainer: {
    borderRadius: 3,
    height: 475,
    marginBottom: 10,
    marginHorizontal: 5,
    marginTop: 10,
    padding: 5,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: 300
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  mainText: {
    color: "rgba(96,100,109, 1)",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center"
  },
  textContainer: {
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10
  }
});
