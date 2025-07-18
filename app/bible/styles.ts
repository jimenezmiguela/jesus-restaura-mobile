import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
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
  verseText: {
    fontSize: 16,
    color: "#333",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});
