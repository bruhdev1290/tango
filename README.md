# Taiga Mobile

An Ionic Framework mobile client for Taiga project management platform. Supports both the official Taiga.io service and self-hosted Taiga instances.

## Features

- **Multi-Server Support**: Connect to Taiga.io or your self-hosted instance
- **Authentication**: Login, Register, Forgot Password
- **Projects**: View projects, search, like, watch
- **Backlog**: View and manage user stories
- **Kanban Board**: Visual task management
- **Issues**: Bug tracking, questions, and enhancements
- **Sprints/Milestones**: Sprint planning and tracking
- **User Stories**: Full detail view with voting and watching
- **Tasks**: Task management with blocking/unblocking
- **Profile**: User profile management

## Tech Stack

- **Framework**: Ionic 7 + Angular 17
- **UI Components**: Ionic UI Components
- **State Management**: RxJS BehaviorSubjects
- **Storage**: Capacitor Preferences
- **HTTP**: Angular HttpClient with Interceptors
- **Mobile**: Capacitor for iOS/Android builds

## Prerequisites

- Node.js 18+
- npm 9+ or yarn
- Ionic CLI: `npm install -g @ionic/cli`

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd taiga-mobile

# Install dependencies
npm install

# Run in browser
ionic serve

# Run on Android
ionic capacitor add android
ionic capacitor open android

# Run on iOS
ionic capacitor add ios
ionic capacitor open ios
```

## Server Configuration

### Official Taiga.io (Default)

The app comes pre-configured with the official Taiga.io server:
- **Name**: Taiga.io (Official)
- **URL**: https://api.taiga.io/api/v1

### Self-Hosted Taiga Instances

You can easily add your own self-hosted Taiga server:

#### From Login Screen
1. Tap on the server card showing "Taiga.io (Official)"
2. Select "Manage Servers" to add a new server
3. Or select another configured server from the list

#### From Server Management Page
1. Go to Login → Manage Servers
2. Tap "Add New Server"
3. Enter:
   - **Server Name**: A friendly name (e.g., "My Company Taiga")
   - **Server URL**: Your Taiga instance URL (e.g., `https://taiga.mycompany.com`)
   - **Set as default**: (Optional) Make this your default server
4. Tap "Test Connection" to verify connectivity
5. Tap "Add Server" to save

#### URL Format

The app automatically handles URL formatting:
- Base URL: `https://taiga.mycompany.com`
- Automatically converts to: `https://taiga.mycompany.com/api/v1`
- You can also enter the full API URL directly

### Server Features

- **Multiple Servers**: Configure and switch between multiple Taiga instances
- **Connection Testing**: Test server connectivity before adding
- **Default Server**: Set a default server for automatic selection
- **Quick Switch**: Switch servers from login screen or profile page
- **Persistent Storage**: Server configurations are saved locally

### Server Requirements

For self-hosted Taiga instances, ensure:

1. **Taiga API is accessible**: The `/api/v1` endpoint should be reachable
2. **CORS is configured**: Allow requests from the mobile app origin
3. **HTTPS is enabled**: For secure connections (recommended)

Example CORS configuration for Taiga:
```python
# config.py or local.py
HTTP_ALLOWED_ORIGINS = [
    "https://your-app-domain.com",
    "capacitor://localhost",  # For iOS
    "http://localhost",       # For Android/Web
]
```

## Project Structure

```
src/
├── app/
│   ├── models/           # TypeScript interfaces
│   ├── services/         # API services
│   │   └── server-config.service.ts  # Server management
│   ├── pages/            # Page components
│   │   ├── login/
│   │   ├── server-management/  # Server configuration page
│   │   └── ...
│   ├── guards/           # Route guards
│   └── interceptors/     # HTTP interceptors
├── assets/               # Static assets
├── environments/         # Environment configs
└── theme/                # Theme variables
```

## API Integration

The app dynamically uses the configured server's API URL for all requests. The `ServerConfigService` provides the active server URL to all API services.

### Authentication
- `POST /auth` - Login
- `POST /auth/register` - Register
- `GET /users/me` - Current user

### Projects
- `GET /projects` - List projects
- `GET /projects/:id` - Project details

### User Stories, Tasks, Issues
All endpoints use the configured server URL dynamically.

## Development

```bash
# Serve with hot reload
ionic serve

# Build for production
ionic build --prod

# Lint
npm run lint

# Add platforms
ionic capacitor add android
ionic capacitor add ios

# Sync after build
ionic capacitor sync
```

## Environment Variables

The app uses runtime server configuration via `ServerConfigService`, but you can still set defaults in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  defaultApiUrl: 'https://api.taiga.io/api/v1'
};
```

## Troubleshooting

### Connection Issues

If you can't connect to your self-hosted server:

1. **Verify URL**: Make sure the URL is correct and accessible
2. **Check CORS**: Ensure CORS is properly configured on your Taiga instance
3. **HTTPS**: Self-signed certificates may cause issues on mobile devices
4. **Network**: Ensure your device can reach the server network

### Reset Server Configuration

To reset to default (Taiga.io):
1. Go to Profile → Server Configuration
2. Delete all custom servers
3. The app will automatically reset to default

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Resources

- [Taiga Documentation](https://docs.taiga.io/)
- [Taiga API Docs](https://docs.taiga.io/api.html)
- [Taiga Docker Setup](https://docs.taiga.io/setup-production.html)
- [Ionic Framework](https://ionicframework.com/)
- [Angular](https://angular.io/)

## Support

For issues and feature requests, please use the GitHub issue tracker.

For Taiga-specific questions, refer to the [Taiga community](https://community.taiga.io/).
