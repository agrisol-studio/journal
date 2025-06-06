import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';

type CardProps = {
  title?: string;
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
};

export default function Card({ title, children, onPress, style }: CardProps) {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
  },
});