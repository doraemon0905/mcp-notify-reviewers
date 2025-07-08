  import { handleMCPRequest } from './index';
  import { MCPRequest } from './types';

  // Mock fetch globally
  global.fetch = jest.fn();

  describe('handleMCPRequest', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      // Set up environment variables
      process.env.CUSTOM_API_URL = 'https://api.example.com';
      process.env.CUSTOM_API_TOKEN = 'test-token';
    });

    it('should handle notifyReviewers command successfully', async () => {
      // Mock successful API responses
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ reviewers: ['user1', 'user2'] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ slackIds: ['slack1', 'slack2'] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        });

      const request: MCPRequest = {
        command: 'notifyReviewers',
        args: {
          pullRequestUrl: 'https://github.com/org/repo/pull/123',
          reviewers: ['user1', 'user2'],
          message: 'Please review this PR'
        }
      };

      const response = await handleMCPRequest(request);
      expect(response.success).toBe(true);
      expect(response.result).toBeDefined();
      if (response.success && response.result) {
        expect(response.result.success).toBe(true);
        expect(response.result.message).toContain('Successfully notified');
        expect(response.result.message).toContain('slack1');
        expect(response.result.message).toContain('slack2');
      }
    });

    it('should handle missing pullRequestUrl', async () => {
      const request: MCPRequest = {
        command: 'notifyReviewers',
        args: {
          pullRequestUrl: '',
          reviewers: ['user1']
        }
      };

      const response = await handleMCPRequest(request);
      expect(response.success).toBe(false);
      expect(response.error).toBe('GitHub pull request URL is required');
    });

    it('should handle no reviewers found', async () => {
      // Mock API response with no reviewers
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ reviewers: [] })
      });

      const request: MCPRequest = {
        command: 'notifyReviewers',
        args: {
          pullRequestUrl: 'https://github.com/org/repo/pull/123',
          reviewers: []
        }
      };

      const response = await handleMCPRequest(request);
      expect(response.success).toBe(true);
      expect(response.result).toBeDefined();
      if (response.success && response.result) {
        expect(response.result.success).toBe(true);
        expect(response.result.message).toBe('No reviewers found for this pull request');
      }
    });

    it('should handle API failure', async () => {
      // Mock failed API response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const request: MCPRequest = {
        command: 'notifyReviewers',
        args: {
          pullRequestUrl: 'https://github.com/org/repo/pull/123',
          reviewers: ['user1']
        }
      };

      const response = await handleMCPRequest(request);
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to fetch reviewers from custom API');
    });

    it('should handle unknown command', async () => {
      const request: MCPRequest = {
        command: 'unknownCommand',
        args: {}
      };

      const response = await handleMCPRequest(request);
      expect(response.success).toBe(false);
      expect(response.error).toContain('Unknown command');
    });
  });
