import { MCPRequest, MCPResponse, NotifyReviewersArgs, NotifyReviewersResult } from './types';
import express from 'express';
import cors from 'cors';

/**
 * Handle incoming MCP requests
 */
export async function handleMCPRequest(request: MCPRequest): Promise<MCPResponse> {
  try {
    switch (request.command) {
      case 'notifyReviewers':
        return await handleNotifyReviewers(request.args);
      default:
        return {
          success: false,
          error: `Unsupported command: ${request.command}. Only 'notifyReviewers' is supported.`
        };
    }
  } catch (error) {
    console.error('Error handling MCP request:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Handle the notifyReviewers command
 */
async function handleNotifyReviewers(args: NotifyReviewersArgs): Promise<MCPResponse> {
  try {
    // Validate input
    if (!args.pullRequestUrl) {
      throw new Error('GitHub pull request URL is required');
    }

    if (!args.pullRequestUrl.match(/^https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+$/)) {
      throw new Error('Invalid GitHub pull request URL format. Expected: https://github.com/owner/repo/pull/123');
    }

    const githubPrUrl = args.pullRequestUrl;
    
    // Validate environment variables
    if (!process.env.CUSTOM_API_URL) {
      throw new Error('CUSTOM_API_URL environment variable is not set');
    }
    if (!process.env.CUSTOM_API_TOKEN) {
      throw new Error('CUSTOM_API_TOKEN environment variable is not set');
    }

    // Step 1: Get reviewers from custom API
    console.log('Fetching reviewers for PR:', githubPrUrl);
    const reviewersResponse = await fetch(`${process.env.CUSTOM_API_URL}/pull-request/reviewers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CUSTOM_API_TOKEN}`
      },
      body: JSON.stringify({ prUrl: githubPrUrl })
    });

    if (!reviewersResponse.ok) {
      const errorText = await reviewersResponse.text();
      throw new Error(`Failed to fetch reviewers: ${errorText}`);
    }

    const reviewersData = await reviewersResponse.json() as { reviewers: string[] };
    const reviewers = reviewersData.reviewers || [];

    if (reviewers.length === 0) {
      return {
        success: true,
        result: {
          success: true,
          message: 'No reviewers found for this pull request',
          notifiedReviewers: []
        }
      };
    }

    // Step 2: Get Slack IDs for reviewers
    console.log('Fetching Slack IDs for reviewers:', reviewers);
    const slackIdsResponse = await fetch(`${process.env.CUSTOM_API_URL}/users/slack-ids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CUSTOM_API_TOKEN}`
      },
      body: JSON.stringify({ reviewers })
    });

    if (!slackIdsResponse.ok) {
      const errorText = await slackIdsResponse.text();
      throw new Error(`Failed to fetch Slack IDs: ${errorText}`);
    }

    const slackIdsData = await slackIdsResponse.json() as { slackIds: string[] };
    const slackIds = slackIdsData.slackIds || [];

    if (slackIds.length === 0) {
      return {
        success: true,
        result: {
          success: true,
          message: 'No Slack IDs found for the reviewers',
          notifiedReviewers: []
        }
      };
    }

    // Step 3: Send notifications
    console.log('Sending Slack notifications to:', slackIds);
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
      const errorText = await slackNotificationResponse.text();
      throw new Error(`Failed to send Slack notifications: ${errorText}`);
    }

    return {
      success: true,
      result: {
        success: true,
        message: `Successfully notified ${slackIds.length} reviewers`,
        notifiedReviewers: reviewers
      }
    };

  } catch (error) {
    console.error('Error in handleNotifyReviewers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to notify reviewers'
    };
  }
}

// Create Express server for Docker deployment
if (require.main === module) {
  const app = express();
  const port = process.env.PORT || process.env.MCP_PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy',
      version: process.env.npm_package_version || '1.0.0'
    });
  });

  // MCP endpoint
  app.post('/mcp', async (req, res) => {
    console.log('Received MCP request:', JSON.stringify(req.body, null, 2));
    const mcpRequest = req.body as MCPRequest;
    const response = await handleMCPRequest(mcpRequest);
    console.log('Sending MCP response:', JSON.stringify(response, null, 2));
    res.json(response);
  });

  app.listen(port, () => {
    console.log(`MCP Notify Reviewers server running on port ${port}`);
  });
} 
