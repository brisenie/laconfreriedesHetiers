import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { Classe } from "../data/classes";

type Props = {
  visible: boolean;
  classe: Classe | null;
  onClose: () => void;
};

export default function ClassModal({
  visible,
  classe,
  onClose,
}: Props) {
  if (!classe) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>

            <Image
              source={classe.image}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.nom}>{classe.nom}</Text>

            <Text style={styles.devise}>
              {classe.devise}
            </Text>

            <Text style={styles.description}>
              {classe.description}
            </Text>

            <Pressable
              style={styles.button}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>
                Fermer
              </Text>
            </Pressable>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },

  container: {
    backgroundColor: "#f7ecd3",
    borderRadius: 18,
    padding: 20,
    maxHeight: "90%",
  },

  image: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginBottom: 15,
  },

  nom: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4a2b17",
  },

  devise: {
    marginTop: 10,
    fontStyle: "italic",
    textAlign: "center",
    color: "#75542d",
    fontSize: 16,
  },

  description: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
    color: "#3c2b1b",
  },

  button: {
    marginTop: 25,
    backgroundColor: "#8c6239",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});