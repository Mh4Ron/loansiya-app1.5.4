import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ClientProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const clientID = route.params?.clientID;

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientDataFromGCS = async (cid) => {
      try {
        const response = await fetch(`http://192.168.254.141:5600/client/${cid}`);
        if (!response.ok) throw new Error('Failed to fetch client data');
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error('❌ Error fetching from GCS:', error);
      } finally {
        setLoading(false);
      }
    };

    if (clientID) fetchClientDataFromGCS(clientID);
  }, [clientID]);

  const handleProceed = () => {
    if (client?.loanBalance?.amount > 0) {
      alert('Client still has an active loan. Cannot proceed with a new loan.');
      return;
    }

    navigation.navigate('UploadDocuments', {
      cid: client?.cid,
      clientInput: client,
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text>Loading client data...</Text>
      </View>
    );
  }

  if (!client) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Client not found.</Text>
        <TouchableOpacity style={styles.yesButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.backArrow} onPress={() => navigation.goBack()}>←</Text>
      <Text style={styles.greeting}>Good day Loan Officer!</Text>

      {/* Personal Details */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Client Profile</Text>
        <Text style={styles.subTitle}>Personal Details</Text>
        <Text><Text style={styles.bold}>Name:</Text> {client?.name || 'N/A'}</Text>
        <Text><Text style={styles.bold}>Age:</Text> {client?.age || 'N/A'}</Text>
        <Text><Text style={styles.bold}>CID:</Text> {client?.cid || 'N/A'}</Text>
        <Text><Text style={styles.bold}>Email:</Text> {client?.email || 'N/A'}</Text>
        <Text><Text style={styles.bold}>Number:</Text> {client?.number || 'N/A'}</Text>
        <Text><Text style={styles.bold}>Address:</Text> {client?.address || 'N/A'}</Text>
      </View>

      {/* Financial Record */}
      <Text style={styles.sectionTitle}>Financial Record</Text>
      <Text>
        Monthly Income: ₱
        {client?.financial?.monthlyIncome
          ? client.financial.monthlyIncome.toLocaleString()
          : 'N/A'}
      </Text>
      <Text>
        Monthly Expenses: ₱
        {client?.financial?.monthlyExpenses
          ? client.financial.monthlyExpenses.toLocaleString()
          : 'N/A'}
      </Text>
      <Text>
        Saving and Assets: ₱
        {client?.financial?.assets
          ? client.financial.assets.toLocaleString()
          : 'N/A'}
      </Text>
      <Text>
        Debt to Income Ratio: 
        {client?.financial?.dti != null ? ` %${client.financial.dti}` : 'N/A'}
      </Text>

      {/* Employment Info */}
      <Text style={styles.sectionTitle}>Employment or Business Info</Text>
      <Text>{client?.employer || 'N/A'}</Text>
      <Text>{client?.position || 'N/A'}</Text>

      {/* Loan Application */}
      <Text style={styles.sectionTitle}>Loan Application</Text>
      <Text>
        <Text style={styles.bold}>Approved Loan:</Text> ₱
        {client?.loans?.approved?.amount
          ? client.loans.approved.amount.toLocaleString()
          : '0'} - {client?.loans?.approved?.status || 'N/A'}
      </Text>
      <Text>
        <Text style={styles.bold}>Pending Loan:</Text> ₱
        {client?.loans?.pending?.amount
          ? client.loans.pending.amount.toLocaleString()
          : '0'} - {client?.loans?.pending?.status || 'N/A'}
      </Text>

      {/* Loan Balance */}
      <Text style={styles.sectionTitle}>Loan Balance</Text>
      <Text>
        ₱
        {client?.loanBalance?.amount
          ? client.loanBalance.amount.toLocaleString()
          : '0'}
      </Text>
      <Text>Due Date: {client?.loanBalance?.dueDate || 'N/A'}</Text>

      {/* Loan History */}
      <Text style={styles.sectionTitle}>Loan History</Text>
      {client?.loans?.loanHistory?.length > 0 ? (
        client.loans.loanHistory.map((entry, index) => (
          <View key={index} style={styles.historyItem}>
            <Text>Amount: ₱{entry.amount.toLocaleString()}</Text>
            <Text>Status: {entry.status}</Text>
            <Text>Purpose: {entry.purpose}</Text>
            <Text>Applied: {entry.dateApplied}</Text>
            <Text>Due Date: {entry.dueDate || 'N/A'}</Text>
            <Text>Paid: {entry.paid ? 'Yes' : 'No'}</Text>
          </View>
        ))
      ) : (
        <Text style={{ fontStyle: 'italic' }}>No loan history found.</Text>
      )}

      <TouchableOpacity style={styles.yesButton} onPress={handleProceed}>
        <Text style={styles.buttonText}>Yes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6F0FF',
    padding: 25,
    flexGrow: 1,
  },
  backArrow: {
    fontSize: 24,
    marginBottom: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  bold: {
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 1,
  },
  yesButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginBottom: 15,
  },
});
