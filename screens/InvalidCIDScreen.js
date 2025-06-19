import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function InvalidCIDScreen() {
  const navigation = useNavigation();

  const handleRetry = () => {
    navigation.navigate('ClientID');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good day Loan Officer!</Text>

      <Text style={styles.invalidTitle}>Invalid!</Text>

      <View style={styles.circle}>
        <Text style={styles.cross}>✖</Text>
      </View>

      <Text style={styles.invalidCID}>Invalid CID</Text>
      <Text style={styles.message}>
        The Client ID entered is not recognized.{"\n"}Please verify and re-enter.
      </Text>

      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.retryText}>Retry</Text>
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
    padding: 30,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
  },
  invalidTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#D11A2A',
    marginBottom: 10,
  },
  circle: {
    borderWidth: 3,
    borderColor: '#D11A2A',
    borderRadius: 50,
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  cross: {
    fontSize: 40,
    color: '#D11A2A',
  },
  invalidCID: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D11A2A',
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#D11A2A',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
