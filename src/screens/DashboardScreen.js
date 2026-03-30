import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOW, CURRICULUM_STEPS } from '../lib/constants';

const MOCK_DATA = [
  { id: '1', name: '용인백암점', ownerName: '전현무', completedSteps: [1, 2], totalRecords: 5, avgScore: 5.7 },
  { id: '2', name: '안산초지동점', ownerName: '김민수', completedSteps: [1, 2, 3, 4], totalRecords: 12, avgScore: 7.8 },
];

function SummaryCard({ value, label, sub }) {
  return (
    <View style={sumStyles.card}>
      <Text style={sumStyles.value}>{value}</Text>
      <Text style={sumStyles.label}>{label}</Text>
      {sub && <Text style={sumStyles.sub}>{sub}</Text>}
    </View>
  );
}
const sumStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOW.md,
  },
  value: { fontSize: 28, fontWeight: '800', color: COLORS.textOnPrimary },
  label: { fontSize: 11, color: COLORS.textOnPrimaryMuted, marginTop: 2, letterSpacing: 0.5 },
  sub: { fontSize: 10, color: COLORS.textOnPrimaryMuted, marginTop: 2, opacity: 0.6 },
});

export default function DashboardScreen() {
  const totalBranches = MOCK_DATA.length;
  const avgProgress = Math.round(
    MOCK_DATA.reduce((sum, b) => sum + (b.completedSteps.length / CURRICULUM_STEPS.length) * 100, 0) / totalBranches
  );
  const totalRecords = MOCK_DATA.reduce((sum, b) => sum + b.totalRecords, 0);
  const avgScore = (MOCK_DATA.reduce((sum, b) => sum + b.avgScore, 0) / totalBranches).toFixed(1);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 요약 */}
      <View style={styles.summaryRow}>
        <SummaryCard value={totalBranches} label="교육 중 지점" />
        <SummaryCard value={`${avgProgress}%`} label="평균 진행률" />
      </View>
      <View style={styles.summaryRow}>
        <SummaryCard value={totalRecords} label="총 교육 기록" />
        <SummaryCard value={avgScore} label="평균 점수" sub="10점 만점" />
      </View>

      {/* 지점별 현황 */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionDot} />
        <Text style={styles.sectionTitle}>지점별 교육 진행 현황</Text>
      </View>

      {MOCK_DATA.map((branch) => {
        const pct = Math.round((branch.completedSteps.length / CURRICULUM_STEPS.length) * 100);
        return (
          <View key={branch.id} style={styles.branchCard}>
            <View style={styles.branchTop}>
              <View>
                <Text style={styles.branchName}>{branch.name}</Text>
                <Text style={styles.branchSub}>
                  {branch.ownerName} · 기록 {branch.totalRecords}건 · 평균 {branch.avgScore}점
                </Text>
              </View>
              <Text style={[
                styles.branchPct,
                pct >= 75 ? { color: COLORS.success } : pct >= 50 ? { color: COLORS.warning } : {},
              ]}>{pct}%</Text>
            </View>

            {/* 프로그레스 */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct}%` }]} />
            </View>

            {/* 단계별 */}
            <View style={styles.stepsGrid}>
              {CURRICULUM_STEPS.map((step) => {
                const done = branch.completedSteps.includes(step.id);
                return (
                  <View key={step.id} style={[styles.stepItem, done && styles.stepItemDone]}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: done ? COLORS.success : COLORS.textTertiary }}>{step.id}</Text>
                    <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>
                      {step.short}
                    </Text>
                    {done && <Text style={styles.stepCheck}>V</Text>}
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}

      <View style={{ height: SPACING.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: {
    padding: SPACING.lg,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.sm,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  branchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOW.sm,
  },
  branchTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  branchName: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  branchSub: { fontSize: 12, color: COLORS.textTertiary, marginTop: 4 },
  branchPct: { fontSize: 28, fontWeight: '800', color: COLORS.primary },
  progressTrack: {
    height: 5,
    backgroundColor: COLORS.backgroundWarm,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  stepsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.backgroundWarm,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  stepItemDone: {
    backgroundColor: COLORS.successBg,
  },
  stepIcon: { fontSize: 12 },
  stepLabel: { fontSize: 11, color: COLORS.textTertiary },
  stepLabelDone: { color: COLORS.success, fontWeight: '600' },
  stepCheck: { fontSize: 10, color: COLORS.success, fontWeight: '700' },
});
