import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOW, CURRICULUM_STEPS } from '../lib/constants';

const MOCK_BRANCHES = [
  { id: '1', name: '용인백암점', ownerName: '전현무', records: [
    { step: 1, passed: true, score: 4 }, { step: 2, passed: true, score: 4 },
  ]},
];

function getCompletedSteps(records) { return new Set(records.filter(r => r.passed).map(r => r.step)).size; }
function getToday() { const d = new Date(); const w = ['일','월','화','수','목','금','토']; return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 ${w[d.getDay()]}요일`; }

export default function MainScreen({ navigation }) {
  const [branches] = useState(MOCK_BRANCHES);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.dateText}>{getToday()}</Text>
            <Text style={styles.greeting}>안녕하세요</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 메뉴 */}
        <TouchableOpacity style={styles.primaryCard} activeOpacity={0.9} onPress={() => navigation.navigate('EducationRecord')}>
          <Text style={styles.primaryTitle}>교육 기록 입력</Text>
          <Text style={styles.primaryDesc}>지점별 교육 내용 및 평가 기록</Text>
        </TouchableOpacity>

        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuCard} activeOpacity={0.9} onPress={() => navigation.navigate('BranchManage')}>
            <Text style={styles.menuTitle}>지점 관리</Text>
            <Text style={styles.menuDesc}>등록 및 목록 관리</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuCard} activeOpacity={0.9} onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.menuTitle}>전체 현황</Text>
            <Text style={styles.menuDesc}>진행률 & 분석</Text>
          </TouchableOpacity>
        </View>

        {/* 교육 현황 */}
        <View style={styles.sectionRow}>
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
                  <Text style={styles.pctSub}>{completed}/{CURRICULUM_STEPS.length}단계</Text>
                </View>
              </View>
              <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${pct}%` }]} /></View>
              <View style={styles.stepsRow}>
                {CURRICULUM_STEPS.map((step) => {
                  const done = branch.records.some(r => r.step === step.id && r.passed);
                  return (
                    <View key={step.id} style={[styles.stepChip, done && styles.stepChipDone]}>
                      <Text style={[styles.stepNum, done && styles.stepNumDone]}>{step.id}</Text>
                    </View>
                  );
                })}
              </View>
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
  logoutBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm, paddingHorizontal: 14, paddingVertical: 7 },
  logoutText: { fontSize: 12, color: COLORS.textTertiary, fontWeight: '600' },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, maxWidth: 560, width: '100%', alignSelf: 'center' },
  primaryCard: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.md, ...SHADOW.lg },
  primaryTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textOnPrimary },
  primaryDesc: { fontSize: 13, color: COLORS.textOnPrimaryMuted, marginTop: 4 },
  menuGrid: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xxl },
  menuCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOW.sm },
  menuTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  menuDesc: { fontSize: 12, color: COLORS.textTertiary, marginTop: 4 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
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
  stepsRow: { flexDirection: 'row', gap: SPACING.sm },
  stepChip: { width: 32, height: 32, borderRadius: RADIUS.sm, backgroundColor: COLORS.backgroundWarm, alignItems: 'center', justifyContent: 'center' },
  stepChipDone: { backgroundColor: COLORS.successBg },
  stepNum: { fontSize: 12, fontWeight: '700', color: COLORS.textTertiary, opacity: 0.3 },
  stepNumDone: { color: COLORS.success, opacity: 1 },
});
