import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#8b5a2b',
        tabBarInactiveTintColor: '#6b6b6b',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: '#f4e7c5',
          borderTopColor: '#8b5a2b',
        },
        headerStyle: {
          backgroundColor: '#f4e7c5',
        },
        headerTintColor: '#3b2718',
        headerTitleStyle: {
          fontWeight: '800',
        },
      }}
    >
      <Tabs.Screen
        name="classes"
        options={{
          title: 'Classes',
          headerTitle: 'Classes des aventuriers',
        }}
      />

      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          headerTitle: 'Journal de bord',
        }}
      />

      <Tabs.Screen
        name="monde"
        options={{
          title: 'Monde',
          headerTitle: 'Le monde des Héritiers',
        }}
      />

      <Tabs.Screen
        name="passeport"
        options={{
          title: 'Passeport',
          headerTitle: 'Passeport des Héritiers',
        }}
      />

      <Tabs.Screen
        name="pnj"
        options={{
          title: 'PNJ',
          headerTitle: 'Personnages',
        }}
      />

      <Tabs.Screen
        name="quetes"
        options={{
          title: 'Quêtes',
          headerTitle: 'Quêtes de la Confrérie',
        }}
      />
    </Tabs>
  );
}