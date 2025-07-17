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

const API_URL = "https://jesusrestaura.com/api/v1/search";

export default function SearchScreen() {
  const { book } = useLocalSearchParams<{ book: string }>();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!term.trim()) {
      Alert.alert("Error", "Por favor ingresa una palabra para buscar");
      return;
    }

    setLoading(true);
    setResults(null);
    setError("");

    try {
      const res = await fetch(`${API_URL}?book=${book}&search_term=${term}`);
      const data = await res.json();

      if (!res.ok) setError(data.error || "Sin resultados");
      else setResults(data.results);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>🔍 {book?.toUpperCase()}</Text>

        <TextInput
          style={styles.input}
          placeholder="Buscar palabra (ej: fe)"
          value={term}
          onChangeText={setTerm}
        />

        <Button title="Buscar" color="#ff6b00" onPress={search} />

        {loading && <ActivityIndicator size="large" color="#ff6b00" />}
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          results &&
          results.map((r, i) => (
            <Text key={i} style={styles.result}>
              {r}
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
  result: { fontSize: 16, marginBottom: 10 },
});
