import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ScoringResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { scoreData } = route.params;

  // Destructure values from scoreData
  const {
    cid,
    creditScore: score,
    defaultProbability: probability,
    riskCategory: risk,
    recommendation,
  } = scoreData;

  const getCreditworthiness = () => {
    if (score >= 740) return 'High';
    if (score >= 670) return 'Moderate';
    return 'Low';
  };

  const getPaymentHistoryLabel = () => {
    if (score >= 740) return 'Good';
    if (score >= 670) return 'Fair';
    return 'Poor';
  };

  const handleContinue = () => {
    if (!cid) {
      Alert.alert('Missing CID', 'Cannot proceed without client ID.');
      return;
    }

    navigation.navigate('LoanForm', {
      cid: cid,
      scoreData: scoreData,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Good day Loan Officer!</Text>
      <Text style={styles.processed}>Processed!</Text>

      <Text style={styles.label}>Credit Score</Text>
      <Text style={styles.score}>{score}</Text>

      <Text style={styles.riskHeader}>Risk Assessment</Text>

      <View style={styles.assessment}>
        <View style={styles.row}>
          <Text style={styles.left}>Payment History</Text>
          <Text style={styles.right}>{getPaymentHistoryLabel()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.left}>Default Probability</Text>
          <Text style={styles.right}>{Math.round(probability * 100)}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.left}>Overall Creditworthiness</Text>
          <Text style={styles.right}>{getCreditworthiness()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.left}>Risk Category</Text>
          <Text style={styles.right}>{risk}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.left}>System Recommendation</Text>
          <Text style={styles.right}>{recommendation}</Text>
        </View>
      </View>

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
    padding: 30,
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
  processed: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  score: {
    fontSize: 36,
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  riskHeader: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  assessment: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  left: {
    fontSize: 14,
  },
  right: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#0066FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
