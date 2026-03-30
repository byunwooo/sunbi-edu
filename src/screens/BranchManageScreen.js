import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../lib/constants';

const INITIAL_BRANCHES = [
  { id: '1', name: '용인백암점', ownerName: '전현무', phone: '010-2341-1234', startDate: '2026-03-30' },
];

export default function BranchManageScreen() {
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [form, setForm] = useState({ name: '', ownerName: '', phone: '', startDate: '' });

  const filtered = branches.filter(
    (b) => b.name.includes(search) || b.ownerName.includes(search)
  );

  const openAdd = () => {
    setEditBranch(null);
    setForm({ name: '', ownerName: '', phone: '', startDate: new Date().toISOString().slice(0, 10) });
    setModalVisible(true);
  };

  const openEdit = (branch) => {
    setEditBranch(branch);
    setForm({ name: branch.name, ownerName: branch.ownerName, phone: branch.phone, startDate: branch.startDate });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.name || !form.ownerName) {
      Alert.alert('알림', '지점명과 점주 이름은 필수입니다.');
      return;
    }
    if (editBranch) {
      setBranches(prev => prev.map(b => b.id === editBranch.id ? { ...b, ...form } : b));
    } else {
      setBranches(prev => [...prev, { id: Date.now().toString(), ...form }]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    Alert.alert('삭제 확인', '이 지점을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => setBranches(prev => prev.filter(b => b.id !== id)) },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 검색 + 등록 */}
      <View style={styles.topBar}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color={COLORS.textTertiary} style={{ marginRight: SPACING.sm }} />
          <TextInput
            style={styles.searchInput}
            placeholder="지점명 또는 점주 검색"
            placeholderTextColor={COLORS.textTertiary}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd} activeOpacity={0.85}>
          <Text style={styles.addBtnText}>+ 지점등록</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.countText}>
        전체 <Text style={{ fontWeight: '700', color: COLORS.text }}>{filtered.length}개</Text> 지점
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.map((branch) => (
          <View key={branch.id} style={styles.branchCard}>
            <View style={styles.branchInfo}>
              <Text style={styles.branchName}>{branch.name}</Text>
              <View style={styles.branchMetaRow}>
                <Text style={styles.branchMeta}>{branch.ownerName}</Text>
                <Text style={styles.branchMetaDot}>·</Text>
                <Text style={styles.branchMeta}>{branch.phone || '연락처 없음'}</Text>
              </View>
              <View style={styles.branchDateRow}>
                <Text style={styles.branchDateLabel}>교육 시작일</Text>
                <Text style={styles.branchDate}>{branch.startDate}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(branch)} activeOpacity={0.8}>
                <Text style={styles.editBtnText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(branch.id)} activeOpacity={0.8}>
                <Text style={styles.deleteBtnText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={COLORS.textTertiary} style={{ opacity: 0.3, marginBottom: SPACING.lg }} />
            <Text style={styles.emptyText}>등록된 지점이 없습니다</Text>
            <Text style={styles.emptyDesc}>상단의 '+ 지점등록' 버튼으로 추가하세요</Text>
          </View>
        )}
      </ScrollView>

      {/* 등록/수정 모달 */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {editBranch ? '지점 수정' : '신규 지점 등록'}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>지점명 <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="지점명을 입력하세요"
                placeholderTextColor={COLORS.textTertiary}
                value={form.name}
                onChangeText={(v) => setForm(f => ({ ...f, name: v }))}
                autoCorrect={false}
                spellCheck={false}
              />

              <Text style={styles.label}>점주 이름 <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="점주 이름을 입력하세요"
                placeholderTextColor={COLORS.textTertiary}
                value={form.ownerName}
                onChangeText={(v) => setForm(f => ({ ...f, ownerName: v }))}
                autoCorrect={false}
                spellCheck={false}
              />

              <Text style={styles.label}>핸드폰 번호</Text>
              <TextInput
                style={styles.input}
                placeholder="010-0000-0000"
                placeholderTextColor={COLORS.textTertiary}
                value={form.phone}
                onChangeText={(v) => setForm(f => ({ ...f, phone: v }))}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>교육 시작일</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  const el = document.createElement('input');
                  el.type = 'date';
                  el.value = form.startDate || new Date().toISOString().slice(0, 10);
                  el.style.position = 'fixed';
                  el.style.opacity = '0';
                  document.body.appendChild(el);
                  el.showPicker?.();
                  el.addEventListener('change', (e) => {
                    setForm(f => ({ ...f, startDate: e.target.value }));
                    document.body.removeChild(el);
                  });
                  el.addEventListener('blur', () => {
                    if (document.body.contains(el)) document.body.removeChild(el);
                  });
                }}
              >
                <Text style={{ fontSize: 15, color: form.startDate ? COLORS.text : COLORS.textTertiary }}>
                  {form.startDate || '날짜를 선택하세요'}
                </Text>
              </TouchableOpacity>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)} activeOpacity={0.8}>
                  <Text style={styles.cancelBtnText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
                  <Text style={styles.saveBtnText}>저장</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  topBar: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  searchIcon: { fontSize: 14, marginRight: SPACING.sm, opacity: 0.5 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: COLORS.text },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    ...SHADOW.sm,
  },
  addBtnText: { color: COLORS.textOnPrimary, fontWeight: '700', fontSize: 13 },
  countText: { fontSize: 12, color: COLORS.textTertiary, marginBottom: SPACING.md },
  branchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOW.sm,
  },
  branchInfo: { flex: 1 },
  branchName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  branchMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm },
  branchMeta: { fontSize: 13, color: COLORS.textTertiary },
  branchMetaDot: { marginHorizontal: SPACING.sm, color: COLORS.textTertiary },
  branchDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    backgroundColor: COLORS.backgroundWarm,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  branchDateLabel: { fontSize: 11, color: COLORS.textTertiary, marginRight: SPACING.xs },
  branchDate: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  actions: { justifyContent: 'center', gap: SPACING.sm },
  editBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  editBtnText: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },
  deleteBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  deleteBtnText: { fontSize: 12, color: COLORS.danger, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxxl * 2 },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.lg, opacity: 0.3 },
  emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary },
  emptyDesc: { fontSize: 13, color: COLORS.textTertiary, marginTop: SPACING.sm },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  required: { color: COLORS.danger },
  input: {
    backgroundColor: COLORS.backgroundWarm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    fontSize: 15,
    color: COLORS.text,
  },
  modalActions: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xxl },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, color: COLORS.textTertiary, fontWeight: '600' },
  saveBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
    ...SHADOW.sm,
  },
  saveBtnText: { color: COLORS.textOnPrimary, fontSize: 15, fontWeight: '700' },
});
