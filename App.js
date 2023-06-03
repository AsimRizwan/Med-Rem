import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Notifications } from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';

const Drawer = createDrawerNavigator();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Perform login logic here
    console.log('Login:', email, password);

    // Reset the input fields
    setEmail('');
    setPassword('');

    // Navigate to the Home screen
    navigation.navigate('Home');
  };

  const handleSignUp = () => {
    // Perform sign-up logic here
    console.log('Sign Up:', email, password);

    // Reset the input fields
    setEmail('');
    setPassword('');

    // Navigate to the Home screen
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medicine Reminder</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [medicineName, setMedicineName] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const handleAddReminder = () => {
    if (medicineName && reminderTime) {
      const newReminder = {
        id: Date.now().toString(),
        medicineName,
        reminderTime,
        taken: false,
        missed: false,
      };

      setReminders(prevReminders => [...prevReminders, newReminder]);

      // Clear the input fields
      setMedicineName('');
      setReminderTime('');
    } else {
      Alert.alert('Error', 'Please enter medicine name and reminder time.');
    }
  };

  const handleDeleteReminder = (id) => {
    setReminders(prevReminders => prevReminders.filter(reminder => reminder.id !== id));
  };

  const handleToggleTaken = (id) => {
    setReminders(prevReminders =>
      prevReminders.map(reminder =>
        reminder.id === id
          ? { ...reminder, taken: !reminder.taken, missed: false }
          : reminder
      )
    );
  };

  const handleToggleMissed = (id) => {
    setReminders(prevReminders =>
      prevReminders.map(reminder =>
        reminder.id === id
          ? { ...reminder, missed: !reminder.missed, taken: false }
          : reminder
      )
    );
  };

  const scheduleNotification = async (reminder) => {
    const trigger = new Date(reminder.reminderTime);
    const message = `Reminder: Take ${reminder.medicineName}`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Medicine Reminder',
        body: message,
        sound: 'default',
        vibrate: true,
      },
      trigger,
    });
  };

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        // Permissions not granted, handle accordingly
      }
    }
  };


  const handleTimePicker = (event, selectedTime) => {
    setShowTimePicker(false);

    if (selectedTime) {
      const timeString = moment(selectedTime).format('hh:mm A');
      setReminderTime(timeString);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Home</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter medicine name"
          value={medicineName}
          onChangeText={text => setMedicineName(text)}
        />

        <View style={styles.timePickerContainer}>
          <Text style={styles.label}>Reminder Time:</Text>
          <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.timePickerButtonText}>{reminderTime || 'Select time'}</Text>
          </TouchableOpacity>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={reminderTime ? moment(reminderTime, 'hh:mm A').toDate() : new Date()}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimePicker}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleAddReminder}>
          <Text style={styles.buttonText}>Add Reminder</Text>
        </TouchableOpacity>

        <View style={styles.remindersContainer}>
          <Text style={styles.remindersTitle}>Reminders:</Text>
          {reminders.map(reminder => (
            <View key={reminder.id} style={styles.reminderItem}>
              <Text style={styles.reminderText}>{`${reminder.medicineName} at ${reminder.reminderTime}`}</Text>
              <View style={styles.reminderButtons}>
                <TouchableOpacity
                  style={[
                    styles.reminderButton,
                    reminder.taken && styles.reminderButtonActive,
                  ]}
                  onPress={() => handleToggleTaken(reminder.id)}
                >
                  <Text style={styles.reminderButtonText}>Taken</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.reminderButton,
                    reminder.missed && styles.reminderButtonActive,
                  ]}
                  onPress={() => handleToggleMissed(reminder.id)}
                >
                  <Text style={styles.reminderButtonText}>Missed</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteReminder(reminder.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// Define the SettingsScreen component
const SettingsScreen = () => {
  // State for the selected ringtone
  const [selectedRingtone, setSelectedRingtone] = useState('');

  // State for the delay time
  const [delayTime, setDelayTime] = useState(0);

  // State for the selected time format
  const [selectedTimeFormat, setSelectedTimeFormat] = useState('');

  // State for the selected theme
  const [selectedTheme, setSelectedTheme] = useState('');

  // List of available ringtones
  const ringtones = ['Ringtone 1', 'Ringtone 2', 'Ringtone 3'];

  // List of available time formats
  const timeFormats = ['12-hour', '24-hour'];

  // List of available themes
  const themes = ['Theme 1', 'Theme 2', 'Theme 3'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Ringtone Setting */}
      <View style={styles.settingContainer}>
        <Text style={styles.settingTitle}>Ringtone</Text>
        <Picker
          selectedValue={selectedRingtone}
          onValueChange={itemValue => setSelectedRingtone(itemValue)}
          style={styles.picker}
        >
          {ringtones.map(ringtone => (
            <Picker.Item key={ringtone} label={ringtone} value={ringtone} />
          ))}
        </Picker>
      </View>

      {/* Delay Time Setting */}
      <View style={styles.settingContainer}>
        <Text style={styles.settingTitle}>Delay Time (in seconds)</Text>
        <Picker
          selectedValue={delayTime.toString()}
          onValueChange={itemValue => setDelayTime(parseInt(itemValue, 10))}
          style={styles.picker}
        >
          {[0, 5, 10, 15].map(delay => (
            <Picker.Item key={delay} label={delay.toString()} value={delay.toString()} />
          ))}
        </Picker>
      </View>

      {/* Time Format Setting */}
      <View style={styles.settingContainer}>
        <Text style={styles.settingTitle}>Time Format</Text>
        <Picker
          selectedValue={selectedTimeFormat}
          onValueChange={itemValue => setSelectedTimeFormat(itemValue)}
          style={styles.picker}
        >
          {timeFormats.map(format => (
            <Picker.Item key={format} label={format} value={format} />
          ))}
        </Picker>
      </View>

      {/* Theme Setting */}
      <View style={styles.settingContainer}>
        <Text style={styles.settingTitle}>Theme</Text>
        <Picker
          selectedValue={selectedTheme}
          onValueChange={itemValue => setSelectedTheme(itemValue)}
          style={styles.picker}
        >
          {themes.map(theme => (
            <Picker.Item key={theme} label={theme} value={theme} />
          ))}
        </Picker>
      </View>
    </View>
  );
};


const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Login">
        <Drawer.Screen
          name="Login"
          component={LoginScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 16,
    paddingTop: 25,
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    padding: 8,
    borderRadius: 5,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    flex: 1,
    marginRight: 16,
  },
  timePickerButton: {
    flex: 2,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  timePickerButtonText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '50%',
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  remindersContainer: {
    marginTop: 24,
  },
  remindersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderText: {
    flex: 1,
    fontSize: 16,
  },
  reminderButtons: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reminderButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    marginRight: 8,
  },
  reminderButtonActive: {
    backgroundColor: 'green',
  },
  reminderButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
settingContainer: {
  marginBottom: 24,
},
settingTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 8,
},
picker: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 4,
  paddingHorizontal: 8,
  paddingVertical: 4,
},
});

export default App;
