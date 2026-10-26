import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Colors, RENDER_API_URL, LAN_API_URL, EMULATOR_API_URL } from '../constants';
import { getActiveApiUrl, setActiveApiUrl } from '../services/api';

interface Props {
  message: string;
  onRetry?: () => void;
  icon?: string;
}

export default function ErrorView({ message, onRetry, icon = '⚠️' }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');

  useEffect(() => {
    getActiveApiUrl().then(url => {
      setCurrentUrl(url);
      setInputUrl(url);
    });
  }, [modalVisible]);

  async function handleSaveUrl(urlToSave: string) {
    const trimmed = urlToSave.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      Alert.alert('Invalid URL', 'Please enter a valid URL starting with http:// or https://');
      return;
    }
    await setActiveApiUrl(trimmed);
    setCurrentUrl(trimmed);
    setModalVisible(false);
    if (onRetry) {
      onRetry();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.btnRow}>
        {onRetry && (
          <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.settingsBtnText}>⚙️ Server Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Server Config Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>⚙️ Backend Server Settings</Text>
            <Text style={styles.modalSubtitle}>
              Select a preset or enter the address where your D&G API is running:
            </Text>

            {/* Presets */}
            <View style={styles.presets}>
              <TouchableOpacity
                style={[styles.presetBtn, currentUrl === RENDER_API_URL && styles.presetBtnActive]}
                onPress={() => handleSaveUrl(RENDER_API_URL)}
                activeOpacity={0.7}
              >
                <Text style={styles.presetTitle}>☁️ Render Cloud (Recommended)</Text>
                <Text style={styles.presetSub} numberOfLines={1}>{RENDER_API_URL}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.presetBtn, currentUrl === LAN_API_URL && styles.presetBtnActive]}
                onPress={() => handleSaveUrl(LAN_API_URL)}
                activeOpacity={0.7}
              >
                <Text style={styles.presetTitle}>📶 Local Laptop Wi-Fi</Text>
                <Text style={styles.presetSub} numberOfLines={1}>{LAN_API_URL}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.presetBtn, currentUrl === EMULATOR_API_URL && styles.presetBtnActive]}
                onPress={() => handleSaveUrl(EMULATOR_API_URL)}
                activeOpacity={0.7}
              >
                <Text style={styles.presetTitle}>📱 Android Emulator</Text>
                <Text style={styles.presetSub} numberOfLines={1}>{EMULATOR_API_URL}</Text>
              </TouchableOpacity>
            </View>

            {/* Custom Input */}
            <Text style={styles.inputLabel}>Or Enter Custom URL / IP:</Text>
            <TextInput
              style={styles.input}
              value={inputUrl}
              onChangeText={setInputUrl}
              placeholder="http://192.168.x.x:5000/api"
              placeholderTextColor={Colors.textLight}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => handleSaveUrl(inputUrl)}
                activeOpacity={0.8}
              >
                <Text style={styles.saveText}>Save & Reconnect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.background,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  message: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  btnRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  retryText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  settingsBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  settingsBtnText: {
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  presets: {
    gap: 8,
    marginBottom: 16,
  },
  presetBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: '#E8F5E9',
  },
  presetTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  presetSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  saveText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});

