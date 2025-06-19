import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function LoanAgreementScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    cid,
    borrowerRequest,
    interestRate,
    repaymentMethod,
    term,
    fullForm,
    recommendedAmount, // added
  } = route.params;

  const loanAmount = parseFloat(borrowerRequest);
  const interestDecimal = interestRate / 100;
  const totalLoanWithInterest = loanAmount + loanAmount * interestDecimal;

  let totalPayments = term;
  if (repaymentMethod === 'Weekly') totalPayments = term * 4;
  else if (repaymentMethod === 'Daily') totalPayments = term * 30;

  const amountDue = (totalLoanWithInterest / totalPayments).toFixed(2);

const handleSign = async () => {
  const timestamp = new Date().toISOString(); // e.g., 2025-06-15T12:45:00.000Z
  const safeTimestamp = timestamp.replace(/[:.]/g, '-');

  const agreementData = {
    cid,
    borrowerRequest,
    interestRate,
    repaymentMethod,
    term,
    amountDue,
    signedAt: timestamp,
    recommendedAmount,
  };

  try {
    // Upload application form
    await fetch(`http://192.168.254.141:5602/api/uploads/${cid}/application`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullForm),
    });

    // Upload agreement metadata
    await fetch(`http://192.168.254.141:5602/api/uploads/${cid}/agreement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agreementData),
    });

    // ✅ After successful uploads, navigate to signature
navigation.navigate('SignatureAgreementScreen', {
  clientData: {
    cid,
    name: fullForm?.name || 'Unknown',
    date: new Date().toLocaleDateString(),
    fullForm,
    recommendedAmount,
  },
});

  } catch (error) {
    console.error('Upload error:', error);
    Alert.alert('❌ Upload Failed', 'Please check your internet or API.');
  }
};



  const handleCancel = () => {
    Alert.alert('Loan Cancelled', 'The loan has been cancelled.');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.greeting}>Good day Loan Officer!</Text>
        <Text style={styles.title}>Loan Agreement</Text>
        <Text style={styles.subtitle}>Please review and sign the loan agreement</Text>

        <Text style={styles.label}>Loan Amount</Text>
        <Text style={styles.value}>₱{loanAmount.toLocaleString()}</Text>

        <Text style={styles.label}>Interest Rate</Text>
        <Text style={styles.value}>{interestRate}%</Text>

        <Text style={styles.label}>Repayment</Text>
        <Text style={styles.value}>{repaymentMethod}</Text>

        <Text style={styles.label}>Loan Term</Text>
        <Text style={styles.value}>{term} months</Text>

        <Text style={styles.label}>Amount Due ({repaymentMethod})</Text>
        <Text style={styles.value}>₱{amountDue}</Text>

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSign}>
          <Text style={styles.buttonText}>Sign Agreement</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonDanger} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel Loan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPrimary: {
    backgroundColor: '#1E63F0',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonDanger: {
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
