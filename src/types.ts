/**
 * MCP Request interface for notify-reviewers commands
 */
export interface MCPRequest {
  /**
   * The command to execute
   * Currently supported: 'notifyReviewers'
   */
  command: string;

  /**
   * Arguments for the command
   */
  args: NotifyReviewersArgs;
}

/**
 * Arguments for the notifyReviewers command
 */
export interface NotifyReviewersArgs {
  /**
   * GitHub pull request URL
   * Format: https://github.com/owner/repo/pull/123
   */
  pullRequestUrl: string;

  /**
   * Optional custom message to send to reviewers
   */
  message?: string;
}

/**
 * MCP Response interface
 */
export interface MCPResponse {
  /**
   * Whether the command executed successfully
   */
  success: boolean;

  /**
   * Error message if success is false
   */
  error?: string;

  /**
   * Result data if success is true
   */
  result?: NotifyReviewersResult;
}

/**
 * Result data for notifyReviewers command
 */
export interface NotifyReviewersResult {
  /**
   * Whether the notification was sent successfully
   */
  success: boolean;

  /**
   * Status message about the notification
   */
  message: string;

  /**
   * List of notified reviewers
   */
  notifiedReviewers?: string[];
} 
