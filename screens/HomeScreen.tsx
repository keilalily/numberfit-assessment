// screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { QuestionData } from '../types/QuestionTypes';
import { BASE_URL } from '../constants/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);

    const fullUrl = `${BASE_URL}${data}`;
    console.log('Scanning URL: ', fullUrl);
    try {
      const response = await axios.get<QuestionData>(fullUrl);
      navigation.navigate('Question', {
        questionData: {
            ...response.data,
            endpoint: data,
        },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load quiz data.');
      console.error('Error fetching quiz data: ', error);
      setScanned(false);
    }
  };

  if (!permission) return <Text>Loading camera...</Text>;
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!scanned && (
        <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
      )}
      {scanned && (
        <View style={styles.overlay}>
          <Button title="Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
