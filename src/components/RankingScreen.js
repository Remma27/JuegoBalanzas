/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';

const URL = Platform.select({
  android: 'http://10.0.2.2:4000/ranking',
  default: 'http://localhost:4000/ranking',
});

const RankingScreen = ({ onBack }) => {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(URL)
      .then(r => r.json())
      .then(setItems)
      .catch(e => setError(e.message));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>

      {error ? (
        <Text style={styles.empty}>No se pudo cargar el ranking: {error}</Text>
      ) : !items ? (
        <ActivityIndicator style={{ marginTop: 24 }} size="large" />
      ) : items.length === 0 ? (
        <Text style={styles.empty}>Aún no hay partidas registradas.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={i => i._id}
          style={{ width: '100%' }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.rowText}>
                {item.players.map(p => p.name).join(' vs ')}
              </Text>
              <View
                style={[
                  styles.badge,
                  item.balanced ? styles.win : styles.lose,
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.balanced ? 'Ganó' : 'Perdió'}
                </Text>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>Volver al menú</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 16,
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  rowText: {
    fontSize: 15,
    flex: 1,
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  win: {
    backgroundColor: '#C8E6C9',
  },
  lose: {
    backgroundColor: '#FFCDD2',
  },
  badgeText: {
    fontWeight: 'bold',
    color: '#333',
  },
  empty: {
    color: '#777',
    marginTop: 24,
    fontSize: 15,
  },
  back: {
    color: '#1565C0',
    marginTop: 20,
    fontSize: 16,
  },
});

export default RankingScreen;