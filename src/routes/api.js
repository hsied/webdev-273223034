import express from 'express';

export function createApiRouter(clubService) {
  const router = express.Router();

  // GET /api/events - List upcoming events
  router.get('/events', async (req, res) => {
    try {
      const events = await clubService.listUpcomingEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/registrations - List user registrations
  router.get('/registrations', async (req, res) => {
    try {
      // Mocking user ID from session/token header for now
      const userId = req.headers['x-user-id'] || 'default-user';
      const regs = await clubService.listUserRegistrations(userId);
      res.json(regs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/events/:id/register - Register for an event
  router.post('/events/:id/register', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] || 'default-user';
      const eventId = req.params.id;
      const result = await clubService.registerUser(userId, eventId);
      res.status(201).json(result);
    } catch (error) {
      if (error.message.includes('capacity') || error.message.includes('conflict')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE /api/events/:id/register - Cancel registration
  router.delete('/events/:id/register', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] || 'default-user';
      const eventId = req.params.id;
      const result = await clubService.cancelRegistration(userId, eventId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // POST /api/ai/draft - Generate event draft with Gemini
  router.post('/ai/draft', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] || 'default-user';
      const { idea } = req.body;
      const draft = await clubService.draftEventCopy(userId, idea);
      res.json(draft);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
