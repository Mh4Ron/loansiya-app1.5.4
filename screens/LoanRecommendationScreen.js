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
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';


export default function LoanRecommendationScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    cid,
    scoreData,
    repaymentMethod = 'Monthly',
    clientRequestedAmount,
    term,
    fullForm,
  } = route.params;

  const [recommendedAmount, setRecommendedAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [borrowerRequest, setBorrowerRequest] = useState('');

  // 🧠 Dynamic interest rate calculation
const calculateInterestRate = (method, termMonths) => {
  const annualRate = 28;

  if (method === 'Monthly') {
    return parseFloat((annualRate / 12).toFixed(2)); // ≈2.33%
  }

  const proportion = termMonths / 12;
  return parseFloat((annualRate * proportion).toFixed(2)); // 7% for 3 mo, etc.
};



  useEffect(() => {
    const score = scoreData.creditScore;

    // Set recommended amount
    let amount = 20000;
    if (score >= 740) amount = 100000;
    else if (score >= 670) amount = 75000;
    else amount = 50000;
    setRecommendedAmount(amount);

    // Cap request to recommendation
    const cappedRequest = Math.min(clientRequestedAmount || 0, amount);
    setBorrowerRequest(String(cappedRequest));

    // Compute interest
        const rate = calculateInterestRate(repaymentMethod, parseInt(term));
    setInterestRate(rate);
  }, [scoreData, clientRequestedAmount, repaymentMethod, term]);

  const handleApprove = () => {
    const requested = parseInt(borrowerRequest);
    if (isNaN(requested) || requested > recommendedAmount) {
      Alert.alert('Invalid Request', `Requested amount must not exceed ₱${recommendedAmount}.`);
      return;
    }

    const payload = {
      cid,
      recommendedAmount,
      borrowerRequest: requested,
      interestRate,
      repaymentMethod,
      term,
    };

    console.log('Final Approval Payload:', payload);
    Alert.alert('Loan Approved', `Approved for ₱${requested}`);
    // Optionally: navigation.navigate('FinalScreen', { payload });
    navigation.navigate('LoanAgreement', {
    cid,
    borrowerRequest,
    interestRate,
    repaymentMethod,
    term,
    fullForm,
    recommendedAmount,
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
        <Text style={styles.title}>Recommendation</Text>
        <Text style={styles.subtitle}>
          Based on the borrower’s profile the following loan terms are recommended
        </Text>

        <Text style={styles.label}>Recommended Loan Amount</Text>
        <Text style={styles.value}>₱{recommendedAmount.toLocaleString()}</Text>

        <Text style={styles.label}>Interest Rate</Text>
        <Text style={styles.value}>{interestRate.toFixed(2)}%</Text>

        <Text style={styles.label}>Repayment Method</Text>
        <Text style={styles.value}>{repaymentMethod}</Text>

        <Text style={styles.label}>Loan Term</Text>
        <Text style={styles.value}>{term} months</Text>

        <Text style={styles.label}>Borrower Request</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={borrowerRequest}
            onChangeText={(text) => {
              const numeric = text.replace(/[^0-9]/g, '');
              if (parseInt(numeric || 0) <= recommendedAmount) {
                setBorrowerRequest(numeric);
              }
            }}
          />
          <Feather name="edit" size={20} color="#555" style={styles.icon} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleApprove}>
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F0FF',
    padding: 24,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  icon: {
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#1E63F0',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  scrollContainer: {
  flexGrow: 1,
  justifyContent: 'center',
},

});
