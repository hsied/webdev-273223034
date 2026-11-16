import { describe, it, expect } from 'vitest';
import { ClubService } from '../src/services/clubService.js';

describe('ClubService Comprehensive Acceptance Tests', () => {
  it('[AC-6] allows authenticated user to list upcoming events', async () => {
    const service = new ClubService(null, null);
    const events = await service.listUpcomingEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveProperty('title');
  });

  it('allows listing user registrations', async () => {
    const service = new ClubService(null, null);
    const regs = await service.listUserRegistrations('user-1');
    expect(Array.isArray(regs)).toBe(true);
  });

  it('allows registering a user for an event', async () => {
    const service = new ClubService(null, null);
    const res = await service.registerUser('user-1', 'event-1');
    expect(res.success).toBe(true);
  });

  it('allows canceling a registration', async () => {
    const service = new ClubService(null, null);
    const res = await service.cancelRegistration('user-1', 'event-1');
    expect(res.success).toBe(true);
  });

  it('[AC-10] AI draft generator returns validated title and allowed tags', async () => {
    const fakeAi = async () => ({
      title: 'Generated Workshop Title',
      summary: 'Summary text',
      tags: ['workshop']
    });
    const service = new ClubService(null, fakeAi);
    const result = await service.draftEventCopy('user-1', 'Python coding idea');
    expect(result.title).toBe('Generated Workshop Title');
    expect(result.tags).toContain('workshop');
  });

  it('[AC-11] AI draft generator enforces fallback when model fails', async () => {
    const fakeAiFail = async () => {
      throw new Error('Rate limited');
    };
    const service = new ClubService(null, fakeAiFail);
    const result = await service.draftEventCopy('user-1', 'Fallback idea');
    expect(result.fallbackUsed).toBe(true);
    expect(result.fallbackReason).toBe('Rate limited');
  });

  it('AI draft generator handles null modelClient gracefully', async () => {
    const service = new ClubService(null, null);
    const result = await service.draftEventCopy('user-1', 'Direct idea');
    expect(result.fallbackUsed).toBe(true);
  });
});
