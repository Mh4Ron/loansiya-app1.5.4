import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import SignatureScreen from 'react-native-signature-canvas';

export default function SignatureAgreementScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { clientData } = route.params;

  const signatureRef = useRef(null);
  const [signature, setSignature] = useState(null);

  // Called when signature is captured (base64 PNG)
  const handleOK = (sig) => {
    setSignature(sig);
    Alert.alert('✅ Signature Captured', 'You can now confirm to generate the signed agreement.');
  };

  // Called when drawing ends, triggers capture
  const handleEnd = () => {
    signatureRef.current?.readSignature();
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setSignature(null);
  };

  const handleConfirm = () => {
    if (!signature) {
      Alert.alert('❌ Missing Signature', 'Please sign before confirming.');
      return;
    }

    // Navigate to SignedAgreementPreview screen
    navigation.navigate('SignedAgreementPreview', {
      clientData,
      signatureBase64: signature,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#E6F0FF' }}>
      <Text style={styles.title}>Client Signature</Text>

      <View style={styles.signatureContainer}>
        <SignatureScreen
          ref={signatureRef}
          onOK={handleOK}
          onEnd={handleEnd}
          onEmpty={() => Alert.alert('⚠️', 'Please draw a signature.')}
          autoClear={false}
          webStyle={webStyle}
          descriptionText="Sign below"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
          <Text style={styles.btnText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.btnText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const webStyle = `
  .m-signature-pad {
    box-shadow: none; border: 1px solid #ccc;
  }
  .m-signature-pad--footer {
    display: none;
  }
`;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
  },
  signatureContainer: {
    flex: 1,
    borderColor: '#aaa',
    borderWidth: 1,
    marginHorizontal: 20,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  clearBtn: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#D32F2F',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmBtn: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#1E63F0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
