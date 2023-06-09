import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Notifications } from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';

const HomeScreen = ({ navigation }) => {
  const [reminders, setReminders] = useState([]);
  const [medicineName, setMedicineName] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track whether the dropdown is open or closed

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const handleProfileButtonPress = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle the dropdown state
  };

  const handleAddReminder = () => {
    if (medicineName && reminderTime) {
      const newReminder = {
        id: Date.now().toString(),
        medicineName,
        reminderTime,
        taken: false,
        missed: false,
      };

      setReminders((prevReminders) => [...prevReminders, newReminder]);

      // Clear the input fields
      setMedicineName('');
      setReminderTime('');
    } else {
      Alert.alert('Error', 'Please enter medicine name and reminder time.');
    }
  };

  const handleDeleteReminder = (id) => {
    setReminders((prevReminders) => prevReminders.filter((reminder) => reminder.id !== id));
  };

  const handleToggleTaken = (id) => {
    setReminders((prevReminders) =>
      prevReminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, taken: !reminder.taken, missed: false }
          : reminder
      )
    );
  };

  const handleToggleMissed = (id) => {
    setReminders((prevReminders) =>
      prevReminders.map((reminder) =>
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

  const handleLogout = () => {
    // Perform logout logic here
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfileButtonPress}>
          <Ionicons name="person-circle-outline" size={24} color="black" />
          {isDropdownOpen && (
            <View style={styles.dropdown}>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => {}}>
                <Text style={styles.dropdownItemText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
                <Text style={styles.dropdownItemText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Enter medicine name"
          value={medicineName}
          onChangeText={(text) => setMedicineName(text)}
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
          {reminders.map((reminder) => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 16,
    paddingTop: 25,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileButton: {
    marginLeft: 'auto',
    marginRight: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 120,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
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
});

export default HomeScreen;
