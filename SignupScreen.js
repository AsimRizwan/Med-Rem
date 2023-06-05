import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (email && password) {
      // Perform signup logic here
      console.log('Signup:', email, password);

      // Reset the input fields
      setEmail('');
      setPassword('');

      // Show a success message or perform any other action
      Alert.alert('Signup Successful', 'You have successfully signed up.');

      // Navigate to the Login screen
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', 'Please enter an email and password.');
    }
  };

  return (
    <View>
      <Text>Signup Screen</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity onPress={handleSignup}>
        <Text>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
