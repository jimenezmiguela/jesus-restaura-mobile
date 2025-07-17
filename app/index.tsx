// app/index.tsx
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
import { useRouter } from "expo-router";

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
const API_URL = "https://jesusrestaura.com/api/v1/verse";

export default function HomeScreen() {
  const router = useRouter();
  const [book, setBook] = useState("genesis");
  const [reference, setReference] = useState("");
  const [verse, setVerse] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVerse = async () => {
    if (!reference.trim()) {
      Alert.alert("Error", "Por favor ingresa un versículo válido (ej. 3:16)");
      return;
    }
    setLoading(true);
    setVerse(null);
    setError("");
    try {
      const res = await fetch(`${API_URL}?book=${book}&reference=${reference}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || "Verso no encontrado");
      else setVerse(data.verse);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>📖 Jesus Restaura</Text>
        <Text style={styles.label}>Selecciona un Libro</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={book}
            onValueChange={(v) => setBook(v)}
            style={Platform.OS === "ios" ? styles.pickerIOS : styles.picker}
          >
            {BOOKS.map((b) => (
              <Picker.Item label={b} value={b.toLowerCase()} key={b} />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Versículo (ej. 3:16)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 3:16"
          value={reference}
          onChangeText={setReference}
          placeholderTextColor="#999"
        />
        <View style={styles.button}>
          <Button
            title="Encontrar Versículo"
            color="#ff6b00"
            onPress={fetchVerse}
          />
        </View>

        <View style={styles.navButtons}>
          <Button
            title="Capítulo"
            onPress={() =>
              router.push({ pathname: "/chapter", params: { book } })
            }
          />
          <Button
            title="Rango"
            onPress={() =>
              router.push({ pathname: "/range", params: { book } })
            }
          />
          <Button
            title="Buscar Palabra"
            onPress={() =>
              router.push({ pathname: "/search", params: { book } })
            }
          />
        </View>

        {loading && <ActivityIndicator size="large" color="#ff6b00" />}
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : verse ? (
          <View style={styles.verseCard}>
            <Text style={styles.verseTitle}>
              {book.charAt(0).toUpperCase() + book.slice(1)} {reference}
            </Text>
            <Text style={styles.verseText}>{verse}</Text>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff6b00",
    textAlign: "center",
    marginBottom: 30,
  },
  label: { fontSize: 16, color: "#333", marginTop: 10, marginBottom: 5 },
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
    fontSize: 16,
    marginBottom: 20,
  },
  button: { marginBottom: 20 },
  navButtons: { marginVertical: 10 },
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
  error: { color: "red", fontSize: 16, marginTop: 20, textAlign: "center" },
});
