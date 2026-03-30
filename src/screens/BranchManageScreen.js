import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal,
} from 'react-native';
import { COLORS } from '../lib/constants';

const INITIAL_BRANCHES = [
  { id: '1', name: '용인백암점', ownerName: '전현무', phone: '010-2341-1234', startDate: '2026-03-30' },
];

export default function BranchManageScreen({ navigation }) {
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
      setBranches(prev => prev.map(b =>
        b.id === editBranch.id ? { ...b, ...form } : b
      ));
    } else {
      setBranches(prev => [...prev, { id: Date.now().toString(), ...form }]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    Alert.alert('삭제 확인', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => setBranches(prev => prev.filter(b => b.id !== id)) },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 검색 + 등록 */}
      <View style={styles.topRow}>
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="지점명 또는 점주 검색"
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
            autoComplete="off"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ 지점등록</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.countText}>전체 {filtered.length}개 지점</Text>

      {/* 지점 목록 */}
      <ScrollView>
        {filtered.map((branch) => (
          <View key={branch.id} style={styles.branchCard}>
            <View style={styles.branchInfo}>
              <Text style={styles.branchName}>{branch.name}</Text>
              <Text style={styles.branchDetail}>
                {branch.ownerName} · {branch.phone || '연락처 없음'}
              </Text>
              <Text style={styles.branchDate}>교육 시작일: {branch.startDate}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(branch)}>
                <Text style={styles.editBtnText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(branch.id)}>
                <Text style={styles.deleteBtnText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 등록/수정 모달 */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editBranch ? '지점 수정' : '신규 지점 등록'}
            </Text>

            <Text style={styles.label}>지점명 *</Text>
            <TextInput
              style={styles.input}
              placeholder="지점명을 입력하세요"
              value={form.name}
              onChangeText={(v) => setForm(f => ({ ...f, name: v }))}
              autoComplete="off"
              autoCorrect={false}
              spellCheck={false}
            />

            <Text style={styles.label}>점주 이름 *</Text>
            <TextInput
              style={styles.input}
              placeholder="점주 이름"
              value={form.ownerName}
              onChangeText={(v) => setForm(f => ({ ...f, ownerName: v }))}
            />

            <Text style={styles.label}>핸드폰 번호</Text>
            <TextInput
              style={styles.input}
              placeholder="010-0000-0000"
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
              <Text style={{ fontSize: 14, color: form.startDate ? COLORS.text : COLORS.textMuted }}>
                {form.startDate || '날짜를 선택하세요'}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  topRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, padding: 10, fontSize: 14, color: COLORS.text },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  countText: { fontSize: 12, color: COLORS.textLight, marginBottom: 12 },
  branchCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  branchInfo: { flex: 1 },
  branchName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  branchDetail: { fontSize: 13, color: COLORS.textLight, marginTop: 4 },
  branchDate: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  actions: { justifyContent: 'center', gap: 6 },
  editBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  editBtnText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  deleteBtn: {
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  deleteBtnText: { fontSize: 12, color: COLORS.danger, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 24,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.primary, marginBottom: 4, marginTop: 12 },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, color: COLORS.textLight, fontWeight: '600' },
  saveBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  saveBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
});
