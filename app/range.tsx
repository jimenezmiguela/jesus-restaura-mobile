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
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "https://jesusrestaura.com/api/v1/range";

export default function RangeScreen() {
  const { book } = useLocalSearchParams<{ book: string }>();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [verses, setVerses] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRange = async () => {
    if (!start.trim() || !end.trim()) {
      Alert.alert(
        "Error",
        "Por favor ingresa ambos versículos (ej. 3:16 - 3:19)",
      );
      return;
    }

    setLoading(true);
    setVerses(null);
    setError("");

    try {
      const res = await fetch(
        `${API_URL}?book=${book}&starting_verse=${start}&ending_verse=${end}`,
      );
      const data = await res.json();

      if (!res.ok || !data.verses) {
        setError(data.error || "Rango no encontrado");
      } else {
        setVerses(data.verses); // now safely using string
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
        <Text style={styles.header}>📖 Buscar Rango</Text>

        <Text style={styles.label}>Versículo de Inicio</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 3:16"
          value={start}
          onChangeText={setStart}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Versículo de Fin</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 3:19"
          value={end}
          onChangeText={setEnd}
          placeholderTextColor="#999"
        />

        <View style={styles.button}>
          <Button title="Buscar Rango" color="#ff6b00" onPress={fetchRange} />
        </View>

        {loading && <ActivityIndicator size="large" color="#ff6b00" />}
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : verses ? (
          <View style={styles.verseCard}>
            <Text style={styles.verseText}>{verses}</Text>
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
  label: { fontSize: 16, color: "#333", marginTop: 10, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  button: { marginBottom: 20 },
  verseCard: {
    backgroundColor: "#fff7e6",
    borderColor: "#ff6b00",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  verseText: { fontSize: 16, color: "#333" },
  error: { color: "red", fontSize: 16, marginTop: 20, textAlign: "center" },
});
