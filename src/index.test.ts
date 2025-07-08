import { handleMCPRequest } from './index';
import { MCPRequest } from './types';

describe('handleMCPRequest', () => {
  it('should handle notifyReviewers command successfully', async () => {
    const request: MCPRequest = {
      command: 'notifyReviewers',
      args: {
        pullRequestId: 'PR123',
        reviewers: ['user1', 'user2'],
        message: 'Please review this PR'
      }
    };

    const response = await handleMCPRequest(request);
    expect(response.success).toBe(true);
    expect(response.result).toBeDefined();
    if (response.success && response.result) {
      expect(response.result.success).toBe(true);
      expect(response.result.message).toContain('user1');
      expect(response.result.message).toContain('user2');
      expect(response.result.message).toContain('Please review this PR');
    }
  });

  it('should handle missing pullRequestId', async () => {
    const request: MCPRequest = {
      command: 'notifyReviewers',
      args: {
        pullRequestId: '',
        reviewers: ['user1']
      }
    };

    const response = await handleMCPRequest(request);
    expect(response.success).toBe(false);
    expect(response.error).toBe('Pull request ID is required');
  });

  it('should handle missing reviewers', async () => {
    const request: MCPRequest = {
      command: 'notifyReviewers',
      args: {
        pullRequestId: 'PR123',
        reviewers: []
      }
    };

    const response = await handleMCPRequest(request);
    expect(response.success).toBe(false);
    expect(response.error).toBe('At least one reviewer is required');
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
