// screens/QuizScreen.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import axios from 'axios';
import * as Linking from 'expo-linking';
import { BASE_URL } from '../constants/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Question'>;

export default function QuestionScreen({ route, navigation }: Props) {
  const { questionData } = route.params;
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return Alert.alert('Select an answer first.');

    setSubmitting(true);
    try {
      const endpoint = questionData.endpoint || '/endpoint243252'; // fallback
      const fullUrl = `${BASE_URL}${endpoint}`; // base + endpoint

      const response = await axios.post(fullUrl, {
        answer: selected,
      });

      const { isCorrect, coordinates } = response.data;

      Alert.alert(
        'Answer submitted!',
        `Coordinates: ${coordinates}`,
        [
          {
            text: 'Open in Maps',
            onPress: async () => {
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates}`;
                await Linking.openURL(mapUrl);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Could not submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: questionData.img_src }} style={styles.image} />
      <Text style={styles.question}>{questionData.question}</Text>
      
      {questionData.choices.map((choice, index) => (
        <TouchableOpacity
            key={index}
            style={[
                styles.choice,
                selected === choice && styles.selectedChoice,
            ]}
            onPress={() => setSelected(choice)}
        >
            <Text style={styles.choiceText}>{choice}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.submitButton, submitting && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitText}>Submit Answer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  image: { width: '100%', height: 200, marginBottom: 16, borderRadius: 8 },
  question: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  choice: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  selectedChoice: {
    backgroundColor: '#cdeafe',
  },
  choiceText: { fontSize: 16 },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: 'bold' },
});