import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Modal, FlatList,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOW, CURRICULUM_STEPS } from '../lib/constants';

const MOCK_BRANCHES = [
  { id: '1', name: '용인백암점' },
  { id: '2', name: '안산초지동자동차매매단지점' },
];

function Dropdown({ label, value, placeholder, options, onSelect, required }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.fieldGroup}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <TouchableOpacity
        style={[styles.dropdownBtn, value && styles.dropdownBtnFilled]}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={value ? styles.dropdownText : styles.dropdownPlaceholder}>
          {value || placeholder || '선택하세요'}
        </Text>
        <Text style={styles.dropdownChevron}>▾</Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{label || '선택'}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => { onSelect(item); setVisible(false); }}
                  activeOpacity={0.7}
                >
                  {item.icon && <Text style={styles.modalItemIcon}>{item.icon}</Text>}
                  <Text style={styles.modalItemText}>{item.label || item.name}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.modalDivider} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default function EducationRecordScreen({ navigation }) {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [ownerName, setOwnerName] = useState('');
  const [selectedStep, setSelectedStep] = useState(null);
  const [passed, setPassed] = useState(null);
  const [ownerComment, setOwnerComment] = useState('');
  const [svComment, setSvComment] = useState('');

  const handleSave = () => {
    if (!selectedBranch || !ownerName || !selectedStep || passed === null) {
      Alert.alert('알림', '필수 항목을 모두 입력해주세요.');
      return;
    }
    Alert.alert('완료', '교육 기록이 저장되었습니다.', [
      { text: '확인', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 지점 선택 */}
      <Dropdown
        label="지점"
        required
        placeholder="지점 선택"
        value={selectedBranch?.name}
        options={MOCK_BRANCHES.map(b => ({ ...b, label: b.name }))}
        onSelect={(item) => setSelectedBranch(item)}
      />

      {/* 점주 이름 */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          점주 이름 <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="점주 이름을 입력하세요"
          placeholderTextColor={COLORS.textTertiary}
          value={ownerName}
          onChangeText={setOwnerName}
          autoCorrect={false}
          spellCheck={false}
        />
      </View>

      {/* 커리큘럼 단계 */}
      <Dropdown
        label="커리큘럼 단계"
        required
        placeholder="단계 선택"
        value={selectedStep?.label}
        options={CURRICULUM_STEPS}
        onSelect={setSelectedStep}
      />

      {/* 이수 여부 */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          이수 여부 <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.passRow}>
          <TouchableOpacity
            style={[
              styles.passBtn,
              passed === true && styles.passBtnActive,
            ]}
            onPress={() => setPassed(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.passIcon}>✓</Text>
            <Text style={[
              styles.passBtnText,
              passed === true && styles.passBtnTextActive,
            ]}>이수 완료</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.passBtn,
              passed === false && styles.failBtnActive,
            ]}
            onPress={() => setPassed(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.failIcon}>✗</Text>
            <Text style={[
              styles.passBtnText,
              passed === false && styles.failBtnTextActive,
            ]}>미이수</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 점주 코멘트 */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>점주 코멘트</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="점주의 교육 피드백을 입력하세요"
          placeholderTextColor={COLORS.textTertiary}
          value={ownerComment}
          onChangeText={setOwnerComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* SV 코멘트 */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>SV 코멘트</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="교육 내용 요약 및 특이사항을 입력하세요"
          placeholderTextColor={COLORS.textTertiary}
          value={svComment}
          onChangeText={setSvComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* 저장 */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        <Text style={styles.saveBtnText}>기록 저장</Text>
      </TouchableOpacity>

      <View style={{ height: SPACING.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: {
    padding: SPACING.xl,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  fieldGroup: { marginBottom: SPACING.xl },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  required: { color: COLORS.danger },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    fontSize: 15,
    color: COLORS.text,
  },
  textArea: { minHeight: 100 },
  dropdownBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownBtnFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  dropdownText: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  dropdownPlaceholder: { fontSize: 15, color: COLORS.textTertiary },
  dropdownChevron: { fontSize: 14, color: COLORS.textTertiary },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '70%',
    paddingBottom: SPACING.xxxl,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  modalItemIcon: { fontSize: 18, marginRight: SPACING.md },
  modalItemText: { fontSize: 15, color: COLORS.text },
  modalDivider: { height: 1, backgroundColor: COLORS.borderLight, marginHorizontal: SPACING.xl },
  passRow: { flexDirection: 'row', gap: SPACING.md },
  passBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    gap: SPACING.sm,
  },
  passBtnActive: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.success,
  },
  failBtnActive: {
    backgroundColor: COLORS.dangerBg,
    borderColor: COLORS.danger,
  },
  passIcon: { fontSize: 16, color: COLORS.textTertiary },
  failIcon: { fontSize: 16, color: COLORS.textTertiary },
  passBtnText: { fontSize: 15, color: COLORS.textTertiary, fontWeight: '600' },
  passBtnTextActive: { color: COLORS.success },
  failBtnTextActive: { color: COLORS.danger },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 18,
    alignItems: 'center',
    ...SHADOW.md,
  },
  saveBtnText: {
    color: COLORS.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
