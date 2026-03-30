import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOW } from '../lib/constants';

export default function LoginScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!userId || !password) {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
      return;
    }
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.inner}>
        <View style={styles.logoArea}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>선</Text>
          </View>
          <Text style={styles.logoTitle}>선비칼국수</Text>
          <View style={styles.logoDivider} />
          <Text style={styles.logoSub}>교육 관리 시스템</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>로그인</Text>
          <Text style={styles.formDesc}>본사 관리자 또는 SV 계정으로 로그인하세요</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>아이디</Text>
            <View style={[styles.inputWrap, focusedField === 'id' && styles.inputWrapFocused]}>
              <TextInput
                style={styles.input}
                placeholder="아이디를 입력하세요"
                placeholderTextColor={COLORS.textTertiary}
                value={userId}
                onChangeText={setUserId}
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocusedField('id')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <View style={[styles.inputWrap, focusedField === 'pw' && styles.inputWrapFocused]}>
              <TextInput
                style={styles.input}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={COLORS.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedField('pw')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={{ fontSize: 13, color: COLORS.textTertiary, fontWeight: '600' }}>
                  {showPassword ? '숨김' : '보기'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>{loading ? '로그인 중...' : '로그인'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© 2026 (주)GGC 선비칼국수</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  bgCircle1: { position: 'absolute', top: -100, right: -60, width: 260, height: 260, borderRadius: 130, backgroundColor: COLORS.primaryGlow },
  bgCircle2: { position: 'absolute', bottom: -40, left: -30, width: 180, height: 180, borderRadius: 90, backgroundColor: COLORS.primarySoft },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.xxl, maxWidth: 420, width: '100%', alignSelf: 'center' },
  logoArea: { alignItems: 'center', marginBottom: 44 },
  logoBadge: { width: 72, height: 72, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg, ...SHADOW.lg },
  logoBadgeText: { fontSize: 36, color: COLORS.textOnPrimary, fontWeight: '900', fontFamily: 'serif' },
  logoTitle: { fontSize: 26, fontWeight: '800', color: COLORS.primary, letterSpacing: -0.5 },
  logoDivider: { width: 28, height: 2, backgroundColor: COLORS.primary, marginVertical: SPACING.md, borderRadius: 1, opacity: 0.25 },
  logoSub: { fontSize: 13, color: COLORS.textTertiary, letterSpacing: 3 },
  formCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.xxl, ...SHADOW.lg },
  formTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  formDesc: { fontSize: 13, color: COLORS.textTertiary, marginTop: 4, marginBottom: SPACING.xxl, lineHeight: 18 },
  fieldGroup: { marginBottom: SPACING.xl },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: SPACING.sm, letterSpacing: 0.3 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.backgroundWarm,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderLight,
    paddingHorizontal: SPACING.lg, gap: SPACING.sm,
  },
  inputWrapFocused: { borderColor: COLORS.primary, backgroundColor: COLORS.surface },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: COLORS.text },
  loginBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: SPACING.sm, ...SHADOW.md,
  },
  loginBtnText: { color: COLORS.textOnPrimary, fontSize: 16, fontWeight: '700' },
  footer: { textAlign: 'center', fontSize: 11, color: COLORS.textTertiary, marginTop: SPACING.xxl },
});
