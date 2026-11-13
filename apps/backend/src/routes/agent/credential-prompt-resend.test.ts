import { readFileSync } from 'node:fs'

import { describe, expect, test } from 'bun:test'

import { appendResendIntegrationLines } from './credential-prompt-sections-saas'

const skill = readFileSync(
  new URL('../../lib/agent/builtin-skills/skills/resend/SKILL.md', import.meta.url),
  'utf8',
)

describe('Resend sending guidance', () => {
  test('keeps named recipients as the default and points the one exception at the skill', () => {
    const lines: string[] = []

    appendResendIntegrationLines(
      lines,
      [{ integrationId: 'r1', label: 'mail', permission: 'sending_access' }] as never,
      't1',
    )
    const tip = lines.join('\n')

    expect(tip).toContain('to the recipients they named')
    expect(tip).toContain('standing email grant')
    expect(skill).toContain('## Standing email grant')
  })

  test('the skill binds a grant to a Trigger fire and an approved decision', () => {
    for (const field of [
      '- From:',
      '- Purpose and template:',
      '- Recipients:',
      '- Dedupe:',
      '- Per-run cap:',
    ]) {
      expect(skill).toContain(field)
    }
    expect(skill).toContain('`trigger:<id>`')
    expect(skill).toContain('category `approval`')
  })
})
