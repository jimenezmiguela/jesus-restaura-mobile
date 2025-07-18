import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "https://jesusrestaura.com/api/v1/chapter";
const BOOKS = [
  "Genesis",
  "Exodo",
  "Levitico",
  "Numeros",
  "Deuteronomio",
  "Mateo",
  "Salmos",
  "Jeremias",
];

export default function ChapterScreen() {
  const [book, setBook] = useState("genesis");
  const [chapter, setChapter] = useState("");
  const [verses, setVerses] = useState<string[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchChapter = async () => {
    if (!chapter.trim()) {
      Alert.alert("Error", "Por favor ingresa un número de capítulo");
      return;
    }

    setLoading(true);
    setVerses(null);
    setError("");

    try {
      const res = await fetch(`${API_URL}?book=${book}&chapter=${chapter}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Capítulo no encontrado");
      } else {
        setVerses(data.verses);
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>📖 Buscar Capítulo</Text>

        <Text style={styles.label}>Libro</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={book}
            onValueChange={setBook}
            style={Platform.OS === "ios" ? styles.pickerIOS : styles.picker}
          >
            {BOOKS.map((b) => (
              <Picker.Item label={b} value={b.toLowerCase()} key={b} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Capítulo (ej. 5)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 5"
          keyboardType="numeric"
          value={chapter}
          onChangeText={setChapter}
        />

        <Button
          title="Buscar Capítulo"
          color="#ff6b00"
          onPress={fetchChapter}
        />

        {loading && <ActivityIndicator size="large" color="#ff6b00" />}
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : verses ? (
          <View style={styles.verseCard}>
            <Text style={styles.verseTitle}>
              {book.charAt(0).toUpperCase() + book.slice(1)} {chapter}
            </Text>
            {verses.map((v, i) => (
              <Text key={i} style={styles.verseText}>
                {i + 1}. {v}
              </Text>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 20 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ff6b00",
    textAlign: "center",
    marginBottom: 20,
  },
  label: { fontSize: 16, color: "#333", marginBottom: 8 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: { height: 50, backgroundColor: "#fff" },
  pickerIOS: { height: 150 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  verseCard: {
    backgroundColor: "#fff7e6",
    borderColor: "#ff6b00",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  verseTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#ff6b00",
    marginBottom: 10,
  },
  verseText: { fontSize: 16, color: "#333" },
  error: { color: "red", fontSize: 16, textAlign: "center", marginTop: 20 },
});
