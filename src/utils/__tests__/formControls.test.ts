import { describe, it, expect } from 'vitest';
import { emailBlacklistValidator } from '../formControls';

describe('formControlsUtils', () => {
  describe('emailBlacklistValidator', () => {
    it('should not allow blacklisted emails', () => {
      const emailBlacklist = ['mail.com'];
      expect(emailBlacklistValidator('test@mail.com', emailBlacklist)).toBe(true);
    });

    it('should allow not blacklisted emails', () => {
      const emailBlacklist = ['mail.com'];
      expect(emailBlacklistValidator('test@mail.ru', emailBlacklist)).toBe(false);
    });
  });
});
