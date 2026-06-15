import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../i18n';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇩🇿' },
];

interface LanguagePickerProps {
  compact?: boolean;
}

export function LanguagePicker({ compact }: LanguagePickerProps) {
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(false);

  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleSelect = async (code: string) => {
    setVisible(false);
    await changeLanguage(code);
  };

  if (compact) {
    return (
      <>
        <TouchableOpacity style={styles.compactBtn} onPress={() => setVisible(true)}>
          <Text style={styles.compactFlag}>{current.flag}</Text>
        </TouchableOpacity>
        <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>{i18n.language === 'ar' ? 'اختر اللغة' : i18n.language === 'fr' ? 'Choisir la langue' : 'Select Language'}</Text>
              {LANGUAGES.map(lang => (
                <TouchableOpacity key={lang.code} style={[styles.option, lang.code === i18n.language && styles.optionActive]} onPress={() => handleSelect(lang.code)}>
                  <Text style={styles.optionFlag}>{lang.flag}</Text>
                  <Text style={[styles.optionLabel, lang.code === i18n.language && styles.optionLabelActive]}>{lang.label}</Text>
                  {lang.code === i18n.language && <View style={styles.checkDot} />}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }

  return (
    <>
      <TouchableOpacity style={styles.row} onPress={() => setVisible(true)}>
        <Text style={styles.rowLabel}>{i18n.language === 'ar' ? 'اللغة' : i18n.language === 'fr' ? 'Langue' : 'Language'}</Text>
        <View style={styles.rowValue}>
          <Text style={styles.rowFlag}>{current.flag}</Text>
          <Text style={styles.rowText}>{current.label}</Text>
        </View>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{i18n.language === 'ar' ? 'اختر اللغة' : i18n.language === 'fr' ? 'Choisir la langue' : 'Select Language'}</Text>
            {LANGUAGES.map(lang => (
              <TouchableOpacity key={lang.code} style={[styles.option, lang.code === i18n.language && styles.optionActive]} onPress={() => handleSelect(lang.code)}>
                <Text style={styles.optionFlag}>{lang.flag}</Text>
                <Text style={[styles.optionLabel, lang.code === i18n.language && styles.optionLabelActive]}>{lang.label}</Text>
                {lang.code === i18n.language && <View style={styles.checkDot} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  compactBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  compactFlag: { fontSize: 18 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  sheet: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, width: '80%', maxWidth: 320 },
  sheetTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#2C1B18', marginBottom: 16, textAlign: 'center' },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, marginBottom: 4 },
  optionActive: { backgroundColor: '#FFF8F2' },
  optionFlag: { fontSize: 24, marginRight: 12 },
  optionLabel: { fontFamily: 'Poppins-Regular', fontSize: 15, color: '#2C1B18', flex: 1 },
  optionLabelActive: { fontFamily: 'Poppins-SemiBold' },
  checkDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#D4A373' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  rowLabel: { fontFamily: 'Poppins-Regular', fontSize: 15, color: '#2C1B18' },
  rowValue: { flexDirection: 'row', alignItems: 'center' },
  rowFlag: { fontSize: 18, marginRight: 8 },
  rowText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#8C7A77' },
});
