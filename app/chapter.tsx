import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "https://jesusrestaura.com/api/v1/chapter";

export default function ChapterScreen() {
  const { book } = useLocalSearchParams<{ book: string }>();
  const [chapter, setChapter] = useState("");
  const [verses, setVerses] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchChapter = async () => {
    if (!chapter.trim()) {
      Alert.alert("Error", "Por favor ingresa un capítulo válido (ej. 3)");
      return;
    }

    setLoading(true);
    setVerses(null);
    setError("");

    try {
      const res = await fetch(`${API_URL}?book=${book}&chapter=${chapter}`);
      const data = await res.json();

      if (!res.ok) setError(data.error || "Capítulo no encontrado");
      else setVerses(data.verses);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>📖 {book?.toUpperCase()}</Text>

        <TextInput
          style={styles.input}
          placeholder="Capítulo (ej: 3)"
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
        ) : (
          verses &&
          verses.map((v, i) => (
            <Text key={i} style={styles.verse}>
              {i + 1}. {v}
            </Text>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ff6b00",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  error: { color: "red", fontSize: 16, marginTop: 20, textAlign: "center" },
  verse: { fontSize: 16, marginBottom: 10 },
});
