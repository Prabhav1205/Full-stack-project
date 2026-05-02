import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View style={styles.container}><ActivityIndicator /></View>;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera access is needed to scan objects</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo) setCapturedImage(photo.uri);
  };

  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setCapturedImage(result.assets[0].uri);
  };

  const retake = () => setCapturedImage(null);

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage }} style={styles.preview} />
        <View style={styles.row}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={retake}>
            <Text style={styles.secondaryBtnText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        {/* Scan frame overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.hint}>Point at an object to scan</Text>
        </View>
      </CameraView>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.uploadBtn} onPress={uploadImage}>
          <Text style={styles.uploadIcon}>🖼</Text>
          <Text style={styles.uploadLabel}>Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shutterOuter} onPress={takePicture}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => setFacing(f => (f === 'back' ? 'front' : 'back'))}
        >
          <Text style={styles.uploadIcon}>🔄</Text>
          <Text style={styles.uploadLabel}>Flip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  camera: { flex: 1, width: '100%' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  scanFrame: {
    width: 240, height: 240,
    borderWidth: 2, borderColor: '#00e5ff', borderRadius: 16,
    backgroundColor: 'transparent',
  },
  hint: { color: '#fff', fontSize: 14, opacity: 0.8 },
  controls: {
    width: '100%', paddingVertical: 32, paddingHorizontal: 40,
    backgroundColor: '#111',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  shutterOuter: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 4, borderColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  shutterInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff' },
  uploadBtn: { alignItems: 'center', gap: 4 },
  uploadIcon: { fontSize: 26 },
  uploadLabel: { color: '#aaa', fontSize: 12 },
  preview: { flex: 1, width: '100%' },
  row: {
    flexDirection: 'row', gap: 16,
    paddingVertical: 24, paddingHorizontal: 32, backgroundColor: '#111',
  },
  primaryBtn: {
    flex: 1, backgroundColor: '#00e5ff',
    paddingVertical: 14, borderRadius: 12, alignItems: 'center',
  },
  primaryBtnText: { color: '#000', fontWeight: '700', fontSize: 16 },
  secondaryBtn: {
    flex: 1, backgroundColor: '#333',
    paddingVertical: 14, borderRadius: 12, alignItems: 'center',
  },
  secondaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  permissionText: { color: '#fff', fontSize: 16, textAlign: 'center', marginHorizontal: 32 },
  permissionBtn: {
    marginTop: 20, backgroundColor: '#00e5ff',
    paddingVertical: 12, paddingHorizontal: 32, borderRadius: 10,
  },
  permissionBtnText: { color: '#000', fontWeight: '700' },
});