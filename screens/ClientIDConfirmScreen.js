import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ClientIDConfirmScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // 🔁 Get clientID passed from the previous screen
  const clientID = route.params?.clientID;

  const handleYes = () => {
    // 🔁 Pass it forward to ClientProfile
    navigation.navigate('ClientProfile', { clientID });
  };

  const handleNo = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.backArrow} onPress={handleNo}>←</Text>

      <Text style={styles.greeting}>Good day Loan Officer!</Text>
      <Text style={styles.title}>Correct Client ID?</Text>

      <View style={styles.inputBox}>
        <Text style={styles.inputText}>{clientID || 'No ID Provided'}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonGray} onPress={handleNo}>
          <Text style={styles.buttonTextBlack}>No</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonBlue} onPress={handleYes}>
          <Text style={styles.buttonTextWhite}>Yes</Text>
        </TouchableOpacity>
      </View>
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
  backArrow: {
    position: 'absolute',
    top: 60,
    left: 20,
    fontSize: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: -20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  inputBox: {
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 30,
  },
  inputText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  buttonGray: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonBlue: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonTextWhite: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextBlack: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
