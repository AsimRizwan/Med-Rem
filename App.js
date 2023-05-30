import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
    } else {
      setPasswordError('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medicine Reminder</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        onBlur={validateEmail}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
        onBlur={validatePassword}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={!!emailError || !!passwordError}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        disabled={!!emailError || !!passwordError}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = () => {
  const [medicineName, setMedicineName] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminders, setReminders] = useState([]);

  const handleAddReminder = () => {
    if (medicineName && reminderTime) {
      // Perform necessary logic for adding the reminder
      console.log('Reminder added:', medicineName, reminderTime);

      const newReminder = {
        id: Date.now().toString(),
        medicineName,
        reminderTime,
      };

      setReminders([...reminders, newReminder]);

      // Clear the input fields
      setMedicineName('');
      setReminderTime('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter medicine name"
        value={medicineName}
        onChangeText={(text) => setMedicineName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter reminder time"
        value={reminderTime}
        onChangeText={(text) => setReminderTime(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddReminder}>
        <Text style={styles.buttonText}>Add Reminder</Text>
      </TouchableOpacity>

      <Text style={styles.remindersTitle}>Reminders:</Text>
      {reminders.map((reminder) => (
        <View key={reminder.id} style={styles.reminderItem}>
          <Text>{reminder.medicineName}</Text>
          <Text>{reminder.reminderTime}</Text>
        </View>
      ))}
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Home" component={HomeScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    padding: 8,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  remindersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default App;
