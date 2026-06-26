import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/ui';
import SectionLabel from './SectionLabel';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import { CustomCalender } from '@/components/shared/CustomCalender';
import { ScreenHeaderV2 } from '@/components/shared/ScreenHeader';
import { SharedFormModal } from '@/components/shared/SharedFormModal';
import { Avatar } from '@/components/shared/Avatar';
import { FilterSheet } from '@/components/shared/FilterSheet';

export default function MigratedComponentsSection() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  return (
    <View style={styles.section}>
      <SectionLabel title="Components — Migrated from zz-ios" />

      <View style={styles.componentWrapper}>
        <ScreenHeaderV2
          title="Header Title"
          subtitle="Subtitle here"
          showSearch
          showFilter
          showRightButton
        />
      </View>

      <View style={styles.buttonRow}>
        <Avatar name="John Doe" size={40} />
        <Avatar name="Jane Smith" size={40} overlap />
      </View>

      <View style={[styles.buttonRow, styles.buttonRowMargin]}>
        <Button label="Show Confirm" variant="secondary" onPress={() => setShowConfirm(true)} />
        <Button label="Show Calendar" variant="secondary" onPress={() => setShowCalendar(true)} />
        <Button label="Show Form" variant="secondary" onPress={() => setShowFormModal(true)} />
        <Button label="Show Filter" variant="secondary" onPress={() => setShowFilterSheet(true)} />
      </View>

      <ConfirmationModal
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => setShowConfirm(false)}
        title="Confirm Action"
        content="Are you sure you want to do this?"
        confirmLabel="Yes, Do it"
      />
      <CustomCalender visible={showCalendar} onClose={() => setShowCalendar(false)} />
      <SharedFormModal
        visible={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={() => setShowFormModal(false)}
        title="Form Modal"
        buttonLabel="Submit"
      >
        <Text>Form Content Here</Text>
      </SharedFormModal>
      <FilterSheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        title="Filters"
        showDragIndicator
      >
        <Text>Filter options here</Text>
      </FilterSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 48,
  },
  componentWrapper: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  buttonRowMargin: {
    marginTop: 16,
  },
});
