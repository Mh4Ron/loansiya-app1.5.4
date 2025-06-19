import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

export default function LoanFormScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { cid, scoreData } = route.params;

  const [loanAmount, setLoanAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [term, setTerm] = useState('');
  const [repaymentMethod, setRepaymentMethod] = useState('Monthly');

  useEffect(() => {
    if (scoreData?.creditScore >= 80) {
      setLoanAmount('100000');
    } else if (scoreData?.creditScore >= 60) {
      setLoanAmount('50000');
    } else {
      setLoanAmount('20000');
    }
  }, [scoreData]);

  const getPurposeRangeText = () => {
    if (purpose === 'Personal') return 'Range: ₱2,000 – ₱20,000';
    if (purpose === 'Business') return 'Range: ₱5,000 – ₱150,000';
    return '';
  };

  const handleSubmit = () => {
    if (!loanAmount || !purpose || !description || !term) {
      Alert.alert('Error', 'Please complete all fields.');
      return;
    }

    const termMonths = parseInt(term);
    if (termMonths < 3 || termMonths > 12) {
      Alert.alert('Invalid Term', 'Loan term must be between 3 and 12 months.');
      return;
    }

    const payload = {
      cid,
      scoreData,
      loanAmount,
      purpose,
      description,
      term: termMonths,
      repaymentMethod,
    };

    console.log('Loan Form Payload:', payload);

    Alert.alert('Submitted', 'Loan request has been recorded.');
    // Optional: navigation.navigate('LoanConfirmation', { payload });
        navigation.navigate('LoanRecommendation', {
        cid,
        scoreData,
        repaymentMethod,
        clientRequestedAmount: parseInt(loanAmount),
        term,
        fullForm: payload,
        });


  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.greeting}>Good day Loan Officer!</Text>
          <Text style={styles.title}>Fill Up Form</Text>
          <Text style={styles.subtitle}>
            Please fill in the loan details below. These will help us customize your loan recommendation.
          </Text>

          <Text style={styles.label}>Loan Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={`₱${loanAmount}`}
            onChangeText={(text) => setLoanAmount(text.replace(/[^0-9]/g, ''))}
          />

          <Text style={styles.label}>Purpose of Loan</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={purpose}
              onValueChange={(itemValue) => setPurpose(itemValue)}
            >
              <Picker.Item label="Select purpose" value="" />
              <Picker.Item label="Personal (₱2K–₱20K)" value="Personal" />
              <Picker.Item label="Business (₱5K–₱150K)" value="Business" />
            </Picker>
          </View>

          {purpose ? (
            <Text style={styles.helperText}>{getPurposeRangeText()}</Text>
          ) : null}

          <Text style={styles.label}>Description of Purpose</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe how the loan will be used"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Loan Term (in months)</Text>
          <TextInput
            style={styles.input}
            placeholder="3–12"
            keyboardType="numeric"
            value={term}
            onChangeText={setTerm}
          />

          <Text style={styles.label}>Repayment Method</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={repaymentMethod}
              onValueChange={(itemValue) => setRepaymentMethod(itemValue)}
            >
              <Picker.Item label="Daily" value="Daily" />
              <Picker.Item label="Weekly" value="Weekly" />
              <Picker.Item label="Monthly" value="Monthly" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#E6F0FF',
    padding: 24,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  helperText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#1E63F0',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
