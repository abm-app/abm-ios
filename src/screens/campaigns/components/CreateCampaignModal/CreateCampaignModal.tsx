import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SharedFormModal, CustomCalender } from '@/components/shared';
import {
  createCampaign,
  getEstimatedReach,
  CreateCampaignPayload,
} from '@/api/endpoints/campaignApi';
import type { Campaign } from '@/types/campaign';
import { useMetaTemplates } from '@/hooks/campaigns/useCampaigns';
import TargetAudienceStep from './TargetAudienceStep';
import MessageContentStep from './MessageContentStep';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Campaign;
}

export default function CreateCampaignModal({ visible, onClose, onSuccess, initialData }: Props) {
  const { data: templates, isLoading: isLoadingTemplates } = useMetaTemplates();
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [name, setName] = useState(initialData?.name || '');
  const [templateId, setTemplateId] = useState(initialData?.templateId || '');
  const [templateVars, setTemplateVars] = useState<Record<string, string>>(
    initialData?.templateVariables || {},
  );

  const [selectedTiers, setSelectedTiers] = useState<string[]>(
    (initialData?.filters?.tier as string[]) || ['All'],
  );

  const [scheduledAt, setScheduledAt] = useState(
    initialData?.scheduledAt ? initialData.scheduledAt.split('T')[0] : '',
  );
  const [offerExpiry, setOfferExpiry] = useState(
    initialData?.offerExpiry ? initialData.offerExpiry.split('T')[0] : '',
  );

  const [reachCount, setReachCount] = useState<number | null>(null);
  const [isLoadingReach, setIsLoadingReach] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<'start' | 'end' | null>(null);

  const handleClose = () => {
    setCurrentPage(1);
    onClose();
  };

  useEffect(() => {
    let isMounted = true;
    const fetchReach = async () => {
      setIsLoadingReach(true);
      try {
        const count = await getEstimatedReach(selectedTiers);
        if (isMounted) setReachCount(count);
      } catch {
        if (isMounted) setReachCount(0);
      } finally {
        if (isMounted) setIsLoadingReach(false);
      }
    };
    fetchReach();
    return () => {
      isMounted = false;
    };
  }, [selectedTiers]);

  useEffect(() => {
    if (templates && templates.length > 0 && !templateId) {
      const timer = setTimeout(() => {
        setTemplateId(templates[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [templates, templateId]);

  const toggleTier = (tier: string) => {
    if (tier === 'All') {
      setSelectedTiers(['All']);
      return;
    }
    let newTiers = selectedTiers.includes(tier)
      ? selectedTiers.filter(t => t !== tier)
      : [...selectedTiers.filter(t => t !== 'All'), tier];

    if (newTiers.length === 4) {
      newTiers = ['All'];
    } else if (newTiers.length === 0) {
      newTiers = ['All'];
    }

    setSelectedTiers(newTiers);
  };

  const handleOpenCalendar = (target: 'start' | 'end') => {
    setCalendarTarget(target);
    setIsCalendarVisible(true);
  };

  const handleSelectDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    if (calendarTarget === 'start') {
      setScheduledAt(dateStr);
    } else if (calendarTarget === 'end') {
      setOfferExpiry(dateStr);
    }
    setIsCalendarVisible(false);
  };

  const currentTemplate = templates?.find(t => t.id === templateId);

  const handleChangeTemplateVar = (v: string, text: string) => {
    setTemplateVars(prev => ({ ...prev, [v]: text }));
  };

  const submitPayload = async (_isDraft: boolean = false) => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Campaign name is required.');
      return;
    }

    setIsSubmitting(true);

    const payload: CreateCampaignPayload = {
      name,
      templateId,
      templateVariables: templateVars,
      type: scheduledAt ? 'scheduled' : 'manual',
      filters: {
        tier: selectedTiers,
      },
      recipientCount: reachCount || 0,
      metadata: {},
    };

    if (scheduledAt) {
      payload.scheduledAt = scheduledAt;
    }
    if (offerExpiry) {
      payload.offerExpiry = offerExpiry;
    }

    try {
      await createCampaign(payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      Alert.alert('Error', 'Failed to create campaign.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SharedFormModal
        visible={visible}
        title={currentPage === 1 ? 'Target Audience' : 'Message Content'}
        buttonLabel={currentPage === 1 ? 'Select Template' : 'Submit for Approval'}
        onSubmit={() => {
          if (currentPage === 1) setCurrentPage(2);
          else submitPayload(false);
        }}
        secondaryButtonLabel="Save Draft"
        onSecondarySubmit={() => submitPayload(true)}
        isSubmitting={isSubmitting}
        onClose={handleClose}
        onBack={currentPage === 2 ? () => setCurrentPage(1) : undefined}
      >
        {currentPage === 1 ? (
          <TargetAudienceStep
            name={name}
            onChangeName={setName}
            scheduledAt={scheduledAt}
            offerExpiry={offerExpiry}
            selectedTiers={selectedTiers}
            onToggleTier={toggleTier}
            reachCount={reachCount}
            isLoadingReach={isLoadingReach}
            onOpenCalendar={handleOpenCalendar}
          />
        ) : (
          <MessageContentStep
            templates={templates}
            isLoadingTemplates={isLoadingTemplates}
            templateId={templateId}
            onChangeTemplateId={setTemplateId}
            templateVars={templateVars}
            onChangeTemplateVar={handleChangeTemplateVar}
            currentTemplate={currentTemplate}
            reachCount={reachCount}
          />
        )}
      </SharedFormModal>

      <CustomCalender
        visible={isCalendarVisible}
        onClose={() => setIsCalendarVisible(false)}
        disablePastDates
        onSelectDate={handleSelectDate}
      />
    </>
  );
}
