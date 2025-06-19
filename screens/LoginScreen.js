import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 NEW
  const navigation = useNavigation();
  const handleLogin = () => {
      if (!email || !password) {
    alert('Please enter email and password');
    return;
    }

    // Simulate a successful login
    navigation.navigate('ClientID', { officerName: email.split('@')[0] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good day Loan Officer!</Text>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#333"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <View style={styles.inputWrapper}>
  <TextInput
    style={styles.input}
    placeholder="Password"
    placeholderTextColor="#333"
    secureTextEntry={!showPassword}
    value={password}
    onChangeText={setPassword}
  />
  <TouchableOpacity
    onPress={() => setShowPassword((prev) => !prev)}
    style={styles.showToggle}
  >
    <Text style={styles.showText}>{showPassword ? 'Hide' : 'Show'}</Text>
  </TouchableOpacity>
</View>


      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
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
  greeting: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 10,
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
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  showButton: {
    marginLeft: 10,
  },
  showText: {
    color: '#0066FF',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  forgot: {
    color: '#000',
    fontSize: 14,
    marginTop: 10,
  },
  inputWrapper: {
  width: '100%',
  position: 'relative',
  marginBottom: 15,
},
showToggle: {
  position: 'absolute',
  right: 15,
  top: 15,
},
showText: {
  color: '#0066FF',
  fontWeight: '600',
},

});
