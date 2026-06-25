// App.js
import React, { useEffect, useState } from 'react';  // tambah useState
import {
  View, Text, StyleSheet, SafeAreaView,
  ActivityIndicator, TouchableOpacity, FlatList, Image,
} from 'react-native';
import axios from 'axios';

export default function App() {
  // ===== 3 STATE UTAMA =====
  const [products, setProducts] = useState([]);   // data produk (array kosong dulu)
  const [loading, setLoading] = useState(true);   // status loading (true di awal)
  const [error, setError] = useState(null);       // pesan error (null = belum ada)
  const [refreshing, setRefreshing] = useState(false);
  // Fungsi fetch dipisah agar bisa dipanggil ulang (untuk retry nanti)
  async function fetchProducts() {
    try {
      setLoading(true);    // mulai loading
      setError(null);      // reset error lama (penting saat retry)

      const response = await axios.get('https://fakestoreapi.com/products');
      setProducts(response.data);   // SUKSES: simpan data ke state
    } catch (err) {
      setError('Gagal memuat produk. Periksa koneksi internetmu.');  // GAGAL
    } finally {
      setLoading(false);   // SELALU matikan loading (sukses/gagal)
    }
  }
  async function onRefresh() {
  setRefreshing(true);        // tampilkan indikator refresh
  await fetchProducts();      // ambil ulang data
  setRefreshing(false);       // sembunyikan indikator refresh
}

  // Jalankan fetch sekali saat mount
  useEffect(() => {
    fetchProducts();
  }, []);

   return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🛒 ShopCatalog</Text>

      {/* KONDISI 1: LOADING → tampilkan spinner */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00b894" />
          <Text style={styles.infoText}>Memuat produk...</Text>
        </View>
      )}

      {/* KONDISI 2: ERROR → pesan + tombol Coba Lagi */}
      {!loading && error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>😢 {error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchProducts}>
            <Text style={styles.retryText}>🔄 Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* KONDISI 3: SUKSES → sementara teks, FlatList di Page 7 */}
 {!loading && !error && (
    <FlatList
      data={products}                       // sumber array data
      keyExtractor={(item) => item.id.toString()}  // key unik tiap item
      contentContainerStyle={{ padding: 12 }}
       refreshing={refreshing}     // status: sedang refresh atau tidak
      onRefresh={onRefresh}       // fungsi yang dipanggil saat ditarik
            ListHeaderComponent={
        <Text style={styles.listHeader}>
          {products.length} Produk Tersedia
        </Text>
      }
      renderItem={({ item }) => (
        // KARTU PRODUK
        <View style={styles.card}>
          {/* Gambar produk dari URL */}
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="contain"
          />
          {/* Info produk */}
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.cardPrice}>${item.price}</Text>
            <Text style={styles.cardRating}>
              ⭐ {item.rating.rate} ({item.rating.count})
            </Text>
          </View>
        </View>
      )}
    />
  )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#0a2e0a' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#888', marginTop: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  infoText: { fontSize: 15, color: '#555', marginTop: 12, textAlign: 'center' },
  errorText: { fontSize: 16, color: '#e74c3c', textAlign: 'center', marginBottom: 16 },
  retryBtn: { backgroundColor: '#00b894', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    card: {
    flexDirection: 'row',          // gambar & info bersebelahan
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,                  // bayangan (Android)
    shadowColor: '#000',           // bayangan (iOS)
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: { width: 80, height: 80, marginRight: 12 },
  cardInfo: { flex: 1, justifyContent: 'center' },  // flex:1 agar teks wrap
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#0a2e0a' },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#00b894', marginTop: 6 },
  cardRating: { fontSize: 12, color: '#888', marginTop: 4 },
  listHeader: { fontSize: 16, fontWeight: 'bold', color: '#0a2e0a', marginBottom: 12 },
});