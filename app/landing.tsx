import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jesus Restaura</Text>
      <Text style={styles.subtitle}>Bienvenido</Text>
      <Button title="Estudia la Biblia" onPress={() => router.push("/bible")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7e6",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff6b00",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
});
