import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, FlatList,
} from 'react-native';
import { COLORS, CURRICULUM_STEPS } from '../lib/constants';

// TODO: Supabase에서 로드
const MOCK_BRANCHES = [
  { id: '1', name: '용인백암점' },
  { id: '2', name: '안산초지동자동차매매단지점' },
];

function Dropdown({ label, value, options, onSelect, required }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.field}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <TouchableOpacity style={styles.dropdown} onPress={() => setVisible(true)}>
        <Text style={value ? styles.dropdownText : styles.dropdownPlaceholder}>
          {value || '단계 선택'}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => { onSelect(item); setVisible(false); }}
                >
                  <Text style={styles.modalItemText}>{item.label || item.name}</Text>
                </TouchableOpacity>
              )}
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
  const [passed, setPassed] = useState(null); // true / false
  const [ownerComment, setOwnerComment] = useState('');
  const [svComment, setSvComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedBranch || !ownerName || !selectedStep || passed === null) {
      Alert.alert('알림', '필수 항목을 모두 입력해주세요.');
      return;
    }

    // TODO: Supabase에 저장
    const record = {
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      ownerName,
      stepId: selectedStep.id,
      stepLabel: selectedStep.label,
      passed,
      ownerComment,
      svComment,
      createdAt: new Date().toISOString(),
    };

    console.log('저장할 데이터:', record);
    Alert.alert('완료', '교육 기록이 저장되었습니다.', [
      { text: '확인', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 지점 선택 */}
      <Dropdown
        label=""
        value={selectedBranch?.name}
        options={MOCK_BRANCHES.map(b => ({ id: b.id, label: b.name, name: b.name }))}
        onSelect={(item) => setSelectedBranch({ id: item.id, name: item.name })}
      />

      {/* 점주 이름 */}
      <View style={styles.field}>
        <Text style={styles.label}>
          점주 이름 <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="점주 이름"
          placeholderTextColor={COLORS.textMuted}
          value={ownerName}
          onChangeText={setOwnerName}
        />
      </View>

      {/* 커리큘럼 단계 */}
      <Dropdown
        label="커리큘럼 단계"
        required
        value={selectedStep?.label}
        options={CURRICULUM_STEPS}
        onSelect={setSelectedStep}
      />

      {/* 이수 여부 */}
      <View style={styles.field}>
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
          >
            <Text style={[
              styles.passBtnText,
              passed === true && styles.passBtnTextActive,
            ]}>
              ✓ 이수 완료
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.passBtn,
              passed === false && styles.failBtnActive,
            ]}
            onPress={() => setPassed(false)}
          >
            <Text style={[
              styles.passBtnText,
              passed === false && styles.failBtnTextActive,
            ]}>
              ✗ 미이수
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 점주 코멘트 */}
      <View style={styles.field}>
        <Text style={styles.label}>점주 코멘트</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="점주의 교육 피드백"
          placeholderTextColor={COLORS.textMuted}
          value={ownerComment}
          onChangeText={setOwnerComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* SV 코멘트 */}
      <View style={styles.field}>
        <Text style={styles.label}>SV 코멘트</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="교육 내용 요약 및 특이사항"
          placeholderTextColor={COLORS.textMuted}
          value={svComment}
          onChangeText={setSvComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity
        style={[styles.saveBtn, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveBtnText}>기록 저장</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  field: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.primary, marginBottom: 6 },
  required: { color: COLORS.danger },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  textArea: { minHeight: 100 },
  dropdown: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: { fontSize: 15, color: COLORS.text },
  dropdownPlaceholder: { fontSize: 15, color: COLORS.textMuted },
  dropdownArrow: { fontSize: 12, color: COLORS.textMuted },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 32,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    maxHeight: 400,
    overflow: 'hidden',
  },
  modalItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalItemText: { fontSize: 15, color: COLORS.text },
  passRow: { flexDirection: 'row', gap: 12 },
  passBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  passBtnActive: {
    backgroundColor: '#e8f5e9',
    borderColor: COLORS.success,
  },
  failBtnActive: {
    backgroundColor: '#fde8e8',
    borderColor: COLORS.danger,
  },
  passBtnText: { fontSize: 15, color: COLORS.textLight, fontWeight: '600' },
  passBtnTextActive: { color: COLORS.success },
  failBtnTextActive: { color: COLORS.danger },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
