import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import type { AuthUser, UserRole, UserProperty } from '@/types/auth';
import type { CreateUserPayload, UpdateUserPayload } from '@/api/endpoints/userManagementApi';
import { SharedFormModal, SegmentedControl } from '@/components/shared';
import { Input } from '@/components/ui';

interface UserFormModalProps {
  visible: boolean;
  onClose: () => void;
  initialUser?: AuthUser | null;
  onSubmitCreate: (data: CreateUserPayload) => void;
  onSubmitUpdate: (id: string, data: UpdateUserPayload) => void;
  isSubmitting: boolean;
}

const ROLE_TABS = [
  { id: 'owner', label: 'Owner' },
  { id: 'manager', label: 'Manager' },
  { id: 'staff', label: 'Staff' },
];

const PROPERTY_TABS = [
  { id: 'express', label: 'Express' },
  { id: 'international', label: 'Intl' },
  { id: 'both', label: 'Both' },
];

export default function UserFormModal({
  visible,
  onClose,
  initialUser,
  onSubmitCreate,
  onSubmitUpdate,
  isSubmitting,
}: UserFormModalProps) {
  const isEditing = !!initialUser;

  const [name, setName] = useState(initialUser?.name || '');
  const [email, setEmail] = useState(initialUser?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(initialUser?.role || 'staff');
  const [property, setProperty] = useState<UserProperty>(initialUser?.property || 'both');
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      if (initialUser) {
        setName(initialUser.name);
        setEmail(initialUser.email);
        setRole(initialUser.role);
        setProperty(initialUser.property);
        setPassword('');
      } else {
        setName('');
        setEmail('');
        setRole('staff');
        setProperty('both');
        setPassword('');
      }
    }
  }

  const handleSubmit = () => {
    if (isEditing && initialUser) {
      const payload: UpdateUserPayload = {};
      if (name !== initialUser.name) payload.name = name;
      if (email !== initialUser.email) payload.email = email;
      if (role !== initialUser.role) payload.role = role;
      if (property !== initialUser.property) payload.property = property;
      if (password) payload.password = password;
      onSubmitUpdate(initialUser.id, payload);
    } else {
      onSubmitCreate({ name, email, role, property, password });
    }
  };

  const isFormValid = isEditing
    ? name.trim() !== '' && email.trim() !== ''
    : name.trim() !== '' && email.trim() !== '' && password.trim() !== '';

  return (
    <SharedFormModal
      visible={visible}
      title={isEditing ? 'Edit User' : 'New User'}
      buttonLabel={isEditing ? 'Save Changes' : 'Create User'}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitDisabled={!isFormValid}
    >
      <View style={styles.formContainer}>
        <Input
          label="Name"
          placeholder="e.g. Alice Smith"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Input
          label="Email"
          placeholder="e.g. alice@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.section}>
          <Input
            label={isEditing ? 'New Password (Optional)' : 'Password'}
            placeholder="Secure password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ROLE</Text>
          <SegmentedControl
            tabs={ROLE_TABS}
            activeTab={role}
            onChange={id => setRole(id as UserRole)}
            style={styles.segmentedControl}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PROPERTY</Text>
          <SegmentedControl
            tabs={PROPERTY_TABS}
            activeTab={property}
            onChange={id => setProperty(id as UserProperty)}
            style={styles.segmentedControl}
          />
        </View>
      </View>
    </SharedFormModal>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    paddingVertical: tokens.spacing.md,
    gap: tokens.spacing.xl,
  },
  section: {
    gap: tokens.spacing.sm,
  },
  sectionLabel: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
    letterSpacing: tokens.typography.letterSpacing.label,
    textTransform: 'uppercase',
    marginBottom: tokens.form.labelBottomMargin,
  },
  segmentedControl: {
    width: '100%',
  },
});
