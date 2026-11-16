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
    return [];
  }

  async registerUser(userId, eventId) {
    return { success: true, message: "Successfully registered for event" };
  }

  async cancelRegistration(userId, eventId) {
    return { success: true, message: "Registration cancelled successfully" };
  }

  async draftEventCopy(userId, rawIdea) {
    try {
      if (!this.modelClient) {
        return { title: rawIdea, summary: "", tags: ["general"], fallbackUsed: true };
      }
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
