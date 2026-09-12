import React, { useState, useEffect } from 'react';
import { SharedFormModal, AlertModal } from '@/components/shared';
import { CreateCampaignPayload } from '@/api/endpoints/campaignApi';
import type { Campaign, VariableConfig } from '@/types/campaign';
import {
  useMetaTemplates,
  useCreateCampaign,
  useUpdateCampaign,
  useEstimatedReach,
} from '@/hooks/campaigns/useCampaigns';
import { useLoyaltyConfig } from '@/hooks/loyalty/useLoyaltyConfig';
import AutomationAudienceStep from './AutomationAudienceStep';
import MessageContentStep from '../CreateCampaignModal/MessageContentStep';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Campaign;
}

// This pass only supports the `post_checkout` trigger type — the simplest one, with no
// send-window or priority configuration. `days_since_visit`/`tier_upgrade` (and the trigger-type
// picker to choose between them) land in a follow-up step.
export default function CreateAutomationModal({ visible, onClose, onSuccess, initialData }: Props) {
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

  const [reachCount, setReachCount] = useState<number | null>(null);
  const [isLoadingReach, setIsLoadingReach] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const currentTemplate = templates?.find(t => t.id === templateId);

  useEffect(() => {
    if (templates && templates.length > 0 && !templateId) {
      const timer = setTimeout(() => {
        setTemplateId(templates[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [templates, templateId]);

  const submitPayload = async (isDraft: boolean) => {
    if (!name.trim()) {
      showAlert('Error', 'Automation name is required.');
      return;
    }
    if (!templateId) {
      showAlert('Error', 'Please select a template.');
      return;
    }

    setIsSubmitting(true);

    const payload: CreateCampaignPayload = {
      name,
      templateId,
      templateVariables: templateVars,
      variableConfigs,
      type: 'trigger',
      trigger: { type: 'post_checkout' },
      filters: {
        tier: selectedTiers,
      },
      recipientCount: reachCount || 0,
      status: isDraft ? 'draft' : 'pending_approval',
      metadata: {},
    };

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

  return (
    <>
      <SharedFormModal
        visible={visible}
        title={currentPage === 1 ? 'Audience' : 'Message Content'}
        buttonLabel={currentPage === 1 ? 'Select Template' : 'Submit for Approval'}
        onSubmit={() => {
          if (currentPage === 1) {
            if (!name.trim()) {
              showAlert('Error', 'Automation name is required.');
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
        {currentPage === 1 ? (
          <AutomationAudienceStep
            name={name}
            onChangeName={setName}
            selectedTiers={selectedTiers}
            onToggleTier={toggleTier}
            reachCount={reachCount}
            isLoadingReach={isLoadingReach}
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
