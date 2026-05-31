# NerdioWCP

React frontend deployed to Azure Static Web Apps with an Azure Functions backend and Cosmos DB.

## Project structure

```
/
├── frontend/   # Vite + React app
├── api/        # Azure Functions v4 (Node.js)
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local) v4
- An Azure Static Web Apps resource (for deployment)

## Local development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

### API

```bash
cd api
npm install
npm start
```

Copy `api/local.settings.json.example` to `api/local.settings.json` and fill in your values before running locally.

### Environment variables (Azure portal)

Configure these application settings on the Static Web App for the API:

- `COSMOS_CONNECTION_STRING`
- `COSMOS_DB_NAME`
- `ADMIN_KEY`

## Deployment

Deploy via GitHub Actions on push to `main`. After creating the Static Web App in Azure, add the deployment token as the GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN`.

The workflow builds the Vite app from `/frontend` and deploys the Azure Functions API from `/api`. SPA routing and `/api/*` proxying are configured in `frontend/public/staticwebapp.config.json`.
