import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, radius, type, fonts } from '@/src/theme';
import { fetchJournal } from '@/src/api';
import ScreenHeader from '@/src/components/ScreenHeader';

const MONTHS = ['JANV', 'FÉVR', 'MARS', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];
const LAST_JOURNAL_IMAGE = require('../../assets/images/journal/journal des infectés.jpg');
const SECOND_JOURNAL_IMAGE = require('../../assets/images/journal/le message des anciens.png');
const FIRST_JOURNAL_IMAGE = require('../../assets/images/journal/chasse 2026.png');

const DEFAULT_JOURNAL_ENTRIES = [
  {
    id: 'grande-chasse-aux-tresors-2026',
    date: '2026-08-01',
    title: 'La Grande Chasse aux Trésors 2026',
    body: `### Chasse au trésor des Chutes Fraser – Été 2026

Au cours de l'été 2026, dix aventuriers ont vécu une journée inoubliable aux Chutes Fraser. L'aventure a débuté autour d'un grand festin, avant qu'une ancienne légende ne les entraîne dans une quête remplie de mystères. Après avoir renouvelé un vieux pacte et réveillé une force oubliée, ils se sont lancés dans une succession d'épreuves où le courage, la précision, le hasard, l'observation et l'esprit d'équipe étaient essentiels.

Tout au long de leur parcours, ils ont retrouvé des clés, découvert des trésors cachés, appris à se servir d'une boussole, récolté de l'argile et des ingrédients rares, préparé une potion spéciale et porté secours à de nombreux Infectés en les libérant de leur corruption. Ils ont également croisé l'étrange capitaine A.P. Fraser et son inséparable oiseau aux mille noms, dont les interventions ont apporté autant d'aide que de confusion.

Après avoir suivi les derniers indices, les aventuriers ont affronté le pirate infecté, récupéré le mystérieux Œil Violet et révélé le dernier secret de la vieille carte enchantée. Le coffre final s'est alors ouvert, mettant un terme à cette extraordinaire aventure.

Cette chasse au trésor a été marquée par les rires, les défis, les découvertes et la coopération. Elle restera gravée dans la mémoire des dix aventuriers comme le premier chapitre d'une histoire beaucoup plus grande, laissant entrevoir que d'autres mystères les attendent encore.`,
  },
  {
    id: 'decouverte-confrerie-heritiers',
    date: '2026-08-02',
    title: 'La Découverte de la Confrérie des Héritiers',
    body: `### Le Message des Anciens et la lettre du capitaine A.P. Fraser

À la suite des événements vécus aux Chutes Fraser, les aventuriers découvrirent deux anciens messages qui allaient bouleverser tout ce qu'ils croyaient savoir.

Le premier, rédigé par les Anciens Gardiens, révélait l'existence d'une ancienne confrérie dont la mission était de protéger un héritage précieux et de préserver l'équilibre face à une menace grandissante. Les Anciens expliquaient que leur temps était révolu et qu'une nouvelle génération devait désormais reprendre cette responsabilité.

Le second message provenait du capitaine A.P. Fraser. Dans sa lettre, il révélait que les événements récents n'étaient que le début d'une aventure bien plus vaste. Il invitait les dix aventuriers à répondre à un nouvel appel et à reconstruire la Confrérie des Héritiers afin de poursuivre la mission laissée inachevée par ceux qui les avaient précédés.

Ces deux messages marquèrent un tournant décisif. Ce qui avait commencé comme une simple chasse au trésor devenait désormais le premier chapitre d'une grande épopée, où chaque aventurier était appelé à devenir un véritable Héritier et à écrire la suite de cette histoire.`,
  },
  {
    id: 'prochaine-aventure',
    date: '2026-08-03',
    title: 'Le retour des Infectés et le choix de classes',
    body: `### L'attaque des Infectés

Peu après les événements des Chutes Fraser, le calme fut brusquement interrompu par une attaque soudaine des Infectés. Surgissant de toutes parts, ils étaient beaucoup plus nombreux et plus agressifs que lors de la chasse au trésor. Malgré leur courage, les dix aventuriers furent rapidement dépassés et incapables de repousser cette nouvelle menace.

Au cours de l'affrontement, plusieurs aventuriers furent paralysés par une mystérieuse force, tandis que les autres tentaient tant bien que mal de leur porter secours. Face à cet ennemi imprévisible, ils réalisèrent qu'ils ne possédaient ni les connaissances ni les compétences nécessaires pour affronter les dangers qui les attendaient. Sans l'intervention de leurs alliés, leur aventure aurait pu prendre fin ce jour-là.

**État de la situation**

- Les Infectés sont toujours présents et représentent une menace grandissante.
- Les anciens secrets commencent à refaire surface, laissant présager des épreuves encore plus périlleuses.
- La Confrérie des Héritiers doit être reconstruite afin de préparer une nouvelle génération de protecteurs.

Cette défaite a toutefois révélé une vérité essentielle : aucun aventurier ne peut accomplir cette mission seul. Pour espérer survivre aux prochaines épreuves, chacun devra choisir une classe correspondant à ses forces et apprendre à maîtriser ses talents. Éclaireur, Bosco, Bretteur, Alchimiste, Médecin de bord, Forgeron, Messager, Chasseur de trésors, Maître des marées ou Botaniste : chaque rôle possède des compétences uniques, et seule la complémentarité de ces classes permettra à la Confrérie de faire face aux dangers qui approchent.

Le choix de leur classe marque ainsi le véritable commencement de leur formation. Désormais, chaque talent appris, chaque mission accomplie et chaque nouvelle compétence acquise les rapprocheront du jour où ils pourront enfin affronter les ténèbres d'égal à égal.`,
  },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { day: '??', month: '???', year: '' };
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: MONTHS[d.getMonth()],
    year: String(d.getFullYear()),
  };
}

