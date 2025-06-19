import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function UploadDocumentsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { cid, clientInput } = route.params;

  const [validId, setValidId] = useState(false);
  const [orcr, setOrcr] = useState(false);
  const [landTitle, setLandTitle] = useState(false);
  const [deed, setDeed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});

  const clientName = clientInput?.name || 'Unknown';

  const uploadFileToBackend = async (docKey, docName) => {
    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!picked || picked.canceled || !picked.assets || picked.assets.length === 0) {
        Alert.alert('Cancelled', 'No file selected.');
        return;
      }

      const file = picked.assets[0];
      const formData = new FormData();
      formData.append('document', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
      });
      formData.append('cid', cid);
      formData.append('fileType', docKey);

      const res = await fetch('http://192.168.254.141:4000/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const json = await res.json();

      if (json.success) {
        setUploadedFiles((prev) => ({ ...prev, [docKey]: file.name }));
        Alert.alert(`${docName} Uploaded ✅`, json.fileUrl);
      } else {
        Alert.alert('❌ Upload Failed', json.error);
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('⚠️ Upload Error', error.message);
    }
  };

  const handleApprove = async () => {
    if (!validId || !uploadedFiles.validId) {
      Alert.alert('Missing Required Document', 'Please upload and check the Valid ID.');
      return;
    }

    try {
      navigation.navigate('ScoringProcessing', { cid });
    } catch (error) {
      console.error('❌ Scoring pipeline error:', error);
      Alert.alert('⚠️ Unexpected Error', error.message);
    }
  };

  const handleDecline = () => {
    Alert.alert('Declined ❌', 'Loan application declined.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.backArrow} onPress={() => navigation.goBack()}>←</Text>
      <Text style={styles.greeting}>Good day Loan Officer!</Text>
      <Text style={styles.title}>Document Collection</Text>
      <Text style={styles.subText}>Check required documents to proceed with the loan application</Text>

      <View style={styles.checkboxRow}>
        <Checkbox value={validId} onValueChange={setValidId} />
        <Text style={styles.checkboxLabel}>Valid ID</Text>
      </View>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => uploadFileToBackend('validId', 'Valid ID')}
      >
        <Text style={styles.uploadText}>
          {uploadedFiles.validId || '+ Upload Valid ID'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.collateralHeader}>Collateral Documents (₱100K - ₱500K)</Text>

      <View style={styles.checkboxRow}>
        <Checkbox value={orcr} onValueChange={setOrcr} />
        <Text style={styles.checkboxLabel}>ORCR</Text>
      </View>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => uploadFileToBackend('orcr', 'ORCR')}
      >
        <Text style={styles.uploadText}>
          {uploadedFiles.orcr || '+ Upload ORCR'}
        </Text>
      </TouchableOpacity>

      <View style={styles.checkboxRow}>
        <Checkbox value={landTitle} onValueChange={setLandTitle} />
        <Text style={styles.checkboxLabel}>Land Title</Text>
      </View>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => uploadFileToBackend('landTitle', 'Land Title')}
      >
        <Text style={styles.uploadText}>
          {uploadedFiles.landTitle || '+ Upload Land Title'}
        </Text>
      </TouchableOpacity>

      <View style={styles.checkboxRow}>
        <Checkbox value={deed} onValueChange={setDeed} />
        <Text style={styles.checkboxLabel}>Deed of Assignment</Text>
      </View>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => uploadFileToBackend('deed', 'Deed of Assignment')}
      >
        <Text style={styles.uploadText}>
          {uploadedFiles.deed || '+ Upload Deed of Assignment'}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.declineBtn} onPress={handleDecline}>
          <Text style={styles.buttonText}>DECLINE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.approveBtn, (!validId || !uploadedFiles.validId) && { opacity: 0.5 }]}
          disabled={!validId || !uploadedFiles.validId}
          onPress={handleApprove}
        >
          <Text style={styles.buttonText}>APPROVE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#E6F0FF',
    flexGrow: 1,
  },
  backArrow: { fontSize: 24, marginBottom: 10 },
  greeting: { fontSize: 22, fontWeight: '500', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 5 },
  subText: { fontSize: 14, marginBottom: 15 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkboxLabel: { fontSize: 16, marginLeft: 10 },
  collateralHeader: { fontWeight: '700', fontSize: 15, marginVertical: 15 },
  uploadButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  uploadText: { color: '#333', fontWeight: '500' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  declineBtn: {
    backgroundColor: '#D11A2A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: '#28A745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
