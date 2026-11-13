import { api } from '../api'
import { toast } from '../components/ui/toast'
import { t } from '../i18n'

/** Copies a Bot's current instructions, read when asked, never a transcript's clipped copy. */
export async function copyBotInstructions(teamId: string, botId: string) {
  try {
    const { instructions } = await api.agentGetConversation(botId, teamId, {
      tail: 1,
      messages: 'omit',
      runtimeState: 'omit',
    })

    if (!instructions) return toast.info(t('This Bot has no instructions yet'))
    await navigator.clipboard.writeText(instructions)
    toast.success(t('Instructions copied'), undefined, { timeoutMs: 1200, dedupe: false })
  } catch (err) {
    toast.apiError(t('Could not copy instructions'), err)
  }
}