export default function JournalScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const pagerRef = useRef<ScrollView>(null);
  const { width, height } = useWindowDimensions();
  const bookWidth = Math.max(width - spacing.xl * 2, 280);
  const pageHeight = Math.min(Math.max(height * 0.58, 420), 620);
  const spreadCount = entries.length > 1 ? 2 : entries.length;

  useEffect(() => {
    fetchJournal()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEntries(data);
        } else {
          setEntries(DEFAULT_JOURNAL_ENTRIES);
        }
      })
      .catch(() => {
        setEntries(DEFAULT_JOURNAL_ENTRIES);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="journal-screen">
      <ScreenHeader title="LE JOURNAL" subtitle="Chronique des jours passés" icon="notebook-outline" />

      {loading ? (
        <ActivityIndicator color={colors.brandPrimary} style={{ marginTop: spacing.xxl }} />
      ) : entries.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="notebook-outline" size={48} color={colors.brandTertiary} />
          <Text style={styles.emptyText}>Aucune entrée pour l'instant.</Text>
        </View>
      ) : (
        <View style={styles.bookArea}>
          <ScrollView
            ref={pagerRef}
            style={[styles.bookPager, { width: bookWidth }]}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bookPages}
            onMomentumScrollEnd={(event) => {
              setPageIndex(Math.round(event.nativeEvent.contentOffset.x / bookWidth));
            }}
          >
            {entries.map((entry, index) => {
              if (index === 0) {
                return <BookSpread key={`${entry.id}-spread`} width={bookWidth} height={pageHeight} image={FIRST_JOURNAL_IMAGE} testID={`journal-entry-${entry.id}`} />;
              }

              if (index === 1) {
                return <BookImagesSpread key={`${entry.id}-spread`} width={bookWidth} height={pageHeight} testID="journal-images-spread" />;
              }

              return null;
            })}
          </ScrollView>

          <View style={styles.bookControls}>
            <Pressable
              accessibilityLabel="Page précédente"
              disabled={pageIndex === 0}
              onPress={() => {
                const nextIndex = Math.max(pageIndex - 1, 0);
                pagerRef.current?.scrollTo({ x: nextIndex * bookWidth, animated: true });
                setPageIndex(nextIndex);
              }}
              style={({ pressed }) => [styles.pageButton, pageIndex === 0 && styles.pageButtonDisabled, pressed && styles.pageButtonPressed]}
            >
              <MaterialCommunityIcons name="chevron-left" size={28} color={colors.onSurfaceInverse} />
            </Pressable>
            <Text style={styles.pageCounter}>{pageIndex + 1} / {Math.max(spreadCount, 1)}</Text>
            <Pressable
              accessibilityLabel="Page suivante"
              disabled={pageIndex >= spreadCount - 1}
              onPress={() => {
                const nextIndex = Math.min(pageIndex + 1, spreadCount - 1);
                pagerRef.current?.scrollTo({ x: nextIndex * bookWidth, animated: true });
                setPageIndex(nextIndex);
              }}
              style={({ pressed }) => [styles.pageButton, pageIndex >= spreadCount - 1 && styles.pageButtonDisabled, pressed && styles.pageButtonPressed]}
            >
              <MaterialCommunityIcons name="chevron-right" size={28} color={colors.onSurfaceInverse} />
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function BookSpread({ width, height, image, testID }: { width: number; height: number; image: any; testID: string }) {
  return (
    <View style={[styles.spread, { width, height }]} testID={testID}>
      <Image source={image} style={[styles.pageImage, { width, height }]} contentFit="contain" />
      <View pointerEvents="none" style={[styles.spine, { height }]} />
    </View>
  );
}

function BookImagesSpread({ width, height, testID }: { width: number; height: number; testID: string }) {
  const pageWidth = width / 2;
  const overlap = 32;

  return (
    <View style={[styles.spread, { width, height }]} testID={testID}>
      <View style={{ position: 'absolute', left: 0, width: pageWidth, height, overflow: 'hidden' }}>
        <Image source={SECOND_JOURNAL_IMAGE} style={{ width: pageWidth + overlap, height }} contentFit="contain" />
      </View>
      <View style={{ position: 'absolute', left: pageWidth, width: pageWidth, height, overflow: 'hidden' }}>
        <Image source={LAST_JOURNAL_IMAGE} style={{ position: 'absolute', left: -overlap, width: pageWidth + overlap, height }} contentFit="contain" />
      </View>
    </View>
  );
}

function BookPage({ width, height, entry, image, seamless = false }: { width: number; height: number; entry?: any; image?: any; seamless?: boolean }) {
  return (
    <View style={[styles.page, seamless && styles.seamlessPage, { width, height }]}> 
      {image ? (
        <Image source={image} style={[styles.pageImage, { width, height }]} contentFit="contain" />
      ) : entry ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.textPage}>
          <Text style={styles.entryTitle}>{entry.title}</Text>
          <View style={styles.rule} />
          <View style={styles.bodyBlock}>
            {String(entry.body || '').split('\n').map((line, index) => {
              const trimmed = line.trim();
              if (!trimmed) return <View key={`${entry.id}-${index}`} style={styles.bodySpacer} />;
              if (trimmed.startsWith('### ')) {
                return <Text key={`${entry.id}-${index}`} style={styles.bodyHeading}>{trimmed.replace(/^###\s*/, '')}</Text>;
              }
              return <Text key={`${entry.id}-${index}`} style={styles.entryBody}>{trimmed}</Text>;
            })}
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  bookArea: { flex: 1, justifyContent: 'center', paddingBottom: spacing.lg },
  bookPager: { alignSelf: 'center' },
  bookPages: { alignItems: 'center' },
  spread: { flexDirection: 'row', position: 'relative' },
  page: {
    overflow: 'hidden',
    backgroundColor: '#E9D7B0',
    borderWidth: 1,
    borderColor: '#8B5E3C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  seamlessPage: { borderWidth: 0 },
  pageImage: { position: 'absolute', top: 0 },
  textPage: { padding: spacing.lg },
  spine: { position: 'absolute', left: '50%', width: 2, backgroundColor: 'rgba(67, 35, 19, 0.5)' },
  bookControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, paddingTop: spacing.lg },
  pageButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill, backgroundColor: colors.brandPrimary },
  pageButtonDisabled: { opacity: 0.35 },
  pageButtonPressed: { opacity: 0.75 },
  pageCounter: { ...type.small, color: colors.onSurfaceSecondary, minWidth: 54, textAlign: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { ...type.body, color: colors.onSurfaceSecondary, fontStyle: 'italic' },
  entry: { flexDirection: 'row', gap: spacing.md },
  parchment: {
    flex: 1,
    backgroundColor: '#E9D7B0',
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: '#8B5E3C',
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  lastEntryImage: { width: '100%', aspectRatio: 2 / 3, borderRadius: radius.sm },
  entryTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: '700',
    color: '#5A2E1B',
    textAlign: 'center',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  rule: {
    height: 1,
    backgroundColor: '#A66C3A',
    marginVertical: spacing.sm,
    opacity: 0.7,
  },
  bodyBlock: { gap: 4 },
  bodySpacer: { height: 4 },
  bodyHeading: {
    fontFamily: fonts.display,
    fontSize: 14,
    fontWeight: '700',
    color: '#5A2E1B',
    marginTop: 4,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  entryBody: {
    fontFamily: fonts.text,
    fontSize: 13,
    lineHeight: 20,
    color: '#4D2B18',
  },
});
