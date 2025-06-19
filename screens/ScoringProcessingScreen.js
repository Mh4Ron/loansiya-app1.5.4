import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function ScoringProcessingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { cid } = route.params;
  const progressRef = useRef(null);
  const [stageText, setStageText] = useState('Initializing...');

  useEffect(() => {
    let timer;

    const computeAndScore = async () => {
      try {
        setStageText('Preprocessing Financial Data...');
        progressRef.current?.animate(33, 1000); // Animate to 33%

        // 🟩 Step 1: Compute metrics
        const metricsRes = await fetch(`http://192.168.254.141:5600/metrics/${cid}`, { method: 'POST' });
        const metrics = await metricsRes.json();

        if (!metrics || metrics.error) {
          throw new Error(metrics.details || 'Failed to compute metrics.');
        }

        setStageText('Calculating Credit Score...');
        progressRef.current?.animate(66, 1000); // Animate to 66%

        // 🟩 Step 2: Score
        const scoreRes = await fetch(`http://192.168.254.141:5600/score/${cid}`, { method: 'POST' });
        const result = await scoreRes.json();

        if (!result || result.error) {
          throw new Error(result.details || 'Failed to score client.');
        }

        setStageText('Finalizing...');
        progressRef.current?.animate(100, 1000); // Animate to 100%

        // 🟩 Step 3: Navigate after short delay
        timer = setTimeout(() => {
          navigation.replace('ScoringResult', {
            scoreData: result
          });
        }, 1000);
      } catch (err) {
        console.error('❌ Scoring pipeline error:', err);
        Alert.alert('❌ Error', err.message);
      }
    };

    computeAndScore();

    return () => clearTimeout(timer);
  }, [cid]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Good day Loan Officer!</Text>
      <Text style={styles.processing}>Processing</Text>

      <AnimatedCircularProgress
        ref={progressRef}
        size={120}
        width={10}
        fill={0}
        tintColor="#7A6BF3"
        backgroundColor="#E6E6E6"
        rotation={0}
      />

      <Text style={styles.status}>{stageText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  processing: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 28,
  },
});
