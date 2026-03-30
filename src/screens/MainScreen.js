import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOW, CURRICULUM_STEPS } from '../lib/constants';

const MOCK_BRANCHES = [
  { id: '1', name: '용인백암점', ownerName: '전현무', records: [
    { step: 1, passed: true, score: 4 }, { step: 1, passed: true, score: 4 }, { step: 2, passed: true, score: 9 },
  ]},
];

function getCompletedSteps(records) { return new Set(records.filter(r => r.passed).map(r => r.step)).size; }
function getToday() { const d = new Date(); const w = ['일','월','화','수','목','금','토']; return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 ${w[d.getDay()]}요일`; }

export default function MainScreen({ navigation }) {
  const [branches] = useState(MOCK_BRANCHES);
  const totalSteps = branches.reduce((s, b) => s + getCompletedSteps(b.records), 0);
  const totalRecords = branches.reduce((s, b) => s + b.records.length, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.dateText}>{getToday()}</Text>
            <Text style={styles.greeting}>안녕하세요</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
            <Text style={{ fontSize: 11, color: COLORS.textTertiary, fontWeight: '600' }}>logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          {[
            { val: branches.length, label: '교육 중', icon: 'map-pin', accent: true },
            { val: totalSteps, label: '이수 단계', icon: 'check-square' },
            { val: totalRecords, label: '총 기록', icon: 'file-text' },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, s.accent && styles.statCardAccent]}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: s.accent ? COLORS.primary : COLORS.textTertiary }} />
              <Text style={[styles.statValue, s.accent && { color: COLORS.primary }]}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryCard} activeOpacity={0.9} onPress={() => navigation.navigate('EducationRecord')}>
          <View style={styles.primaryCardRow}>
            <View style={styles.primaryIconWrap} />
            <View style={{ flex: 1 }}>
              <Text style={styles.primaryTitle}>교육 기록 입력</Text>
              <Text style={styles.primaryDesc}>지점별 교육 내용 및 평가 기록</Text>
            </View>
            <Text style={{ fontSize: 18, color: COLORS.textOnPrimaryMuted, fontWeight: '600' }}>{'>'}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuCard} activeOpacity={0.9} onPress={() => navigation.navigate('BranchManage')}>
            <View style={styles.menuIconWrap} />
            <Text style={styles.menuTitle}>지점 관리</Text>
            <Text style={styles.menuDesc}>등록 및 목록 관리</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuCard} activeOpacity={0.9} onPress={() => navigation.navigate('Dashboard')}>
            <View style={styles.menuIconWrap} />
            <Text style={styles.menuTitle}>전체 현황</Text>
            <Text style={styles.menuDesc}>진행률 & 분석</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionRow}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary }} />
          <Text style={styles.sectionTitle}>현재 교육 현황</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{branches.length}개 지점</Text></View>
        </View>

        {branches.map((branch) => {
          const completed = getCompletedSteps(branch.records);
          const pct = Math.round((completed / CURRICULUM_STEPS.length) * 100);
          return (
            <View key={branch.id} style={styles.branchCard}>
              <View style={styles.branchTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.branchName}>{branch.name}</Text>
                  <Text style={styles.branchMeta}>{branch.ownerName} · 오늘 {branch.records.length}건</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.pctText, pct >= 100 && { color: COLORS.success }]}>{pct}%</Text>
                  <Text style={styles.pctSub}>{completed}/{CURRICULUM_STEPS.length}</Text>
                </View>
              </View>
              <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${pct}%` }]} /></View>
              <View style={styles.stepsRow}>
                {CURRICULUM_STEPS.map((step) => {
                  const done = branch.records.some(r => r.step === step.id && r.passed);
                  return (
                    <View key={step.id} style={[styles.stepChip, done && styles.stepChipDone]}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: done ? COLORS.success : COLORS.textTertiary, opacity: done ? 1 : 0.3 }}>{step.id}</Text>
                    </View>
                  );
                })}
              </View>
              {branch.records.slice(0, 3).map((rec, i) => {
                const step = CURRICULUM_STEPS.find(s => s.id === rec.step);
                return (
                  <View key={i} style={styles.recordItem}>
                    <View style={[styles.recordDot, { backgroundColor: rec.passed ? COLORS.success : COLORS.danger }]} />
                    <Text style={styles.recordLabel}>{step?.short}</Text>
                    <View style={[styles.recordBadge, { backgroundColor: rec.passed ? COLORS.successBg : COLORS.dangerBg }]}>
                      <Text style={[styles.recordBadgeText, { color: rec.passed ? COLORS.success : COLORS.danger }]}>{rec.passed ? '이수' : '미이수'}</Text>
                    </View>
                    <Text style={styles.recordScore}>{rec.score}점</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, ...SHADOW.sm },
  headerInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxxl, paddingBottom: SPACING.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  dateText: { fontSize: 12, color: COLORS.textTertiary },
  greeting: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginTop: 2 },
  logoutBtn: { width: 40, height: 40, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, maxWidth: 560, width: '100%', alignSelf: 'center' },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.borderLight },
  statCardAccent: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
  statValue: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginTop: SPACING.xs },
  statLabel: { fontSize: 10, color: COLORS.textTertiary, marginTop: 1 },
  primaryCard: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, marginBottom: SPACING.md, ...SHADOW.lg },
  primaryCardRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.xl, gap: SPACING.lg },
  primaryIconWrap: { width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  primaryTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textOnPrimary },
  primaryDesc: { fontSize: 12, color: COLORS.textOnPrimaryMuted, marginTop: 2 },
  menuGrid: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xxl },
  menuCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOW.sm },
  menuIconWrap: { width: 40, height: 40, borderRadius: RADIUS.sm, backgroundColor: COLORS.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  menuTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  menuDesc: { fontSize: 12, color: COLORS.textTertiary, marginTop: 3 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, flex: 1 },
  badge: { backgroundColor: COLORS.primaryGlow, paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full },
  badgeText: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  branchCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOW.sm },
  branchTop: { flexDirection: 'row', marginBottom: SPACING.md },
  branchName: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  branchMeta: { fontSize: 12, color: COLORS.textTertiary, marginTop: 3 },
  pctText: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  pctSub: { fontSize: 11, color: COLORS.textTertiary },
  progressTrack: { height: 4, backgroundColor: COLORS.backgroundWarm, borderRadius: 2, overflow: 'hidden', marginBottom: SPACING.lg },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  stepsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  stepChip: { width: 32, height: 32, borderRadius: RADIUS.sm, backgroundColor: COLORS.backgroundWarm, alignItems: 'center', justifyContent: 'center' },
  stepChipDone: { backgroundColor: COLORS.successBg },
  recordItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  recordDot: { width: 6, height: 6, borderRadius: 3, marginRight: SPACING.sm },
  recordLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary },
  recordBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full, marginRight: SPACING.sm },
  recordBadgeText: { fontSize: 11, fontWeight: '600' },
  recordScore: { fontSize: 13, fontWeight: '700', color: COLORS.text, width: 30, textAlign: 'right' },
});
