import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import type { AuthUser } from '@/types/auth';
import type { MenuStackParamList } from '@/navigation/types';
import type { CreateUserPayload, UpdateUserPayload } from '@/api/endpoints/userManagementApi';

import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '@/hooks/user-management/useUsers';
import {
  ScreenHeaderV2,
  Backdrop,
  LoadingSpinner,
  ErrorState,
  ConfirmationModal,
} from '@/components/shared';
import { Card } from '@/components/ui';
import UserRow from './components/UserRow';
import UserFormModal from './components/UserFormModal';

type MenuNavProp = NativeStackNavigationProp<MenuStackParamList>;

export default function UserManagementScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MenuNavProp>();

  // Queries & Mutations
  const { data: users, isLoading, isError, error, refetch } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  // Local State
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AuthUser | null>(null);

  // Derived styles
  const rootStyle = useMemo(() => [styles.root, { paddingTop: insets.top }], [insets.top]);

  // Handlers
  const handleBack = () => {
    navigation.goBack();
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsFormModalVisible(true);
  };

  const handleOpenEdit = (user: AuthUser) => {
    setEditingUser(user);
    setIsFormModalVisible(true);
  };

  const handleOpenDelete = (user: AuthUser) => {
    setDeletingUser(user);
    setIsDeleteModalVisible(true);
  };

  const handleFormSubmitCreate = (data: CreateUserPayload) => {
    createUser.mutate(data, {
      onSuccess: () => setIsFormModalVisible(false),
    });
  };

  const handleFormSubmitUpdate = (id: string, data: UpdateUserPayload) => {
    updateUser.mutate(
      { id, data },
      {
        onSuccess: () => setIsFormModalVisible(false),
      },
    );
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      deleteUser.mutate(deletingUser.id, {
        onSuccess: () => setIsDeleteModalVisible(false),
      });
    }
  };

  // Rendering logic
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <LoadingSpinner />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <ErrorState
            message={error?.message || 'Failed to load users'}
            onRetry={() => refetch()}
          />
        </View>
      );
    }

    if (!users || users.length === 0) {
      return (
        <View style={styles.centerContainer}>
          {/* Fallback empty state in case there are no users at all */}
          <ErrorState message="No users found." />
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="shadow" style={styles.listCard}>
          {users.map((user, index) => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              isLast={index === users.length - 1}
            />
          ))}
        </Card>
      </ScrollView>
    );
  };

  return (
    <View style={rootStyle}>
      <Backdrop />

      <ScreenHeaderV2
        title="User Management"
        showBackButton
        onBackPress={handleBack}
        showRightButton
        rightButtonText="+ New"
        onRightButtonPress={handleOpenCreate}
        showNotifications={false}
      />

      {renderContent()}

      {/* Form Modal (Create / Edit) */}
      <UserFormModal
        visible={isFormModalVisible}
        onClose={() => setIsFormModalVisible(false)}
        initialUser={editingUser}
        onSubmitCreate={handleFormSubmitCreate}
        onSubmitUpdate={handleFormSubmitUpdate}
        isSubmitting={createUser.isPending || updateUser.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        content={`Are you sure you want to delete ${deletingUser?.name}? This action cannot be undone.`}
        confirmLabel={deleteUser.isPending ? 'Deleting...' : 'Delete User'}
        confirmDisabled={deleteUser.isPending}
        iconVariant="danger"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxxl,
  },
  listCard: {
    padding: 0,
    overflow: 'hidden',
  },
});
