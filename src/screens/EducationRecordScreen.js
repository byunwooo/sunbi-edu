import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Modal, FlatList,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOW, CURRICULUM_STEPS } from '../lib/constants';

// TODO: Supabase에서 로드 (지점관리에서 등록한 데이터)
const MOCK_BRANCHES = [
  { id: '1', name: '용인백암점', ownerName: '전현무', lastStep: 2 },
  { id: '2', name: '안산초지동자동차매매단지점', ownerName: '김민수', lastStep: 1 },
];

function Dropdown({ label, value, placeholder, options, onSelect, required, disabled }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.fieldGroup}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <TouchableOpacity
        style={[styles.dropdownBtn, value && styles.dropdownBtnFilled, disabled && styles.dropdownDisabled]}
        onPress={() => !disabled && setVisible(true)}
        activeOpacity={disabled ? 1 : 0.8}
      >
        <Text style={value ? styles.dropdownText : styles.dropdownPlaceholder}>
          {value || placeholder || '선택하세요'}
        </Text>
        <Text style={styles.dropdownChevron}>v</Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{label || '선택'}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, item.disabled && { opacity: 0.4 }]}
                  onPress={() => { if (!item.disabled) { onSelect(item); setVisible(false); } }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalItemText}>{item.label || item.name}</Text>
                  {item.sub && <Text style={styles.modalItemSub}>{item.sub}</Text>}
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
  const [score, setScore] = useState(null);
  const [ownerComment, setOwnerComment] = useState('');
  const [svComment, setSvComment] = useState('');

  // #3: 지점 선택 시 점주 이름 자동 입력
  const handleBranchSelect = (item) => {
    const branch = MOCK_BRANCHES.find(b => b.id === item.id);
    setSelectedBranch(branch);
    setOwnerName(branch?.ownerName || '');
    setSelectedStep(null);
    setPassed(null);
    setScore(null);
  };

  // #5: 미이수 시 다음 단계 차단 — 현재 지점의 마지막 이수 단계 이후만 선택 가능
  const getAvailableSteps = () => {
    if (!selectedBranch) return CURRICULUM_STEPS;
    const lastStep = selectedBranch.lastStep || 0;
    return CURRICULUM_STEPS.map(step => ({
      ...step,
      disabled: step.id > lastStep + 1,
      sub: step.id <= lastStep ? '이수 완료' : step.id === lastStep + 1 ? '현재 단계' : '이전 단계 이수 필요',
    }));
  };

  const handleSave = () => {
    if (!selectedBranch || !selectedStep || passed === null) {
      Alert.alert('알림', '필수 항목을 모두 입력해주세요.');
      return;
    }
    if (passed === true && score === null) {
      Alert.alert('알림', '점수를 선택해주세요.');
      return;
    }
    // #6: 저장 후 메인화면으로
    Alert.alert('완료', '교육 기록이 저장되었습니다.', [
      { text: '확인', onPress: () => navigation.navigate('Main') },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* 지점 선택 */}
      <Dropdown
        label="지점"
        required
        placeholder="지점 선택"
        value={selectedBranch?.name}
        options={MOCK_BRANCHES.map(b => ({ ...b, label: b.name }))}
        onSelect={handleBranchSelect}
      />

      {/* 점주 이름 — 자동 입력, 읽기 전용 */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>점주 이름</Text>
        <View style={[styles.input, styles.readOnlyInput]}>
          <Text style={{ fontSize: 15, color: ownerName ? COLORS.text : COLORS.textTertiary }}>
            {ownerName || '지점을 선택하면 자동 입력됩니다'}
          </Text>
        </View>
      </View>

      {/* 커리큘럼 단계 */}
      <Dropdown
        label="커리큘럼 단계"
        required
        placeholder="단계 선택"
        value={selectedStep?.label}
        options={getAvailableSteps()}
        onSelect={setSelectedStep}
        disabled={!selectedBranch}
      />

      {/* 이수 여부 */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          이수 여부 <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.passRow}>
          <TouchableOpacity
            style={[styles.passBtn, passed === true && styles.passBtnActive]}
            onPress={() => { setPassed(true); setScore(null); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.passBtnText, passed === true && styles.passBtnTextActive]}>
              O  이수 완료
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.passBtn, passed === false && styles.failBtnActive]}
            onPress={() => { setPassed(false); setScore(null); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.passBtnText, passed === false && styles.failBtnTextActive]}>
              X  미이수
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* #4: 이수 완료 시 점수 선택 (1~5점) */}
      {passed === true && (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            점수 <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.scoreRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.scoreBtn, score === n && styles.scoreBtnActive]}
                onPress={() => setScore(n)}
                activeOpacity={0.8}
              >
                <Text style={[styles.scoreBtnText, score === n && styles.scoreBtnTextActive]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.scoreHint}>1점 (미흡) ~ 5점 (우수)</Text>
        </View>
      )}

      {/* 미이수 시 안내 */}
      {passed === false && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>미이수 처리 시 다음 단계로 넘어갈 수 없습니다. 해당 단계를 재교육 후 이수 완료로 변경해주세요.</Text>
        </View>
      )}

      {/* 점주 코멘트 */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>점주 코멘트</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="점주의 교육 피드백을 입력하세요"
          placeholderTextColor={COLORS.textTertiary}
          value={ownerComment}
          onChangeText={setOwnerComment}
          multiline numberOfLines={4} textAlignVertical="top"
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
          multiline numberOfLines={4} textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        <Text style={styles.saveBtnText}>기록 저장</Text>
      </TouchableOpacity>
      <View style={{ height: SPACING.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl, maxWidth: 600, width: '100%', alignSelf: 'center' },
  fieldGroup: { marginBottom: SPACING.xl },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: SPACING.sm, letterSpacing: 0.3 },
  required: { color: COLORS.danger },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.lg, fontSize: 15, color: COLORS.text },
  readOnlyInput: { backgroundColor: COLORS.backgroundWarm, justifyContent: 'center' },
  textArea: { minHeight: 100 },
  dropdownBtn: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropdownBtnFilled: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
  dropdownDisabled: { opacity: 0.5 },
  dropdownText: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  dropdownPlaceholder: { fontSize: 15, color: COLORS.textTertiary },
  dropdownChevron: { fontSize: 14, color: COLORS.textTertiary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, maxHeight: '70%', paddingBottom: SPACING.xxxl },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: SPACING.md, marginBottom: SPACING.lg },
  modalTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, paddingHorizontal: SPACING.xl, marginBottom: SPACING.md },
  modalItem: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl },
  modalItemText: { fontSize: 15, color: COLORS.text },
  modalItemSub: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  modalDivider: { height: 1, backgroundColor: COLORS.borderLight, marginHorizontal: SPACING.xl },
  passRow: { flexDirection: 'row', gap: SPACING.md },
  passBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingVertical: 16 },
  passBtnActive: { backgroundColor: COLORS.successBg, borderColor: COLORS.success },
  failBtnActive: { backgroundColor: COLORS.dangerBg, borderColor: COLORS.danger },
  passBtnText: { fontSize: 15, color: COLORS.textTertiary, fontWeight: '600' },
  passBtnTextActive: { color: COLORS.success },
  failBtnTextActive: { color: COLORS.danger },
  scoreRow: { flexDirection: 'row', gap: SPACING.sm },
  scoreBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingVertical: 14 },
  scoreBtnActive: { backgroundColor: COLORS.primaryGlow, borderColor: COLORS.primary },
  scoreBtnText: { fontSize: 18, fontWeight: '700', color: COLORS.textTertiary },
  scoreBtnTextActive: { color: COLORS.primary },
  scoreHint: { fontSize: 11, color: COLORS.textTertiary, marginTop: SPACING.sm, textAlign: 'center' },
  warningBox: { backgroundColor: COLORS.warningBg, borderRadius: RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.xl },
  warningText: { fontSize: 13, color: COLORS.warning, lineHeight: 20 },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 18, alignItems: 'center', ...SHADOW.md },
  saveBtnText: { color: COLORS.textOnPrimary, fontSize: 16, fontWeight: '700' },
});
