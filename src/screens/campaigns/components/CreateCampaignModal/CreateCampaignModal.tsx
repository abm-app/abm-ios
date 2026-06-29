import React, { useState, useEffect } from 'react';
import { SharedFormModal, CustomCalender, AlertModal } from '@/components/shared';
import {
  createCampaign,
  updateCampaign,
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
  const [templateVars] = useState<Record<string, string>>(initialData?.templateVariables || {});

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

  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', content: '' });

  const showAlert = (title: string, content: string) => {
    setAlertConfig({ visible: true, title, content });
  };

  const resetState = () => {
    setCurrentPage(1);
    setName(initialData?.name || '');
    if (templates && templates.length > 0) {
      setTemplateId(initialData?.templateId || templates[0].id);
    } else {
      setTemplateId(initialData?.templateId || '');
    }
    setSelectedTiers((initialData?.filters?.tier as string[]) || ['All']);
    setScheduledAt(initialData?.scheduledAt ? initialData.scheduledAt.split('T')[0] : '');
    setOfferExpiry(initialData?.offerExpiry ? initialData.offerExpiry.split('T')[0] : '');
  };

  const handleClose = () => {
    resetState();
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    if (calendarTarget === 'start') {
      setScheduledAt(dateStr);
    } else if (calendarTarget === 'end') {
      setOfferExpiry(dateStr);
    }
    setIsCalendarVisible(false);
  };

  const currentTemplate = templates?.find(t => t.id === templateId);

  const submitPayload = async (_isDraft: boolean = false) => {
    if (!name.trim()) {
      showAlert('Error', 'Campaign name is required.');
      return;
    }
    if (!scheduledAt) {
      showAlert('Error', 'Start date is required.');
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
      if (initialData?._id) {
        await updateCampaign(initialData._id, payload);
      } else {
        await createCampaign(payload);
      }
      if (onSuccess) onSuccess();
      resetState();
      onClose();
    } catch {
      showAlert(
        'Error',
        initialData?._id ? 'Failed to update campaign.' : 'Failed to create campaign.',
      );
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
          if (currentPage === 1) {
            if (!name.trim()) {
              showAlert('Error', 'Campaign name is required.');
              return;
            }
            if (!scheduledAt) {
              showAlert('Error', 'Start date is required.');
              return;
            }
            setCurrentPage(2);
          } else {
            submitPayload(false);
          }
        }}
        secondaryButtonLabel={currentPage === 2 ? 'Save Draft' : undefined}
        onSecondarySubmit={currentPage === 2 ? () => submitPayload(true) : undefined}
        isSubmitting={isSubmitting}
        onClose={handleClose}
        onBack={currentPage === 2 ? () => setCurrentPage(1) : undefined}
        overlay={
          <>
            <CustomCalender
              visible={isCalendarVisible}
              onClose={() => setIsCalendarVisible(false)}
              disablePastDates
              onSelectDate={handleSelectDate}
              minDate={
                calendarTarget === 'end' && scheduledAt
                  ? new Date(
                      Number(scheduledAt.split('-')[0]),
                      Number(scheduledAt.split('-')[1]) - 1,
                      Number(scheduledAt.split('-')[2]),
                    )
                  : undefined
              }
              useModal={false}
            />

            <AlertModal
              visible={alertConfig.visible}
              onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
              title={alertConfig.title}
              content={alertConfig.content}
              iconVariant="danger"
              useModal={false}
            />
          </>
        }
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
            currentTemplate={currentTemplate}
            reachCount={reachCount}
          />
        )}
      </SharedFormModal>
    </>
  );
}
