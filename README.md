# Website Builder Form

A simple web application that collects business information and submits it to a Notion database and N8N webhook.

## Features

- **Multi-step form** for collecting business information, design preferences, and content
- **Notion integration** to save form data to a Notion database
- **N8N webhook** integration to trigger automated workflows
- **Responsive design** with modern UI components
- **Form validation** with real-time error handling

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Form Handling**: React Hook Form with Zod validation
- **API Integration**: Notion API client
- **Deployment**: Vercel/Netlify ready

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/henryroman/website-builder.git
cd website-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your environment variables:

```env
# Notion Integration
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here

# N8N Webhook Integration
N8N_WEBHOOK_URL=your_n8n_webhook_url_here

# Database (if needed for future use)
DATABASE_URL="file:./dev.db"
```

### 4. Notion Setup

1. Create a Notion integration at [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Create a new database in Notion with the following properties:
   - **BusinessName** (Title)
   - **Description** (Rich Text)
   - **Industry** (Select)
   - **Email** (Email)
   - **Phone** (Phone Number)
   - **Address** (Rich Text)
   - **PrimaryColor** (Rich Text)
   - **SecondaryColor** (Rich Text)
   - **Template** (Select)
   - **Services** (Rich Text)
   - **Products** (Rich Text)
   - **Hours** (Rich Text)
   - **Features** (Rich Text)
   - **CreatedAt** (Date)
3. Share the database with your integration
4. Copy the integration token and database ID to your `.env.local` file

### 5. N8N Setup

1. Set up an N8N instance (self-hosted or cloud)
2. Create a new workflow with a Webhook trigger
3. Copy the webhook URL to your `.env.local` file
4. Configure your workflow to process the form data

### 6. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── websites/
│   │       └── generate/
│   │           └── route.ts    # API endpoint for form submission
│   ├── website-builder/
│   │   └── page.tsx           # Multi-step form component
│   ├── page.tsx               # Homepage
│   └── layout.tsx             # Root layout
├── components/
│   └── ui/                    # shadcn/ui components
└── lib/
    └── db/                    # Database utilities (if needed)
```

## API Endpoints

### POST `/api/websites/generate`

Submits form data to Notion database and N8N webhook.

**Request Body:**
```json
{
  "businessInfo": {
    "businessName": "string",
    "description": "string",
    "industry": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "designPreferences": {
    "primaryColor": "string",
    "secondaryColor": "string",
    "template": "string",
    "layout": "string",
    "style": "string"
  },
  "websiteContent": {
    "services": "string",
    "products": "string",
    "hours": "string",
    "features": "string"
  }
}
```

**Response:**
```json
{
  "success": true,
  "notionResult": {},
  "webhookResult": {},
  "message": "Data processed successfully"
}
```

## Form Flow

1. **Business Information**: Collect basic business details (name, description, contact info, address)
2. **Design Preferences**: Choose template, layout, style, and colors
3. **Website Content**: Add services, products, operating hours, and features

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Error Handling

The application includes comprehensive error handling:

- Form validation with real-time feedback
- Graceful fallback if Notion or N8N services are unavailable
- User-friendly error messages
- Detailed logging for debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.