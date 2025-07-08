import { MCPRequest, MCPResponse } from './types';
import express from 'express';
import cors from 'cors';

interface NotifyReviewersRequest {
  pullRequestId: string;
  reviewers: string[];
  message?: string;
}

interface NotifyReviewersResponse {
  success: boolean;
  message: string;
}

export async function handleMCPRequest(request: MCPRequest): Promise<MCPResponse> {
  try {
    switch (request.command) {
      case 'notifyReviewers':
        return await handleNotifyReviewers(request.args as NotifyReviewersRequest);
      default:
        return {
          success: false,
          error: `Unknown command: ${request.command}`
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function handleNotifyReviewers(args: NotifyReviewersRequest): Promise<MCPResponse> {
  try {
    // Validate input
    if (!args.pullRequestId) {
      throw new Error('Pull request ID is required');
    }
    if (!args.reviewers || args.reviewers.length === 0) {
      throw new Error('At least one reviewer is required');
    }

    // Here you would implement the actual notification logic
    // For example, sending notifications through GitHub API or other channels
    const defaultMessage = `Please review PR #${args.pullRequestId}`;
    const notificationMessage = args.message || defaultMessage;

    // For now, we'll just return a success response
    // In a real implementation, you would integrate with your notification system
    return {
      success: true,
      result: {
        success: true,
        message: `Successfully notified reviewers: ${args.reviewers.join(', ')} with message: ${notificationMessage}`
      } as NotifyReviewersResponse
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to notify reviewers'
    };
  }
}

// Create Express server for Docker deployment
if (require.main === module) {
  const app = express();
  const port = process.env.MCP_PORT || 3000;

  app.use(cors());
  app.use(express.json());

  app.post('/mcp', async (req, res) => {
    const mcpRequest = req.body as MCPRequest;
    const response = await handleMCPRequest(mcpRequest);
    res.json(response);
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
  });

  app.listen(port, () => {
    console.log(`MCP Notify Reviewers server running on port ${port}`);
  });
} 
