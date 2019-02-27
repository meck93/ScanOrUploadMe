import React from 'react';
import { AsyncStorage, Button, Text,  ScrollView, ListView, TextInput, View, StyleSheet, Alert } from 'react-native';
//import Row from './Row';
import Row from '../helpers/Row';




let now = new Date();
let start = new Date(now.setHours(now.getHours() + 1)).toString();
let end = new Date(now.setHours(now.getHours() + 2)).toString();

let calendarEvent = {
    description: 'Guava Peeling Party',
    id: 1234,
    picUri:"https://t2.rbxcdn.com/34e222a0bf98d0a46de65de2ece139eb",
    summary:
        'Hi John\nI would like to invite you to my birthday party!\nBest James',
    location: 'Klostergatan, Uppsala, Sweden',
    startTime: start,
    endTime: end,
    reminders: {
        overrides: [{ method: 'popup', minutes: 15 }],
        useDefault: false
    },
    updated: Date()
};

let calendarEvent2 = {
    description: 'Puppy Petting Party',
    id: 5555,
    picUri:"https://t2.rbxcdn.com/34e222a0bf98d0a46de65de2ece139eb",
    summary:
        'Hi John\nI would like to invite you to my Puppy Petting Party!\nBest James',
    location: 'Klostergatan, Uppsala, Sweden',
    startTime: start,
    endTime: end,
    reminders: {
        overrides: [{ method: 'popup', minutes: 15 }],
        useDefault: false
    },
    updated: Date()
};

export default class SavedEventsScreen extends React.Component {
    static navigationOptions = {
        title: 'Events',
    };
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            summary: "",
            description: "",
            location: "",
            startTime: "",
            endTime: ""
        };

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([calendarEvent.description, calendarEvent2.description, calendarEvent.description]),
        };
    }

    render() {
        return (


            <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(data) => <View><Text>{data}</Text></View>}
        />

    );
    }
    //USE code in comment below to add button to retrieve local data
    /*<View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <Button onPress={this._retrieveEvent} title="Retrieve" />
                    </View>
                </View>*/
    _retrieveEvent = async () =>{
        try { //userId
            let key='userId';
            const value = await AsyncStorage.getItem(key);
            console.log('RETRIEVED: '+value);
            return value;
        } catch (error) {
            // Error retrieving data
            console.log({ error });
            console.error(error);
        }
    }

}

const styles = StyleSheet.create({
    buttonContainer: {
        marginHorizontal: 5,
        padding: 20,
    },
    container: {
        backgroundColor: '#fff',
        flex: 1,
        marginTop: 20,
        padding: 20,
        paddingTop: 20,
    },
    photo: {
        borderRadius: 20,
        height: 40,
        width: 40,

    },
    text: {
        fontSize: 16,
        marginLeft: 12,

    },

});
