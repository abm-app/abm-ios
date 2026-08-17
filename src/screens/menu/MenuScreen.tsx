import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/auth/useLogout';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import {
  Backdrop,
  ConfirmationModal,
  UserCard,
  MenuList,
  NotificationModal,
  ScreenHeaderV2,
} from '@/components/shared';
import type { MenuStackParamList } from '@/navigation/types';
import { useMenuItems } from '@/hooks/menu/useMenuItems';

// ─── Navigation type ─────────────────────────────────────────────────────────

type MenuNavProp = NativeStackNavigationProp<MenuStackParamList>;

// ─── Component ───────────────────────────────────────────────────────────────

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MenuNavProp>();
  const user = useAuthStore(state => state.user);
  const logoutMutation = useLogout();
  const { unreadCount } = useNotifications();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const rootContainerStyle = useMemo(() => [styles.root, { paddingTop: insets.top }], [insets.top]);

  const visibleMenuItems = useMenuItems();

  return (
    <View style={rootContainerStyle}>
      <Backdrop />

      <ScreenHeaderV2
        title="Profile"
        showSearch={false}
        showFilter={false}
        showRightButton={false}
        showNotifications={true}
        notificationCount={unreadCount}
        onNotificationsPress={() => setNotificationsVisible(true)}
        showLogout={true}
        onLogoutPress={() => setLogoutModalVisible(true)}
      />

      {/* User Card */}
      <UserCard user={user} />

      {/* Menu List */}
      <MenuList
        items={visibleMenuItems}
        onNavigate={route => navigation.navigate(route as keyof MenuStackParamList)}
      />

      {/* Notifications Modal */}
      <NotificationModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={() => {
          setLogoutModalVisible(false);
          logoutMutation.mutate();
        }}
        title="Log Out"
        content="Are you sure you want to log out?"
        confirmLabel={logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
        confirmDisabled={logoutMutation.isPending}
        iconVariant="danger"
        icon={<Feather name="log-out" size={32} color={tokens.colors.danger} />}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
