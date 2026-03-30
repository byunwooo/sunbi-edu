import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, CURRICULUM_STEPS } from '../lib/constants';

// TODO: Supabase에서 데이터 로드
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

function getProgress(records) {
  const passedSteps = new Set(records.filter(r => r.passed).map(r => r.step));
  return passedSteps.size;
}

function getToday() {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${year}년 ${month}월 ${day}일 ${weekdays[d.getDay()]}`;
}

export default function MainScreen({ navigation }) {
  const [branches, setBranches] = useState(MOCK_BRANCHES);

  useFocusEffect(
    useCallback(() => {
      // TODO: Supabase에서 최신 데이터 로드
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>{getToday()}</Text>
          <Text style={styles.greeting}>님</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      {/* 메뉴 카드 */}
      <View style={styles.menuRow}>
        <TouchableOpacity
          style={styles.menuCardPrimary}
          onPress={() => navigation.navigate('EducationRecord')}
        >
          <Text style={styles.menuIcon}>📝</Text>
          <Text style={styles.menuTitleWhite}>교육 기록 입력</Text>
          <Text style={styles.menuDescWhite}>지점별 교육 내용{'\n'}및 평가 기록</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('BranchManage')}
        >
          <Text style={styles.menuIcon}>📊</Text>
          <Text style={styles.menuTitle}>지점 관리</Text>
          <Text style={styles.menuDesc}>지점 등록 및{'\n'}목록 관리</Text>
        </TouchableOpacity>
      </View>

      {/* 현재 교육 현황 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📋 현재 교육 현황</Text>
        <Text style={styles.sectionSub}>{branches.length}개 지점 활동</Text>
      </View>

      {branches.map((branch) => {
        const progress = getProgress(branch.records);
        const pct = Math.round((progress / CURRICULUM_STEPS.length) * 100);
        return (
          <View key={branch.id} style={styles.branchCard}>
            <View style={styles.branchHeader}>
              <View>
                <Text style={styles.branchName}>{branch.name}</Text>
                <Text style={styles.branchSub}>
                  오늘 {branch.records.length}건 기록 · 전체 {progress}/{CURRICULUM_STEPS.length}단계
                </Text>
              </View>
              <View style={styles.pctWrap}>
                <Text style={[styles.pctText, pct >= 100 && { color: COLORS.success }]}>{pct}%</Text>
                <Text style={styles.detailLink}>상세 보기 →</Text>
              </View>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
            </View>
            {branch.records.slice(0, 3).map((rec, i) => {
              const step = CURRICULUM_STEPS.find(s => s.id === rec.step);
              return (
                <View key={i} style={styles.recordRow}>
                  <View style={[styles.dot, { backgroundColor: rec.passed ? COLORS.success : COLORS.danger }]} />
                  <Text style={styles.recordText}>
                    {step?.label} · {rec.passed ? '이수' : '미이수'} ({rec.score}점)
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}

      {/* 전체 현황 대시보드 */}
      <TouchableOpacity
        style={styles.dashboardCard}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.menuIcon}>📈</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.dashboardTitle}>전체 현황 대시보드</Text>
          <Text style={styles.dashboardDesc}>전 지점 교육 진행률 & 분석</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dateText: { fontSize: 12, color: COLORS.textLight },
  greeting: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  logoutBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  logoutText: { fontSize: 13, color: COLORS.textLight },
  menuRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  menuCardPrimary: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  menuCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  menuIcon: { fontSize: 24, marginBottom: 12 },
  menuTitleWhite: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  menuDescWhite: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4, lineHeight: 18 },
  menuTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  menuDesc: { fontSize: 12, color: COLORS.textLight, marginTop: 4, lineHeight: 18 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  sectionSub: { fontSize: 12, color: COLORS.textLight },
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
  branchHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  branchName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  branchSub: { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
  pctWrap: { alignItems: 'flex-end' },
  pctText: { fontSize: 22, fontWeight: '700', color: COLORS.primary },
  detailLink: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginBottom: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  recordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  recordText: { fontSize: 13, color: COLORS.textLight },
  dashboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 18,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  dashboardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginLeft: 12 },
  dashboardDesc: { fontSize: 12, color: COLORS.textLight, marginLeft: 12, marginTop: 2 },
  arrow: { fontSize: 20, color: COLORS.textMuted },
});
