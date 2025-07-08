# MCP Notify Reviewers

A Message Communication Protocol (MCP) extension for Cursor IDE that notifies pull request reviewers via Slack.

## Features

- Integrates with Cursor IDE via MCP
- Notifies reviewers when assigned to a pull request
- Supports custom notification messages
- Uses a custom API for reviewer management
- Sends notifications via Slack

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mcp-notify-reviewers.git
cd mcp-notify-reviewers
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

Set the following environment variables:

- `CUSTOM_API_URL`: URL of your custom API
- `CUSTOM_API_TOKEN`: Authentication token for the custom API
- `MCP_PORT`: Port for the MCP server (default: 3000)

## Usage

### Using Docker

1. Build and start the container:
```bash
docker-compose up -d
```

2. Check the logs:
```bash
docker-compose logs -f
```

### Manual Start

1. Start the server:
```bash
npm start
```

## Development

1. Start in development mode:
```bash
npm run dev
```

2. Run tests:
```bash
npm test
```

3. Lint code:
```bash
npm run lint
```

4. Format code:
```bash
npm run format
```

## API Endpoints

- `POST /mcp`: Main MCP endpoint
- `GET /health`: Health check endpoint

## MCP Commands

### Notify Reviewers

Format: `Notify reviewers@https://github.com/owner/repo/pull/123`

Optional: Add a custom message after the URL.

## License

MIT
