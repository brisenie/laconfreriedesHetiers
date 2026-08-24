import React from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { Classe } from "../data/classes.ts/classes";

type Props = {
  classe: Classe;
  onPress: () => void;
};

export default function ClassCard({ classe, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={classe.image} style={styles.image} resizeMode="contain" />

      <View style={styles.content}>
        <Text style={styles.nom}>{classe.nom}</Text>
        <Text style={styles.devise}>{classe.devise}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5e6c8",
    borderRadius: 16,
    padding: 12,
    margin: 8,
    alignItems: "center",
    width: 170,
    elevation: 4,
  },

  image: {
    width: 110,
    height: 110,
    marginBottom: 10,
  },

  content: {
    alignItems: "center",
  },

  nom: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4b2e18",
  },

  devise: {
    marginTop: 6,
    fontSize: 13,
    textAlign: "center",
    fontStyle: "italic",
    color: "#6b4b2a",
  },
});
