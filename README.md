# Data Orchestration UI

CopilotKit-powered frontend interface for the Data Orchestration Agent.

## Features

- **Split-Panel Interface**: Chat interface on the left, state visualizations on the right
- **Mode Selector**: Switch between Ask, Planning, and Action modes
- **Real-time State**: Live agent state and session information display
- **Tool Visualization**: Monitor tool execution status with visual badges
- **Responsive Design**: Built with Tailwind CSS for modern, responsive UI

## Prerequisites

- Node.js 18+ 
- npm or pnpm
- Running Data Orchestration Agent backend on port 8085

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
cp .env.local.example .env.local
# Edit .env.local if your backend is not on localhost:8085
```

3. **Start development server**:
```bash
npm run dev
```

4. **Open browser**:
Navigate to `http://localhost:3000`

## Environment Variables

- `NEXT_PUBLIC_COPILOTKIT_URL`: Backend URL (default: `http://localhost:8085`)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with CopilotKit provider
│   ├── page.tsx         # Main page with split-panel layout
│   └── globals.css      # Global styles
├── components/
│   ├── ModeSelector.tsx      # Mode switching dropdown
│   ├── StatePanel.tsx        # Right panel for state display
│   ├── ToolVisualization.tsx # Tool execution status
│   └── SessionInfo.tsx       # Session state information
```

## Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Docker

Build and run with Docker:

```bash
# Build image
docker build -t data-orchestration-ui .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_COPILOTKIT_URL=http://host.docker.internal:8085 \
  data-orchestration-ui
```

## Usage

### Ask Mode
- Search for BigQuery datasets
- Analyze data with SQL queries
- Query GraphQL APIs
- Explore data interactively

### Planning Mode
- Answer guided questions
- Create Data Product Requirement Prompts (PRPs)
- Design data products

### Action Mode
- Execute PRPs
- Discover source tables
- Generate SQL queries (with approval)
- Create GraphQL APIs (with approval)

## Architecture

The frontend connects to the Data Orchestration Agent backend via CopilotKit's AG-UI protocol:

```
┌─────────────────────────────────────┐
│   Frontend (Port 3000)              │
│   - CopilotKit React UI             │
│   - Split Panel Layout              │
│   - State Visualizations            │
└─────────────┬───────────────────────┘
              │ WebSocket/HTTP
┌─────────────▼───────────────────────┐
│   Backend (Port 8085)               │
│   - Data Orchestration Agent        │
│   - ADK with CopilotKit Wrapper     │
│   - MCP Services Integration        │
└─────────────────────────────────────┘
```

## Technologies

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: CopilotKit (React Core + React UI)
- **State Management**: React Hooks + CopilotKit useCoAgent

## Troubleshooting

### Backend Connection Issues

If the chat doesn't connect:
1. Ensure backend is running on port 8085
2. Check `NEXT_PUBLIC_COPILOTKIT_URL` in `.env.local`
3. Verify CORS is enabled on backend
4. Check browser console for errors

### Build Errors

If you get TypeScript errors during build:
```bash
rm -rf .next
npm run build
```

### Docker Issues

If Docker build fails:
1. Ensure `.dockerignore` is present
2. Check that `next.config.ts` has `output: 'standalone'`
3. Verify Node.js version is 18+

## Contributing

1. Create feature branch
2. Make changes with proper TypeScript types
3. Test with running backend
4. Submit pull request

## License

See LICENSE file for details.
