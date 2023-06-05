import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    settingContainer: {
      marginBottom: 16,
    },
    settingTitle: {
      fontSize: 16,
      marginBottom: 8,
    },
    picker: {
      width: 200,
      height: 40,
      backgroundColor: '#e0e0e0',
    },
  });
  
export default SettingsScreen;