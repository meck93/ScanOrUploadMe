import React from 'react';
import { Text, View, StyleSheet, Picker, Platform, Alert, Button } from 'react-native';
import { withNavigation } from 'react-navigation';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';

import { testBackendAPI, getAccessToken } from '../../api/authorise';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setDefaultCalendar } from '../actions/calendarActions';
import { setDefaultScanLanguage } from '../actions/settingsActions';
import { setTokens, clearTokens } from '../actions/securityActions';

export class PreferencesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authorizationMessage: null,
            calendarEvent: null,
            calendars: [],
            data: [{ name: 'English', value: 'EN', id: 1 }, { name: 'Swedish', value: 'SE', id: 2 }]
        };
    }

    async componentDidMount() {
        // check the necessary permissions
        this._checkPermissions()
            .then(permission => {
                if (permission) {
                    // retrieve all local calendars which are modifiable
                    this._findCalendars();
                } else {
                    Alert.alert(
                        'Permission Error',
                        'We could not retrieve the local calendars because we\'re missing the necessary permissions to access the local calendars.'
                    );
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    _checkPermissions = async () => {
        let permission = false;

        // check the calendar permission
        const calendarResponse = await Permissions.askAsync(Permissions.CALENDAR);
        permission = calendarResponse.status === 'granted';

        // check the reminder calendars on ios
        if (Platform.OS === 'ios') {
            const reminderResponse = await Permissions.askAsync(Permissions.REMINDERS);
            permission = reminderResponse.status === 'granted';
        }

        return permission;
    };

    _findCalendars = async () => {
        // retrieve all event calendars
        const eventCalendars = await Calendar.getCalendarsAsync('event');

        // on ios, also retrieve all reminder calendars
        const reminderCalendars = Platform.OS === 'ios' ? await Calendar.getCalendarsAsync('reminder') : [];
        const calendars = [...eventCalendars, ...reminderCalendars];

        // filter out non-modifiable calendars
        const modifiableCalendars = calendars.filter(calendar => calendar.allowsModifications);

        this.setState({ calendars: modifiableCalendars });
    };

    _authorizeAPI = async () => {
        const tokens = await getAccessToken();
        this.props.setTokens(tokens);
    };

    _clearToken = () => {
        if (this.props.security.accessToken) {
            this.props.clearTokens();
            this.setState({ authorizationMessage: null });
        }
    };

    _testAPI = async () => {
        if (!this.props.security.accessToken) {
            Alert.alert('No access token - authorize first!');
            return;
        }
        const reply = await testBackendAPI(this.props.security.accessToken);
        this.setState({ authorizationMessage: reply._bodyText });
        console.log(this.props.security);
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.defaultSettingContainer}>
                    <Text style={styles.textContainer}>
                        ID of the selected Calendar ID: {this.props.calendar.activeCalendarId}
                    </Text>

                    <Picker
                        style={styles.pickerContainer}
                        selectedValue={this.props.calendar.activeCalendarId}
                        onValueChange={itemValue => this.props.setDefaultCalendar(itemValue)}
                    >
                        {this.state.calendars.length ? (
                            this.state.calendars.map(calendar => (
                                <Picker.Item label={calendar.title} value={calendar.id} key={calendar.id} />
                            ))
                        ) : (
                            <Picker.Item label="Error: No Permission to access the calendars" value={1} />
                        )}
                    </Picker>
                </View>

                <View style={styles.defaultSettingContainer}>
                    <Text style={styles.textContainer}>Default Scan Language: {this.props.settings.scanLanguage}</Text>

                    <Picker
                        style={styles.pickerContainer}
                        selectedValue={this.props.settings.scanLanguage}
                        onValueChange={itemValue => {
                            this.props.setDefaultScanLanguage(itemValue);
                        }}
                    >
                        <Picker.Item label="English" value="EN" />
                        <Picker.Item label="Swedish" value="SE" />
                        <Picker.Item label="German" value="DE" />
                    </Picker>
                </View>

                <View style={styles.defaultSettingContainer}>
                    <Text style={styles.textContainer}>
                        Authorization: Authorize yourself in order to use our backend services!
                    </Text>
                    <Button title="Authorize" onPress={this._authorizeAPI} />
                    <Text>Access Token: {this.props.security.accessToken}</Text>
                    <Button title="Test Backend" onPress={this._testAPI} />
                    <Text>Authorization Message: {this.state.authorizationMessage}</Text>
                    <Button title="Clear Access Token" onPress={this._clearToken} />
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { calendar, security, settings } = state;
    return { calendar, security, settings };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            setDefaultCalendar,
            setDefaultScanLanguage,
            setTokens,
            clearTokens
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(PreferencesScreen));

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        flexDirection: 'column'
    },
    defaultSettingContainer: {
        alignItems: 'flex-start',
        borderColor: '#d6d7da',
        borderRadius: 4,
        borderWidth: 0.5,
        display: 'flex',
        flexDirection: 'column',
        marginTop: 5,
        padding: 5,
        width: '100%'
    },
    dropDownContainer: {
        borderRadius: 4,
        borderWidth: 0.5,
        padding: 8
    },
    dropDownText: {
        fontSize: 20,
        margin: 8
    },
    pickerContainer: {
        height: 50,
        width: 150
    },
    subContainer: {
        margin: 8
    }
});
