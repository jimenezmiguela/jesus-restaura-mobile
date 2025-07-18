import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function BibleHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Estudia la Biblia</Text>
      <Button title="Versículo" onPress={() => router.push("/bible/verse")} />
      <Button title="Rango" onPress={() => router.push("/bible/range")} />
      <Button title="Capítulo" onPress={() => router.push("/bible/chapter")} />
      <Button title="Búsqueda" onPress={() => router.push("/bible/search")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7e6",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#ff6b00",
  },
});
