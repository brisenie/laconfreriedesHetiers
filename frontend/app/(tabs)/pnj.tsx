import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
} from 'react-native';

const MOT_DE_PASSE = 'Hakunamatata';

const personnages = [
  {
    id: 'fraser',
    nom: 'Capitaine A.P. Fraser',
    sousTitre: 'Le capitaine maraîcher',
    image: require('@/assets/pnj/Capitaine A.P. Fraser.png'),
  },
  {
    id: 'oiseau',
    nom: 'Bozo, Bobo, peut-être Lolo, Cocorico ou bien Ricardo',
    sousTitre: 'L’oiseau aux mille noms',
    image: require('@/assets/pnj/Bozo_Bobo_oiseau.png'),
  },
  {
    id: 'infectes',
    nom: 'Les Infectés',
    sousTitre: 'Ils attaquent seuls ou en groupe',
    image: require('@/assets/pnj/Les Infectés.png'),
  },
];

const personnagesSecrets = [
  {
    id: 'mary',
    nom: 'Mary Génois',
    sousTitre: 'Personnage à découvrir',
    symbole: '👤',
  },
  {
    id: 'forgeron',
    nom: 'Le Forgeron des Anciens',
    sousTitre: 'Personnage à découvrir',
    symbole: '⚒️',
  },
];

export default function PnjScreen() {
  const [motDePasse, setMotDePasse] = useState('');
  const [deverrouille, setDeverrouille] = useState(false);
  const [message, setMessage] = useState('');

  const verifierMotDePasse = () => {
    if (motDePasse === MOT_DE_PASSE) {
      setDeverrouille(true);
      setMessage('Les PNJ secrets sont dévoilés.');
      setMotDePasse('');
    } else {
      setMessage('Mot de passe incorrect.');
    }
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.contenu}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.titre}>LES PNJ</Text>

      <Text style={styles.introduction}>
        Les personnages rencontrés par la Confrérie des Héritiers
      </Text>

      <Text style={styles.section}>PERSONNAGES DÉCOUVERTS</Text>

      {personnages.map((personnage) => (
        <View key={personnage.id} style={styles.carte}>
          <Image
            source={personnage.image}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.texteCarte}>
            <Text style={styles.nom}>{personnage.nom}</Text>
            <Text style={styles.sousTitre}>
              {personnage.sousTitre}
            </Text>
          </View>
        </View>
      ))}

      <Text style={styles.section}>PERSONNAGES À DÉCOUVRIR</Text>

      {personnagesSecrets.map((personnage) => (
        <View
          key={personnage.id}
          style={[
            styles.carteSecrete,
            !deverrouille && styles.carteVerrouillee,
          ]}
        >
          <View style={styles.silhouette}>
            <Text style={styles.symbole}>
              {deverrouille ? personnage.symbole : '🔒'}
            </Text>
          </View>

          <View style={styles.texteCarte}>
            <Text style={styles.nom}>
              {deverrouille
                ? personnage.nom
                : 'PNJ à découvrir'}
            </Text>

            <Text style={styles.sousTitre}>
              {deverrouille
                ? personnage.sousTitre
                : 'Identité verrouillée'}
            </Text>
          </View>
        </View>
      ))}

      <View style={styles.organisateur}>
        <Text style={styles.titreOrganisateur}>
          ACCÈS DES ORGANISATEURS
        </Text>

        {!deverrouille ? (
          <>
            <TextInput
              value={motDePasse}
              onChangeText={(texte) => {
                setMotDePasse(texte);
                setMessage('');
              }}
              placeholder="Mot de passe"
              secureTextEntry
              autoCapitalize="none"
              style={styles.champ}
            />

            <Pressable
              onPress={verifierMotDePasse}
              style={styles.bouton}
            >
              <Text style={styles.texteBouton}>
                Déverrouiller
              </Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={() => {
              setDeverrouille(false);
              setMessage('Les PNJ secrets sont verrouillés.');
            }}
            style={styles.boutonSecondaire}
          >
            <Text style={styles.texteBoutonSecondaire}>
              Verrouiller de nouveau
            </Text>
          </Pressable>
        )}

        {message !== '' && (
          <Text style={styles.message}>{message}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#17120d',
  },

  contenu: {
    padding: 18,
    paddingBottom: 50,
  },

  titre: {
    color: '#d6ae58',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 3,
    marginTop: 12,
  },

  introduction: {
    color: '#ead9b7',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },

  section: {
    color: '#d6ae58',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 12,
  },

  carte: {
    backgroundColor: '#2a2118',
    borderWidth: 1,
    borderColor: '#8d6b32',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 18,
  },

  image: {
    width: '100%',
    height: 360,
    backgroundColor: '#111111',
  },

  carteSecrete: {
    backgroundColor: '#2a2118',
    borderWidth: 1,
    borderColor: '#8d6b32',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 18,
  },

  carteVerrouillee: {
    opacity: 0.55,
  },

  silhouette: {
    height: 230,
    backgroundColor: '#080808',
    alignItems: 'center',
    justifyContent: 'center',
  },

  symbole: {
    fontSize: 85,
  },

  texteCarte: {
    padding: 16,
  },

  nom: {
    color: '#f4dfb1',
    fontSize: 20,
    fontWeight: 'bold',
  },

  sousTitre: {
    color: '#c9b58f',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 5,
  },

  organisateur: {
    backgroundColor: '#241c14',
    borderWidth: 1,
    borderColor: '#d6ae58',
    borderRadius: 12,
    padding: 18,
    marginTop: 16,
  },

  titreOrganisateur: {
    color: '#d6ae58',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },

  champ: {
    backgroundColor: '#f1e5cc',
    color: '#1b1712',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },

  bouton: {
    backgroundColor: '#9d742e',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },

  texteBouton: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  boutonSecondaire: {
    borderWidth: 1,
    borderColor: '#d6ae58',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },

  texteBoutonSecondaire: {
    color: '#d6ae58',
    fontWeight: 'bold',
    fontSize: 16,
  },

  message: {
    color: '#f4dfb1',
    textAlign: 'center',
     marginTop: 12,
  },
});