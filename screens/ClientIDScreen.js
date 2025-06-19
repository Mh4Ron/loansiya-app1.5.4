import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ClientIDScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const officerName = route.params?.officerName || 'Loan Officer';
  const [clientID, setClientID] = useState('');

  const handleContinue = async () => {
    if (!clientID.trim()) {
      alert('Please enter a Client ID.');
      return;
    }

    try {
      const res = await fetch(`http://192.168.254.141:5600/client/${clientID.trim()}`);
      if (res.ok) {
        navigation.navigate('ClientIDConfirm', { clientID: clientID.trim() });
      } else {
        navigation.navigate('InvalidCID');
      }
    } catch (err) {
      console.error('❌ Failed to validate client ID:', err);
      alert('Server error. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconPlaceholder}>
        <Text style={styles.iconText}>🛡️</Text>
      </View>

      <Text style={styles.greeting}>Good day {officerName}!</Text>
      <Text style={styles.title}>Enter Client ID</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Client ID"
        placeholderTextColor="#333"
        value={clientID}
        onChangeText={setClientID}
      />

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconPlaceholder: {
    position: 'absolute',
    top: 70,
    right: 30,
  },
  iconText: {
    fontSize: 28,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: -30,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
