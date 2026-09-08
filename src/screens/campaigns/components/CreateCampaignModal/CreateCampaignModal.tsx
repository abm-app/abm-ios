import React, { useState, useEffect } from 'react';
import { SharedFormModal, CustomCalender, AlertModal } from '@/components/shared';
import { CreateCampaignPayload } from '@/api/endpoints/campaignApi';
import type { Campaign } from '@/types/campaign';

type VariableSource = 'guest_field' | 'custom';

interface VariableConfig {
  source: VariableSource;
  guestField?: string;
  customValue?: string;
}
import {
  useMetaTemplates,
  useCreateCampaign,
  useUpdateCampaign,
  useEstimatedReach,
} from '@/hooks/campaigns/useCampaigns';
import { getCalendarDateString, parseDateString } from '@/utils/dateUtils';
import { useLoyaltyConfig } from '@/hooks/loyalty/useLoyaltyConfig';
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
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();
  const { mutateAsync: fetchReachAsync } = useEstimatedReach();
  const { data: loyaltyConfig, isSuccess: isLoyaltyConfigSuccess } = useLoyaltyConfig();

  const allTiers = React.useMemo(
    () => loyaltyConfig?.tierThresholds?.map(t => t.name) || [],
    [loyaltyConfig?.tierThresholds],
  );
  const tierOptions = React.useMemo(
    () => (isLoyaltyConfigSuccess && allTiers.length > 0 ? ['All', ...allTiers] : []),
    [allTiers, isLoyaltyConfigSuccess],
  );

  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [name, setName] = useState(initialData?.name || '');
  const [templateId, setTemplateId] = useState(initialData?.templateId || '');
  const [templateVars, setTemplateVars] = useState<Record<string, string>>(
    initialData?.templateVariables || {},
  );
  const [variableConfigs, setVariableConfigs] = useState<Record<string, VariableConfig>>({});

  // Reset variable configs whenever the template ID changes (new template selected)
  useEffect(() => {
    if (!templateId) {
      setVariableConfigs({});
      return;
    }
    const template = templates?.find(t => t.id === templateId);
    if (!template?.variables) {
      setVariableConfigs({});
      return;
    }
    const next: Record<string, VariableConfig> = {};
    template.variables.forEach(v => {
      next[v.key] = { source: 'custom', customValue: '' };
    });
    setVariableConfigs(next);
  }, [templateId, templates]);

  const handleUpdateVariableConfig = (key: string, config: VariableConfig) => {
    setVariableConfigs(prev => ({
      ...prev,
      [key]: config,
    }));
  };

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
    setTemplateVars(initialData?.templateVariables || {});
    setVariableConfigs({});
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
      if (!isLoyaltyConfigSuccess) return;
      setIsLoadingReach(true);
      try {
        setReachCount(null);
        const tiersToSend = selectedTiers.includes('All') ? [...allTiers, 'None'] : selectedTiers;
        const count = await fetchReachAsync(tiersToSend);
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
  }, [selectedTiers, fetchReachAsync, allTiers, isLoyaltyConfigSuccess]);

  const toggleTier = (tier: string) => {
    if (tier === 'All') {
      setSelectedTiers(['All']);
      return;
    }
    let newTiers = selectedTiers.includes(tier)
      ? selectedTiers.filter(t => t !== tier)
      : [...selectedTiers.filter(t => t !== 'All'), tier];

    newTiers = newTiers.filter(t => allTiers.includes(t));

    const isCompleteSelection = allTiers.length > 0 && allTiers.every(t => newTiers.includes(t));

    if (isCompleteSelection || newTiers.length === 0) {
      newTiers = ['All'];
    }

    setSelectedTiers(newTiers);
  };

  const handleOpenCalendar = (target: 'start' | 'end') => {
    setCalendarTarget(target);
    setIsCalendarVisible(true);
  };

  const handleSelectDate = (date: Date) => {
    const dateStr = getCalendarDateString(date);
    if (calendarTarget === 'start') {
      setScheduledAt(dateStr);
    } else if (calendarTarget === 'end') {
      setOfferExpiry(dateStr);
    }
    setIsCalendarVisible(false);
  };

  const currentTemplate = templates?.find(t => t.id === templateId);

  // Auto-select first template when templates load
  useEffect(() => {
    if (templates && templates.length > 0 && !templateId) {
      const timer = setTimeout(() => {
        setTemplateId(templates[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [templates, templateId]);

  const submitPayload = async (_isDraft: boolean = false) => {
    if (!name.trim()) {
      showAlert('Error', 'Campaign name is required.');
      return;
    }
    if (!scheduledAt) {
      showAlert('Error', 'Start date is required.');
      return;
    }
    if (!isLoyaltyConfigSuccess || allTiers.length === 0) {
      showAlert('Error', 'Loyalty configuration is not ready. Please try again later.');
      return;
    }

    setIsSubmitting(true);

    const payload: CreateCampaignPayload = {
      name,
      templateId,
      templateVariables: templateVars,
      variableConfigs,
      type: scheduledAt ? 'scheduled' : 'manual',
      filters: {
        tier: selectedTiers,
      },
      recipientCount: reachCount || 0,
      status: _isDraft ? 'draft' : 'pending_approval',
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
        await updateMutation.mutateAsync({ id: initialData._id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsSubmitting(false);
      if (onSuccess) onSuccess();
      resetState();
      onClose();
    } catch {
      setIsSubmitting(false);
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
                calendarTarget === 'end' && scheduledAt ? parseDateString(scheduledAt) : undefined
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
            tierOptions={tierOptions}
          />
        ) : (
          <MessageContentStep
            templates={templates}
            isLoadingTemplates={isLoadingTemplates}
            templateId={templateId}
            onChangeTemplateId={setTemplateId}
            variableConfigs={variableConfigs}
            onUpdateVariableConfig={handleUpdateVariableConfig}
            currentTemplate={currentTemplate}
            reachCount={reachCount}
          />
        )}
      </SharedFormModal>
    </>
  );
}
