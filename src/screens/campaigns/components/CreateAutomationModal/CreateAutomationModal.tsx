import React, { useState, useEffect } from 'react';
import { SharedFormModal, AlertModal } from '@/components/shared';
import { CreateCampaignPayload } from '@/api/endpoints/campaignApi';
import type { Campaign, VariableConfig, TriggerType, WeekdayCode } from '@/types/campaign';
import {
  useMetaTemplates,
  useCreateCampaign,
  useUpdateCampaign,
  useEstimatedReach,
} from '@/hooks/campaigns/useCampaigns';
import { useLoyaltyConfig } from '@/hooks/loyalty/useLoyaltyConfig';
import TriggerTypeStep from './TriggerTypeStep';
import AutomationAudienceStep from './AutomationAudienceStep';
import AutomationTimingStep from './AutomationTimingStep';
import MessageContentStep from '../CreateCampaignModal/MessageContentStep';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Campaign;
}

type Step = 'trigger' | 'audience' | 'timing' | 'message';

const DEFAULT_SEND_WINDOW_DAYS: WeekdayCode[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export default function CreateAutomationModal({ visible, onClose, onSuccess, initialData }: Props) {
  const isEditing = !!initialData?._id;
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

  // The trigger-type step is skipped entirely when editing — `trigger.type` is immutable
  // after creation.
  const steps: Step[] = isEditing
    ? ['audience', 'timing', 'message']
    : ['trigger', 'audience', 'timing', 'message'];
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[stepIndex];

  const [name, setName] = useState(initialData?.name || '');
  const [triggerType, setTriggerType] = useState<TriggerType | null>(
    initialData?.trigger?.type ?? (isEditing ? null : 'post_checkout'),
  );
  const [days, setDays] = useState(initialData?.trigger?.days?.toString() ?? '');

  const [templateId, setTemplateId] = useState(initialData?.templateId || '');
  const [templateVars, setTemplateVars] = useState<Record<string, string>>(
    initialData?.templateVariables || {},
  );
  const [variableConfigs, setVariableConfigs] = useState<Record<string, VariableConfig>>({});

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

  const [startHour, setStartHour] = useState(
    initialData?.sendWindow?.startHour?.toString() ?? '10',
  );
  const [endHour, setEndHour] = useState(initialData?.sendWindow?.endHour?.toString() ?? '20');
  const [sendWindowDays, setSendWindowDays] = useState<WeekdayCode[]>(
    initialData?.sendWindow?.days ?? DEFAULT_SEND_WINDOW_DAYS,
  );
  const [priority, setPriority] = useState(initialData?.priority?.toString() ?? '');

  const [reachCount, setReachCount] = useState<number | null>(null);
  const [isLoadingReach, setIsLoadingReach] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', content: '' });

  const showAlert = (title: string, content: string) => {
    setAlertConfig({ visible: true, title, content });
  };

  const resetState = () => {
    setStepIndex(0);
    setName(initialData?.name || '');
    setTriggerType(initialData?.trigger?.type ?? (isEditing ? null : 'post_checkout'));
    setDays(initialData?.trigger?.days?.toString() ?? '');
    if (templates && templates.length > 0) {
      setTemplateId(initialData?.templateId || templates[0].id);
    } else {
      setTemplateId(initialData?.templateId || '');
    }
    setTemplateVars(initialData?.templateVariables || {});
    setVariableConfigs({});
    setSelectedTiers((initialData?.filters?.tier as string[]) || ['All']);
    setStartHour(initialData?.sendWindow?.startHour?.toString() ?? '10');
    setEndHour(initialData?.sendWindow?.endHour?.toString() ?? '20');
    setSendWindowDays(initialData?.sendWindow?.days ?? DEFAULT_SEND_WINDOW_DAYS);
    setPriority(initialData?.priority?.toString() ?? '');
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

  const toggleSendWindowDay = (day: WeekdayCode) => {
    setSendWindowDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));
  };

  const currentTemplate = templates?.find(t => t.id === templateId);

  useEffect(() => {
    if (templates && templates.length > 0 && !templateId) {
      const timer = setTimeout(() => {
        setTemplateId(templates[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [templates, templateId]);

  const needsSendWindow = triggerType !== 'post_checkout';
  const needsPriority = triggerType !== 'post_checkout';

  const validateTriggerStep = (): boolean => {
    if (!triggerType) {
      showAlert('Error', 'Please choose when this automation should send.');
      return false;
    }
    if (triggerType === 'days_since_visit') {
      const daysNum = Number(days);
      if (!Number.isInteger(daysNum) || daysNum < 1) {
        showAlert('Error', 'Days after visit must be a whole number of at least 1.');
        return false;
      }
    }
    return true;
  };

  const validateTimingStep = (): boolean => {
    if (needsSendWindow) {
      const startNum = Number(startHour);
      const endNum = Number(endHour);
      if (
        !Number.isInteger(startNum) ||
        !Number.isInteger(endNum) ||
        startNum < 0 ||
        endNum > 24 ||
        startNum >= endNum
      ) {
        showAlert('Error', 'Send window must have a start hour before the end hour (0–24).');
        return false;
      }
      if (sendWindowDays.length === 0) {
        showAlert('Error', 'Select at least one day for the send window.');
        return false;
      }
    }
    if (needsPriority) {
      const priorityNum = Number(priority);
      if (!Number.isInteger(priorityNum) || priorityNum < 1) {
        showAlert('Error', 'Priority must be a whole number, 1 or higher.');
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (currentStep === 'trigger' && !validateTriggerStep()) return;
    if (currentStep === 'audience' && !name.trim()) {
      showAlert('Error', 'Automation name is required.');
      return;
    }
    if (currentStep === 'timing' && !validateTimingStep()) return;
    setStepIndex(i => Math.min(i + 1, steps.length - 1));
  };

  const goBack = () => setStepIndex(i => Math.max(i - 1, 0));

  const submitPayload = async (isDraft: boolean) => {
    if (!name.trim()) {
      showAlert('Error', 'Automation name is required.');
      return;
    }
    if (!templateId) {
      showAlert('Error', 'Please select a template.');
      return;
    }
    if (!triggerType) {
      showAlert('Error', 'Please choose when this automation should send.');
      return;
    }
    if (!validateTimingStep()) return;

    setIsSubmitting(true);

    const payload: CreateCampaignPayload = {
      name,
      templateId,
      templateVariables: templateVars,
      variableConfigs,
      type: 'trigger',
      trigger:
        triggerType === 'days_since_visit'
          ? { type: triggerType, days: Number(days) }
          : { type: triggerType },
      filters: {
        tier: selectedTiers,
      },
      recipientCount: reachCount || 0,
      status: isDraft ? 'draft' : 'pending_approval',
      metadata: {},
    };

    if (needsSendWindow) {
      payload.sendWindow = {
        startHour: Number(startHour),
        endHour: Number(endHour),
        days: sendWindowDays,
      };
    }
    if (needsPriority) {
      payload.priority = Number(priority);
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
        initialData?._id ? 'Failed to update automation.' : 'Failed to create automation.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles: Record<Step, string> = {
    trigger: 'When to Send',
    audience: 'Audience',
    timing: 'Timing & Priority',
    message: 'Message Content',
  };

  const isLastStep = currentStep === 'message';

  return (
    <>
      <SharedFormModal
        visible={visible}
        title={stepTitles[currentStep]}
        buttonLabel={isLastStep ? 'Submit for Approval' : 'Continue'}
        onSubmit={() => {
          if (isLastStep) {
            submitPayload(false);
          } else {
            goNext();
          }
        }}
        secondaryButtonLabel={isLastStep ? 'Save Draft' : undefined}
        onSecondarySubmit={isLastStep ? () => submitPayload(true) : undefined}
        isSubmitting={isSubmitting}
        onClose={handleClose}
        onBack={stepIndex > 0 ? goBack : undefined}
        overlay={
          <AlertModal
            visible={alertConfig.visible}
            onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
            title={alertConfig.title}
            content={alertConfig.content}
            iconVariant="danger"
            useModal={false}
          />
        }
      >
        {currentStep === 'trigger' && (
          <TriggerTypeStep
            triggerType={triggerType}
            onChangeTriggerType={setTriggerType}
            days={days}
            onChangeDays={setDays}
            locked={isEditing}
          />
        )}
        {currentStep === 'audience' && (
          <AutomationAudienceStep
            name={name}
            onChangeName={setName}
            selectedTiers={selectedTiers}
            onToggleTier={toggleTier}
            reachCount={reachCount}
            isLoadingReach={isLoadingReach}
            tierOptions={tierOptions}
          />
        )}
        {currentStep === 'timing' && (
          <AutomationTimingStep
            showSendWindow={needsSendWindow}
            startHour={startHour}
            endHour={endHour}
            onChangeStartHour={setStartHour}
            onChangeEndHour={setEndHour}
            selectedDays={sendWindowDays}
            onToggleDay={toggleSendWindowDay}
            showPriority={needsPriority}
            priority={priority}
            onChangePriority={setPriority}
          />
        )}
        {currentStep === 'message' && (
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
