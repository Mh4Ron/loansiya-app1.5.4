import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import ClientIDScreen from './screens/ClientIDScreen';
import ClientIDConfirmScreen from './screens/ClientIDConfirmScreen';
import ClientProfileScreen from './screens/ClientProfileScreen';
import UploadDocumentsScreen from './screens/UploadDocumentsScreen';
import InvalidCIDScreen from './screens/InvalidCIDScreen';
import ScoringProcessingScreen from './screens/ScoringProcessingScreen';
import ScoringResultScreen from './screens/ScoringResultScreen';
import LoanFormScreen from './screens/LoanFormScreen'; // Adjust path as needed
import LoanRecommendationScreen from './screens/LoanRecommendationScreen';
import LoanAgreementScreen from './screens/LoanAgreementScreen'; 
import SignatureAgreementScreen from './screens/SignatureAgreementScreen';
import SignedAgreementPreview from './screens/SignedAgreementPreview';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ClientID" component={ClientIDScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ClientIDConfirm" component={ClientIDConfirmScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ClientProfile" component={ClientProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UploadDocuments" component={UploadDocumentsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="InvalidCID" component={InvalidCIDScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ScoringProcessing" component={ScoringProcessingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ScoringResult" component={ScoringResultScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoanForm" component={LoanFormScreen} />
        <Stack.Screen name="LoanRecommendation" component={LoanRecommendationScreen} />
        <Stack.Screen name="LoanAgreement" component={LoanAgreementScreen} />
      <Stack.Screen name="LoanAgreementScreen" component={LoanAgreementScreen} />
        <Stack.Screen name="SignatureAgreementScreen" component={SignatureAgreementScreen} />
        <Stack.Screen name="SignedAgreementPreview" component={SignedAgreementPreview} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
