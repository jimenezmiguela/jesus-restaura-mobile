import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "https://jesusrestaura.com/api/v1/search";
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

export default function SearchScreen() {
  const [book, setBook] = useState("genesis");
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<string[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!term.trim()) {
      Alert.alert("Error", "Ingresa una palabra para buscar");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch(`${API_URL}?book=${book}&search_term=${term}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || "No se encontraron resultados");
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
        <Text style={styles.header}>📖 Buscar Palabra</Text>

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

        <Text style={styles.label}>Palabra a buscar</Text>
        <TextInput
          style={styles.input}
          placeholder="ej. fe"
          value={term}
          onChangeText={setTerm}
        />

        <Button title="Buscar" color="#ff6b00" onPress={search} />

        {loading && <ActivityIndicator size="large" color="#ff6b00" />}
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : results ? (
          <View style={styles.verseCard}>
            <Text style={styles.verseTitle}>Resultados:</Text>
            {results.map((r, i) => (
              <Text key={i} style={styles.verseText}>
                {r}
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
