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

const BOOKS = ["Genesis", "Exodo", "Levitico", "Numeros", "Deuteronomio"];
const API_URL = "https://jesusrestaura.com/api/v1/verse";

export default function HomeScreen() {
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
      const response = await fetch(
        `${API_URL}?book=${book}&reference=${reference}`,
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Verso no encontrado");
      } else {
        setVerse(data.verse);
      }
    } catch (e) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>📖 Jesús Restaura</Text>

        <Text style={styles.label}>Selecciona un Libro</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={book}
            onValueChange={(value) => setBook(value)}
            style={Platform.OS === "ios" ? styles.pickerIOS : styles.picker}
            itemStyle={{ color: "#000" }}
            mode="dropdown"
          >
            {BOOKS.map((b) => (
              <Picker.Item
                label={b}
                value={b.toLowerCase()}
                key={b}
                color="#000"
              />
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
  label: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 15,
  },
  picker: {
    height: 50,
    backgroundColor: "#fff", // White background
    color: "#000", // Black text
  },
  pickerIOS: {
    height: 150,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 20,
    color: "#000", // Ensure input text is black
  },
  button: {
    marginBottom: 20,
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
  verseText: {
    fontSize: 16,
    color: "#333",
  },
  error: {
    color: "red",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
});
