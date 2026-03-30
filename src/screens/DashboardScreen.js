import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, CURRICULUM_STEPS } from '../lib/constants';

// TODO: Supabase에서 실제 데이터 로드
const MOCK_DATA = [
  {
    id: '1',
    name: '용인백암점',
    ownerName: '전현무',
    completedSteps: [1, 2],
    totalRecords: 5,
    avgScore: 5.7,
  },
  {
    id: '2',
    name: '안산초지동점',
    ownerName: '김민수',
    completedSteps: [1, 2, 3, 4],
    totalRecords: 12,
    avgScore: 7.8,
  },
];

export default function DashboardScreen() {
  const totalBranches = MOCK_DATA.length;
  const avgProgress = Math.round(
    MOCK_DATA.reduce((sum, b) => sum + (b.completedSteps.length / CURRICULUM_STEPS.length) * 100, 0) / totalBranches
  );
  const totalRecords = MOCK_DATA.reduce((sum, b) => sum + b.totalRecords, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 요약 카드 */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalBranches}</Text>
          <Text style={styles.summaryLabel}>교육 중 지점</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{avgProgress}%</Text>
          <Text style={styles.summaryLabel}>평균 진행률</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalRecords}</Text>
          <Text style={styles.summaryLabel}>총 교육 기록</Text>
        </View>
      </View>

      {/* 지점별 현황 */}
      <Text style={styles.sectionTitle}>지점별 교육 진행 현황</Text>

      {MOCK_DATA.map((branch) => {
        const pct = Math.round((branch.completedSteps.length / CURRICULUM_STEPS.length) * 100);
        return (
          <View key={branch.id} style={styles.branchCard}>
            <View style={styles.branchHeader}>
              <Text style={styles.branchName}>{branch.name}</Text>
              <Text style={[styles.pctText, pct >= 100 && { color: COLORS.success }]}>{pct}%</Text>
            </View>
            <Text style={styles.branchSub}>
              {branch.ownerName} · 기록 {branch.totalRecords}건 · 평균 {branch.avgScore}점
            </Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
            </View>

            {/* 단계별 체크 */}
            <View style={styles.stepsGrid}>
              {CURRICULUM_STEPS.map((step) => {
                const done = branch.completedSteps.includes(step.id);
                return (
                  <View key={step.id} style={[styles.stepChip, done && styles.stepChipDone]}>
                    <Text style={[styles.stepChipText, done && styles.stepChipTextDone]}>
                      {step.id}단계 {done ? '✓' : ''}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryValue: { fontSize: 24, fontWeight: '700', color: COLORS.white },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  branchCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  branchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  branchName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  pctText: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
  branchSub: { fontSize: 12, color: COLORS.textLight, marginTop: 4, marginBottom: 10 },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  stepsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  stepChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  stepChipDone: {
    backgroundColor: '#e8f5e9',
    borderColor: COLORS.success,
  },
  stepChipText: { fontSize: 11, color: COLORS.textLight },
  stepChipTextDone: { color: COLORS.success, fontWeight: '600' },
});
