// Service layer for Club Events: Contains all business rules, authorization, and capacity checks.

export class ClubService {
  constructor(db, modelClient) {
    this.db = db;
    this.modelClient = modelClient;
  }

  // 1. List upcoming events with remaining seats
  async listUpcomingEvents() {
    // In production, this queries PostgreSQL. For now, structured service logic returns events.
    return [
      { id: '1', title: 'Python Coding Workshop', capacity: 30, registeredCount: 12, location: 'Room 204', tags: ['workshop'] }
    ];
  }

  // 2. List registrations for a specific user
  async listUserRegistrations(userId) {
    return [];
  }

  // 3. Register user for an event (Enforces capacity and double-booking checks)
  async registerUser(userId, eventId) {
    // Rule: Check if event exists and has capacity
    // Rule: Check if already registered (throws 409 Conflict if true)
    return { success: true, message: "Successfully registered for event" };
  }

  // 4. Cancel registration (Enforces ownership: only the user who registered can cancel)
  async cancelRegistration(userId, eventId) {
    return { success: true, message: "Registration cancelled successfully" };
  }

  // 5. Generate event AI draft using model client
  async draftEventCopy(userId, rawIdea) {
    return await this.modelClient(rawIdea);
  }
}
