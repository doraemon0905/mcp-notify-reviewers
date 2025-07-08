import { MCPRequest, MCPResponse } from './types';
import express from 'express';
import cors from 'cors';

interface NotifyReviewersRequest {
  pullRequestUrl: string;
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
    if (!args.pullRequestUrl) {
      throw new Error('GitHub pull request URL is required');
    }

    const githubPrUrl = args.pullRequestUrl;
    
    // Step 1: Get reviewers from custom API
    const reviewersResponse = await fetch(`${process.env.CUSTOM_API_URL}/pull-request/reviewers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CUSTOM_API_TOKEN}`
      },
      body: JSON.stringify({ prUrl: githubPrUrl })
    });

    if (!reviewersResponse.ok) {
      throw new Error('Failed to fetch reviewers from custom API');
    }

    const reviewersData = await reviewersResponse.json() as { reviewers: string[] };
    const reviewers = reviewersData.reviewers || [];

    if (reviewers.length === 0) {
      return {
        success: true,
        result: {
          success: true,
          message: 'No reviewers found for this pull request'
        } as NotifyReviewersResponse
      };
    }

    // Step 2: Get Slack IDs for reviewers from custom API
    const slackIdsResponse = await fetch(`${process.env.CUSTOM_API_URL}/users/slack-ids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CUSTOM_API_TOKEN}`
      },
      body: JSON.stringify({ reviewers })
    });

    if (!slackIdsResponse.ok) {
      throw new Error('Failed to fetch Slack IDs for reviewers');
    }

    const slackIdsData = await slackIdsResponse.json() as { slackIds: string[] };
    const slackIds = slackIdsData.slackIds || [];

    if (slackIds.length === 0) {
      return {
        success: true,
        result: {
          success: true,
          message: 'No Slack IDs found for the reviewers'
        } as NotifyReviewersResponse
      };
    }

    // Step 3: Send notification to Slack via custom API
    const slackNotificationResponse = await fetch(`${process.env.CUSTOM_API_URL}/slack/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CUSTOM_API_TOKEN}`
      },
      body: JSON.stringify({
        reviewers: slackIds,
        prUrl: githubPrUrl,
        message: args.message || `Please review this pull request: ${githubPrUrl}`
      })
    });

    if (!slackNotificationResponse.ok) {
      throw new Error('Failed to send notification to Slack');
    }

    const notificationResult = await slackNotificationResponse.json() as { success: boolean };

    return {
      success: true,
      result: {
        success: true,
        message: `Successfully notified ${slackIds.length} reviewers in Slack: ${slackIds.join(', ')}`
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
