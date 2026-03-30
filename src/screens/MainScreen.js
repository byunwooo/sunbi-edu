import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS, SHADOW, CURRICULUM_STEPS } from '../lib/constants';

const MOCK_BRANCHES = [
  {
    id: '1',
    name: '용인백암점',
    ownerName: '전현무',
    records: [
      { step: 1, passed: true, score: 4 },
      { step: 1, passed: true, score: 4 },
      { step: 2, passed: true, score: 9 },
    ],
  },
];

function getCompletedSteps(records) {
  return new Set(records.filter(r => r.passed).map(r => r.step)).size;
}

function getToday() {
  const d = new Date();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${weekdays[d.getDay()]}요일`;
}

function StatPill({ value, label, accent }) {
  return (
    <View style={[statStyles.pill, accent && { backgroundColor: COLORS.primaryGlow }]}>
      <Text style={[statStyles.value, accent && { color: COLORS.primary }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  pill: {
    flex: 1,
    backgroundColor: COLORS.backgroundWarm,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
  },
  value: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  label: { fontSize: 10, color: COLORS.textTertiary, marginTop: 2, letterSpacing: 0.5 },
});

export default function MainScreen({ navigation }) {
  const [branches] = useState(MOCK_BRANCHES);

  const totalSteps = branches.reduce((sum, b) => sum + getCompletedSteps(b.records), 0);
  const totalRecords = branches.reduce((sum, b) => sum + b.records.length, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.dateText}>{getToday()}</Text>
            <Text style={styles.greeting}>안녕하세요 👋</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 빠른 통계 */}
        <View style={styles.statsRow}>
          <StatPill value={branches.length} label="교육 중" accent />
          <StatPill value={totalSteps} label="이수 단계" />
          <StatPill value={totalRecords} label="총 기록" />
        </View>

        {/* 메뉴 카드 */}
        <TouchableOpacity
          style={styles.primaryCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('EducationRecord')}
        >
          <View style={styles.primaryCardBg} />
          <View style={styles.primaryCardContent}>
            <View style={styles.primaryCardIcon}>
              <Text style={{ fontSize: 22 }}>📝</Text>
            </View>
            <View style={styles.primaryCardText}>
              <Text style={styles.primaryCardTitle}>교육 기록 입력</Text>
              <Text style={styles.primaryCardDesc}>지점별 교육 내용 및 평가 기록</Text>
            </View>
            <Text style={styles.primaryCardArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('BranchManage')}
          >
            <View style={styles.menuCardIconWrap}>
              <Text style={{ fontSize: 20 }}>🏪</Text>
            </View>
            <Text style={styles.menuCardTitle}>지점 관리</Text>
            <Text style={styles.menuCardDesc}>등록 및 목록 관리</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <View style={styles.menuCardIconWrap}>
              <Text style={{ fontSize: 20 }}>📊</Text>
            </View>
            <Text style={styles.menuCardTitle}>전체 현황</Text>
            <Text style={styles.menuCardDesc}>진행률 & 분석</Text>
          </TouchableOpacity>
        </View>

        {/* 교육 현황 */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionDot} />
          <Text style={styles.sectionTitle}>현재 교육 현황</Text>
          <Text style={styles.sectionBadge}>{branches.length}개 지점</Text>
        </View>

        {branches.map((branch) => {
          const completed = getCompletedSteps(branch.records);
          const pct = Math.round((completed / CURRICULUM_STEPS.length) * 100);
          return (
            <View key={branch.id} style={styles.branchCard}>
              <View style={styles.branchTop}>
                <View>
                  <Text style={styles.branchName}>{branch.name}</Text>
                  <Text style={styles.branchMeta}>
                    {branch.ownerName} · 오늘 {branch.records.length}건
                  </Text>
                </View>
                <View style={styles.branchPctWrap}>
                  <Text style={[
                    styles.branchPct,
                    pct >= 100 ? { color: COLORS.success } : pct >= 50 ? { color: COLORS.warning } : {},
                  ]}>{pct}%</Text>
                  <Text style={styles.branchSteps}>{completed}/{CURRICULUM_STEPS.length}단계</Text>
                </View>
              </View>

              {/* 프로그레스 바 */}
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${pct}%` }]} />
              </View>

              {/* 단계 칩 */}
              <View style={styles.stepsRow}>
                {CURRICULUM_STEPS.map((step) => {
                  const done = branch.records.some(r => r.step === step.id && r.passed);
                  return (
                    <View key={step.id} style={[styles.stepChip, done && styles.stepChipDone]}>
                      <Text style={[styles.stepChipText, done && styles.stepChipTextDone]}>
                        {step.icon}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* 최근 기록 */}
              {branch.records.slice(0, 3).map((rec, i) => {
                const step = CURRICULUM_STEPS.find(s => s.id === rec.step);
                return (
                  <View key={i} style={styles.recordItem}>
                    <View style={[
                      styles.recordDot,
                      { backgroundColor: rec.passed ? COLORS.success : COLORS.danger },
                    ]} />
                    <Text style={styles.recordLabel}>{step?.short}</Text>
                    <Text style={styles.recordStatus}>
                      {rec.passed ? '이수' : '미이수'}
                    </Text>
                    <Text style={styles.recordScore}>{rec.score}점</Text>
                  </View>
                );
              })}
            </View>
          );
        })}

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...SHADOW.sm,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.lg,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  dateText: { fontSize: 12, color: COLORS.textTertiary, letterSpacing: 0.3 },
  greeting: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginTop: 2 },
  logoutBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: COLORS.surface,
  },
  logoutText: { fontSize: 12, color: COLORS.textTertiary, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  primaryCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOW.lg,
  },
  primaryCardBg: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  primaryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  primaryCardIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCardText: { flex: 1, marginLeft: SPACING.lg },
  primaryCardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textOnPrimary },
  primaryCardDesc: { fontSize: 12, color: COLORS.textOnPrimaryMuted, marginTop: 2 },
  primaryCardArrow: { fontSize: 20, color: COLORS.textOnPrimaryMuted },
  menuGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  menuCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOW.sm,
  },
  menuCardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  menuCardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  menuCardDesc: { fontSize: 12, color: COLORS.textTertiary, marginTop: 3 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.sm,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, flex: 1 },
  sectionBadge: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    backgroundColor: COLORS.primaryGlow,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
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
  branchMeta: { fontSize: 12, color: COLORS.textTertiary, marginTop: 3 },
  branchPctWrap: { alignItems: 'flex-end' },
  branchPct: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  branchSteps: { fontSize: 11, color: COLORS.textTertiary, marginTop: 1 },
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
  stepsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  stepChip: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.backgroundWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepChipDone: {
    backgroundColor: COLORS.successBg,
  },
  stepChipText: { fontSize: 14, opacity: 0.3 },
  stepChipTextDone: { opacity: 1 },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  recordDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.sm,
  },
  recordLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary },
  recordStatus: { fontSize: 12, color: COLORS.textTertiary, marginRight: SPACING.md },
  recordScore: { fontSize: 13, fontWeight: '700', color: COLORS.text },
});
