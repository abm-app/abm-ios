import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as Sharing from 'expo-sharing';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { RootStackParamList } from '@/navigation/types';
import { useReportPdf } from '@/hooks/notifications/useReportPdf';
import { ErrorState, LoadingSpinner } from '@/components/shared';
import { buildPdfViewerHtml } from '@/utils/pdfViewerHtml';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportViewer'>;

export default function ReportViewerScreen({ route, navigation }: Props) {
  const { date } = route.params;
  const { data, isLoading, isError, error, refetch } = useReportPdf(date);

  const uri = data?.uri;

  const share = () => {
    if (uri) {
      void Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Daily Report — ${date}`,
      });
    }
  };

  const renderBody = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (isError || !data) {
      return <ErrorState message={error?.message || 'Failed to load report'} onRetry={refetch} />;
    }
    return (
      <WebView
        source={
          Platform.OS === 'ios' ? { uri: data.uri } : { html: buildPdfViewerHtml(data.base64) }
        }
        originWhitelist={['*']}
        allowingReadAccessToURL={data.uri}
        style={styles.webview}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Feather name="arrow-left" size={24} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Daily Report — {date}</Text>
        <TouchableOpacity onPress={share} disabled={!uri} activeOpacity={0.7}>
          <Feather
            name="share"
            size={22}
            color={uri ? tokens.colors.textPrimary : tokens.colors.border}
          />
        </TouchableOpacity>
      </View>
      {renderBody()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: tokens.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.xlMd,
    paddingVertical: tokens.spacing.lg,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  webview: { flex: 1 },
});
