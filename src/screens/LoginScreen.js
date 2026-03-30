import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, Animated,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOW } from '../lib/constants';

export default function LoginScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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
      {/* 배경 장식 */}
      <View style={styles.bgDecorTop} />
      <View style={styles.bgDecorBottom} />

      <View style={styles.inner}>
        {/* 로고 영역 */}
        <View style={styles.logoArea}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>선</Text>
          </View>
          <Text style={styles.logoTitle}>선비칼국수</Text>
          <View style={styles.logoDivider} />
          <Text style={styles.logoSub}>교육 관리 시스템</Text>
        </View>

        {/* 로그인 폼 */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>로그인</Text>
          <Text style={styles.formDesc}>본사 관리자 또는 SV 계정으로 로그인하세요</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>아이디</Text>
            <View style={[
              styles.inputWrap,
              focusedField === 'id' && styles.inputWrapFocused,
            ]}>
              <Text style={styles.inputIcon}>ID</Text>
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
            <View style={[
              styles.inputWrap,
              focusedField === 'pw' && styles.inputWrapFocused,
            ]}>
              <Text style={styles.inputIcon}>*</Text>
              <TextInput
                style={styles.input}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={COLORS.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocusedField('pw')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>
              {loading ? '로그인 중...' : '로그인'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© 2026 (주)GGC 선비칼국수</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bgDecorTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primaryGlow,
  },
  bgDecorBottom: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primarySoft,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOW.lg,
  },
  logoBadgeText: {
    fontSize: 28,
    color: COLORS.textOnPrimary,
    fontWeight: '300',
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  logoDivider: {
    width: 32,
    height: 2,
    backgroundColor: COLORS.primary,
    marginVertical: SPACING.md,
    borderRadius: 1,
    opacity: 0.3,
  },
  logoSub: {
    fontSize: 14,
    color: COLORS.textTertiary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    ...SHADOW.lg,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  formDesc: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginBottom: SPACING.xxl,
    lineHeight: 18,
  },
  fieldGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWarm,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: SPACING.lg,
  },
  inputWrapFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: SPACING.md,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: SPACING.sm,
    ...SHADOW.md,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: COLORS.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: SPACING.xxl,
  },
});
