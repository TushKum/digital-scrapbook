import { alertRepository } from '../repositories/alertRepository';
import { authService } from './authService';
import { AppError } from '../errors/AppError';
import { NEXT_ACTION, STATUS_AFTER, toAlertDTO, type AlertDTO, type AlertStatus } from '../domain/alerts';
import type { AdvanceAlertInput } from '../schemas';

export const alertService = {
  async list(): Promise<AlertDTO[]> {
    const rows = await alertRepository.findAll();
    return rows.map(toAlertDTO);
  },

  // Advance an alert one step through acknowledge -> assign -> act -> verify ->
  // close. The action must be the exact next step for the current status; the
  // acting officer (from the JWT) is recorded as the event actor.
  async advance(id: string, input: AdvanceAlertInput, userId: string): Promise<AlertDTO> {
    const alert = await alertRepository.findById(id);
    if (!alert) throw AppError.notFound(`Alert '${id}' not found`, { id });

    const expected = NEXT_ACTION[alert.status as AlertStatus];
    if (!expected) throw AppError.conflict('Alert is already closed', { status: alert.status });
    if (input.action !== expected) {
      throw AppError.conflict(`Expected next action '${expected}', got '${input.action}'`, {
        expected,
        got: input.action,
      });
    }

    const officer = await authService.getById(userId);
    const now = new Date();
    const row = await alertRepository.advance(
      id,
      STATUS_AFTER[input.action],
      input.action === 'close' ? now : null,
      { action: input.action, actor: officer.displayName, note: input.note ?? null, at: now },
    );
    return toAlertDTO(row!);
  },
};
