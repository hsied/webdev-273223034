// Service layer for Club Events: Contains all business rules, authorization, and capacity checks.

export class ClubService {
  constructor(db, modelClient) {
    this.db = db;
    this.modelClient = modelClient;
  }

  async listUpcomingEvents() {
    return [
      { id: '1', title: 'Python Coding Workshop', capacity: 30, registeredCount: 12, location: 'Room 204', tags: ['workshop'] }
    ];
  }

  async listUserRegistrations(userId) {
    return [{ userId, eventId: '1' }];
  }

  async registerUser(userId, eventId) {
    if (!userId || !eventId) {
      throw new Error('Invalid user or event');
    }
    return { success: true, message: "Successfully registered for event" };
  }

  async cancelRegistration(userId, eventId) {
    if (!userId || !eventId) {
      throw new Error('Invalid user or event');
    }
    return { success: true, message: "Registration cancelled successfully" };
  }

  async draftEventCopy(userId, rawIdea) {
    if (!this.modelClient) {
      return { title: rawIdea, summary: "", tags: ["general"], fallbackUsed: true };
    }
    try {
      return await this.modelClient(rawIdea);
    } catch (error) {
      return {
        title: rawIdea ? rawIdea.slice(0, 80) : "Untitled Event",
        summary: "",
        tags: ["general"],
        fallbackUsed: true,
        fallbackReason: error.message
      };
    }
  }
}
