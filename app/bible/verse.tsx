// app/bible/verse.tsx
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

export default function VerseScreen() {
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
    <SafeAreaView style={verseStyles.container}>
      <ScrollView contentContainerStyle={verseStyles.scroll}>
        <Text style={verseStyles.header}>📖 Buscar Versículo</Text>
        <Text style={verseStyles.label}>Selecciona un Libro</Text>
        <View style={verseStyles.pickerWrapper}>
          <Picker
            selectedValue={book}
            onValueChange={(v) => setBook(v)}
            style={
              Platform.OS === "ios" ? verseStyles.pickerIOS : verseStyles.picker
            }
          >
            {BOOKS.map((b) => (
              <Picker.Item label={b} value={b.toLowerCase()} key={b} />
            ))}
          </Picker>
        </View>
        <Text style={verseStyles.label}>Versículo (ej. 3:16)</Text>
        <TextInput
          style={verseStyles.input}
          placeholder="Ej: 3:16"
          value={reference}
          onChangeText={setReference}
          placeholderTextColor="#999"
        />
        <View style={verseStyles.button}>
          <Button
            title="Buscar Versículo"
            color="#ff6b00"
            onPress={fetchVerse}
          />
        </View>

        {loading && <ActivityIndicator size="large" color="#ff6b00" />}
        {error ? (
          <Text style={verseStyles.error}>{error}</Text>
        ) : verse ? (
          <View style={verseStyles.verseCard}>
            <Text style={verseStyles.verseTitle}>
              {book.charAt(0).toUpperCase() + book.slice(1)} {reference}
            </Text>
            <Text style={verseStyles.verseText}>{verse}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const verseStyles = StyleSheet.create({
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
