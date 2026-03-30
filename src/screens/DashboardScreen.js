import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOW, CURRICULUM_STEPS } from '../lib/constants';

const MOCK_DATA = [
  { id: '1', name: '용인백암점', ownerName: '전현무', completedSteps: [1, 2], totalRecords: 5, avgScore: 3.8 },
  { id: '2', name: '안산초지동점', ownerName: '김민수', completedSteps: [1, 2, 3, 4, 5, 6, 7, 8], totalRecords: 20, avgScore: 4.5 },
  { id: '3', name: '수원광교점', ownerName: '이영희', completedSteps: [1, 2, 3, 4], totalRecords: 12, avgScore: 4.1 },
];

function BranchCard({ branch }) {
  const pct = Math.round((branch.completedSteps.length / CURRICULUM_STEPS.length) * 100);
  const isComplete = pct >= 100;
  return (
    <View style={[styles.branchCard, isComplete && styles.branchCardComplete]}>
      <View style={styles.branchTop}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
            <Text style={styles.branchName}>{branch.name}</Text>
            {isComplete && (
              <View style={styles.completeBadge}>
                <Text style={styles.completeBadgeText}>완료</Text>
              </View>
            )}
          </View>
          <Text style={styles.branchSub}>
            {branch.ownerName} / 기록 {branch.totalRecords}건 / 평균 {branch.avgScore}점
          </Text>
        </View>
        <Text style={[styles.branchPct, isComplete && { color: COLORS.success }]}>{pct}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%` }, isComplete && { backgroundColor: COLORS.success }]} />
      </View>
      <View style={styles.stepsGrid}>
        {CURRICULUM_STEPS.map((step) => {
          const done = branch.completedSteps.includes(step.id);
          return (
            <View key={step.id} style={[styles.stepItem, done && styles.stepItemDone]}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: done ? COLORS.success : COLORS.textTertiary }}>{step.id}</Text>
              <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{step.short}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all'); // 'all', 'progress', 'complete'

  const filtered = MOCK_DATA.filter(b => {
    const matchSearch = b.name.includes(search) || b.ownerName.includes(search);
    if (tab === 'progress') return matchSearch && b.completedSteps.length < CURRICULUM_STEPS.length;
    if (tab === 'complete') return matchSearch && b.completedSteps.length >= CURRICULUM_STEPS.length;
    return matchSearch;
  });

  const completedCount = MOCK_DATA.filter(b => b.completedSteps.length >= CURRICULUM_STEPS.length).length;
  const progressCount = MOCK_DATA.filter(b => b.completedSteps.length < CURRICULUM_STEPS.length).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* 요약 */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{MOCK_DATA.length}</Text>
          <Text style={styles.summaryLabel}>전체 지점</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: COLORS.success }]}>
          <Text style={styles.summaryValue}>{completedCount}</Text>
          <Text style={styles.summaryLabel}>교육 완료</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{progressCount}</Text>
          <Text style={styles.summaryLabel}>진행 중</Text>
        </View>
      </View>

      {/* 검색 */}
      <TextInput
        style={styles.searchInput}
        placeholder="지점명 또는 점주 검색"
        placeholderTextColor={COLORS.textTertiary}
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
        spellCheck={false}
      />

      {/* 탭 */}
      <View style={styles.tabRow}>
        {[
          { key: 'all', label: '전체' },
          { key: 'progress', label: '진행 중' },
          { key: 'complete', label: '완료' },
        ].map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
            onPress={() => setTab(t.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 목록 */}
      <Text style={styles.resultCount}>{filtered.length}개 지점</Text>

      {filtered.map(branch => <BranchCard key={branch.id} branch={branch} />)}

      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
        </View>
      )}

      <View style={{ height: SPACING.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, maxWidth: 600, width: '100%', alignSelf: 'center' },
  summaryRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  summaryCard: { flex: 1, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', ...SHADOW.md },
  summaryValue: { fontSize: 26, fontWeight: '800', color: COLORS.textOnPrimary },
  summaryLabel: { fontSize: 11, color: COLORS.textOnPrimaryMuted, marginTop: 2 },
  searchInput: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.lg, fontSize: 14, color: COLORS.text, marginBottom: SPACING.md },
  tabRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  tabBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.md, alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.borderLight },
  tabBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textTertiary },
  tabTextActive: { color: COLORS.textOnPrimary },
  resultCount: { fontSize: 12, color: COLORS.textTertiary, marginBottom: SPACING.md },
  branchCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOW.sm },
  branchCardComplete: { borderColor: COLORS.success, borderWidth: 1.5 },
  branchTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  branchName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  branchSub: { fontSize: 12, color: COLORS.textTertiary, marginTop: 4 },
  branchPct: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  completeBadge: { backgroundColor: COLORS.successBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full },
  completeBadgeText: { fontSize: 11, fontWeight: '600', color: COLORS.success },
  progressTrack: { height: 4, backgroundColor: COLORS.backgroundWarm, borderRadius: 2, overflow: 'hidden', marginBottom: SPACING.lg },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  stepsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.backgroundWarm, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  stepItemDone: { backgroundColor: COLORS.successBg },
  stepLabel: { fontSize: 11, color: COLORS.textTertiary },
  stepLabelDone: { color: COLORS.success, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyText: { fontSize: 14, color: COLORS.textTertiary },
});
