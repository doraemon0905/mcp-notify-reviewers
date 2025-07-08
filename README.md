# MCP Notify Reviewers

An MCP extension for notifying code reviewers in Cursor.

## Features

- Notify reviewers about pull requests that need review
- Customizable notification messages
- Simple integration with Cursor's MCP protocol
- Docker support for easy deployment

## Installation

### Option 1: GitHub Packages Installation (Recommended)

First, authenticate with GitHub Packages by creating a `.npmrc` file in your project root:

```bash
@giangbeo91:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install the package:

```bash
# Install the latest version
npm install @giangbeo91/mcp-notify-reviewers
```

### Option 2: Docker Installation

The easiest way to run this MCP extension is using Docker:

1. Clone this repository:
   ```bash
   git clone https://github.com/giangbeo91/mcp-notify-reviewers.git
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
yarn install
```
3. Build the project:
```bash
yarn build
```
4. Start the server:
```bash
yarn start
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
yarn test
```
3. Build the project:
```bash
yarn build
```

## Publishing

This package is automatically published to GitHub Packages using GitHub Actions:

- When a new release is published on GitHub, the package will be automatically published to GitHub Packages
- The workflow will run tests and build before publishing

To publish a new version:

1. Update the version in package.json
2. Create and publish a new release on GitHub
3. The workflow will automatically publish to GitHub Packages

## License

MIT

## Docker Usage

You can run this MCP extension using Docker in two ways:

### 1. Using Docker Run

```bash
docker run -i --rm \
  -e CUSTOM_API_URL=your_api_url \
  ghcr.io/doraemon0905/mcp-notify-reviewers:latest
```

### 2. Using Docker Compose

1. Create a `.env` file with your configuration:
```bash
CUSTOM_API_URL=your_api_url
```

2. Run with docker-compose:
```bash
docker-compose up -d
```

## MCP Configuration

Add the following to your Cursor MCP configuration:

```json
{
  "command": "docker",
  "args": [
    "run",
    "-i",
    "--rm",
    "-e", "CUSTOM_API_URL",
    "ghcr.io/doraemon0905/mcp-notify-reviewers:latest"
  ],
  "env": {
    "CUSTOM_API_URL": "your_api_url"
  }
}
```

## Environment Variables

- `CUSTOM_API_URL`: Your custom API URL for the service
- `NODE_ENV`: Application environment (defaults to 'production' in Docker)

## Development

### Local Setup

1. Install dependencies:
```bash
yarn install
```

2. Build the project:
```bash
yarn build
```

3. Start the MCP extension:
```bash
yarn start
```

### Building Docker Image

```bash
docker build -t mcp-notify-reviewers .
```
