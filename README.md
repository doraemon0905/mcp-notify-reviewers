# MCP Notify Reviewers

A Cursor MCP extension for notifying code reviewers about pull requests that need their attention.

## Features

- Notify reviewers about pull requests that need review
- Customizable notification messages
- Simple integration with Cursor's MCP protocol
- Docker support for easy deployment

## Installation

### Option 1: NPM Installation (Recommended)

```bash
# Install the stable version
npm install @cursor/mcp-notify-reviewers

# Or install the beta version for latest features
npm install @cursor/mcp-notify-reviewers@beta
```

### Option 2: Docker Installation

The easiest way to run this MCP extension is using Docker:

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/mcp-notify-reviewers.git
   cd mcp-notify-reviewers
   ```

2. Start the MCP service using Docker Compose:
   ```bash
   docker-compose up -d
   ```

That's it! The MCP service will automatically:
- Build and run in a container
- Expose port 3000 for Cursor to connect
- Mount the necessary MCP configuration
- Restart automatically if it crashes

To check if the service is running:
```bash
curl http://localhost:3000/health
```

To stop the service:
```bash
docker-compose down
```

### Option 3: Local Development
1. Clone this repository
2. Install dependencies:
```bash
npm install
```
3. Build the project:
```bash
npm run build
```
4. Start the server:
```bash
npm start
```

### Option 4: Manual Installation in Cursor MCP

To manually install this extension in Cursor's MCP system:

1. Open Cursor and navigate to your MCP configuration directory:
   ```bash
   cd ~/.cursor/mcp/
   ```

2. Create a new directory for this extension:
   ```bash
   mkdir notify-reviewers
   ```

3. Copy the built files to the MCP directory:
   ```bash
   cp -r /path/to/this/repo/dist/* ~/.cursor/mcp/notify-reviewers/
   ```

4. Add the extension to your Cursor MCP configuration file (`~/.cursor/mcp/config.json`):
   ```json
   {
     "extensions": {
       "notify-reviewers": {
         "path": "notify-reviewers/index.js"
       }
     }
   }
   ```

5. Restart Cursor to load the new MCP extension

## Usage

This MCP extension provides a command to notify reviewers about pull requests. You can use it through Cursor's MCP interface with the following command:

```typescript
// Example usage
const response = await cursor.mcp.request({
  command: 'notifyReviewers',
  args: {
    pullRequestId: 'PR_ID',
    reviewers: ['reviewer1', 'reviewer2'],
    message: 'Please review this urgent PR!' // Optional
  }
});
```

### Command: notifyReviewers

Parameters:
- `pullRequestId` (string, required): The ID of the pull request that needs review
- `reviewers` (string[], required): Array of reviewer usernames to notify
- `message` (string, optional): Custom notification message. If not provided, a default message will be used

Response:
```typescript
{
  success: boolean;
  message: string;
}
```

### API Endpoints

When running in Docker or standalone mode, the following endpoints are available:

- `POST /mcp`: Main endpoint for MCP commands
  ```bash
  curl -X POST http://localhost:3000/mcp \
    -H "Content-Type: application/json" \
    -d '{"command": "notifyReviewers", "args": {"pullRequestId": "123", "reviewers": ["user1"]}}'
  ```

- `GET /health`: Health check endpoint
  ```bash
  curl http://localhost:3000/health
  ```

## Development

1. Make your changes in the `src` directory
2. Run tests:
```bash
npm test
```
3. Build the project:
```bash
npm run build
```

## Publishing

This package is automatically published to npm using GitHub Actions:

- When a new release is created on GitHub, a stable version is published to npm
- When changes are pushed to the main branch, a beta version is published to npm

To publish a new version:

1. For stable releases:
   - Create a new release on GitHub
   - The workflow will automatically publish to npm

2. For beta releases:
   - Push changes to the main branch
   - The workflow will automatically publish a beta version to npm

## License

MIT
