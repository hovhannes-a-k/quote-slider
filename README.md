# Quote Slider

A modern Angular application that displays inspirational quotes in an interactive carousel format. The application fetches quotes from multiple external APIs, displays them in a carousel with auto-play functionality, and allows users to rate each quote.

## Features

- **Multi-Source Quote Loading**: Fetches quotes from multiple APIs (Quotable.io and DummyJSON) concurrently
- **Interactive Carousel**: Navigate through quotes with keyboard arrows, auto-play, and manual controls
- **Quote Rating System**: Rate quotes on a scale and persist ratings
- **Lazy Loading**: Automatically loads more quotes when reaching the end of the carousel
- **Error Handling**: Graceful fallback to default quotes when API requests fail
- **Loading States**: Skeleton components for better UX during data fetching
- **Accessibility**: Keyboard navigation and focus trap support
- **Type Safety**: Full TypeScript implementation with Zod schema validation

## Technologies

- **Angular 20.1.0**: Modern Angular with standalone components
- **TypeScript 5.8.2**: Type-safe development
- **RxJS 7.8.0**: Reactive programming for async operations
- **Zod 4.1.13**: Runtime type validation
- **Angular Material 20.2.14**: UI components and icons
- **Angular CDK**: Accessibility and UI primitives
- **SASS**: Styling with variables and mixins

## Project Structure

```
quote-slider/
├── src/
│   ├── app/                          # Root application component
│   │   ├── app.ts                    # Main app component
│   │   ├── app.config.ts             # Application configuration
│   │   ├── app.html                  # App template
│   │   └── app.scss                  # App styles
│   │
│   ├── components/
│   │   ├── quotes/                   # Quotes feature component
│   │   │   ├── quotes.component.ts
│   │   │   ├── quotes.component.html
│   │   │   └── quotes.component.scss
│   │   │
│   │   └── shared/                   # Reusable components
│   │       ├── carousel/             # Generic carousel component
│   │       ├── rating/               # Star rating component
│   │       └── skeleton/             # Loading skeleton component
│   │
│   ├── services/
│   │   ├── quote/                    # Main quote service
│   │   │   └── quote.service.ts
│   │   │
│   │   ├── rating/                   # Rating management service
│   │   │   └── rating.service.ts
│   │   │
│   │   └── qoute-services/           # Quote provider services
│   │       ├── quotable-quote/       # Quotable.io API service
│   │       ├── dummyJson-quote/      # DummyJSON API service
│   │       └── quote-provides.config.ts
│   │
│   ├── interfaces/                   # TypeScript interfaces
│   │   ├── quote.interface.ts
│   │   └── quote-service.interface.ts
│   │
│   ├── consts/                       # Constants
│   │   └── default-quotes.ts
│   │
│   ├── utils/                        # Utility functions
│   │   ├── utils.ts
│   │   └── rxjs.utils.ts
│   │
│   └── styles/                       # Global styles
│       ├── variables.scss
│       └── mat.styles.scss
│
├── angular.json                      # Angular CLI configuration
├── package.json                      # Dependencies and scripts
└── tsconfig.json                     # TypeScript configuration
```

## Installation

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd quote-slider
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
# or
ng serve
```

4. Open your browser and navigate to `http://localhost:4200/`

## Development

### Available Scripts

- `npm start` or `ng serve`: Start the development server
- `npm run build` or `ng build`: Build the project for production
- `npm run watch`: Build and watch for changes
- `npm test` or `ng test`: Run unit tests

### Code Generation

Generate new components, services, or other Angular artifacts:

```bash
ng generate component component-name
ng generate service service-name
ng generate --help  # See all available schematics
```

## Architecture

### Component Architecture

The application follows Angular's standalone component pattern with a clear separation of concerns:

- **App Component**: Root component that renders the quotes feature
- **Quotes Component**: Main feature component that orchestrates quote display and rating
- **Carousel Component**: Reusable, generic carousel with template projection
- **Rating Component**: Star rating input component
- **Skeleton Component**: Loading state placeholder

### Service Architecture

#### Quote Service (`quote.service.ts`)

The main quote service manages quote state and coordinates multiple quote providers:

- **Multi-Provider Pattern**: Uses Angular's multi-provider injection to fetch from multiple sources concurrently
- **Signal-Based State**: Uses Angular signals for reactive state management
- **Automatic Loading**: Loads quotes on initialization
- **Deduplication**: Filters duplicate quotes based on content
- **Error Handling**: Falls back to default quotes when all API requests fail

#### Quote Provider Services

Each provider implements the `IQuoteService` interface:

- **QuotableQuoteService**: Fetches from `https://api.quotable.io/random`
- **DummyJsonQuoteService**: Fetches from `https://dummyjson.com/quotes/random/2`

Both services:
- Use Zod schemas for runtime validation
- Adapt external API responses to the internal `IQuote` interface
- Handle HTTP errors gracefully

#### Rating Service (`rating.service.ts`)

Manages quote ratings using signals:
- Stores ratings in a record keyed by quote ID
- Provides immutable updates
- Exposes readonly signal for components

### Data Flow

1. **Initialization**: `QuoteService` constructor triggers `loadQuotes$()`
2. **Concurrent Fetching**: Multiple quote providers fetch quotes simultaneously
3. **First Success Wins**: Uses RxJS `merge` and `take(1)` to use the first successful response
4. **State Update**: Quotes are added to the signal state with unique IDs
5. **Component Rendering**: `QuotesComponent` displays quotes via computed signals
6. **Lazy Loading**: When user reaches the last quote, new quotes are fetched
7. **Rating**: User ratings are stored in `RatingService` and displayed per quote

### Key Design Patterns

- **Dependency Injection**: Services injected using `inject()` function
- **Signal-Based Reactivity**: Modern Angular signals for state management
- **Template Projection**: Carousel uses `ng-template` for flexible content rendering
- **Strategy Pattern**: Multiple quote providers implementing a common interface
- **Observer Pattern**: RxJS observables for async operations
- **OnPush Change Detection**: Optimized change detection strategy

## Components

### Quotes Component

Main feature component that:
- Displays quotes in a carousel
- Handles quote loading and error states
- Manages rating updates
- Triggers lazy loading when reaching the end

**Key Features:**
- Uses `viewChild` to reference carousel for programmatic control
- Computed signal for quotes list (includes loading stub)
- Error handling with carousel reset

### Carousel Component

Generic, reusable carousel component with:

**Inputs:**
- `items`: Array of items to display
- `autoPlay`: Enable/disable auto-play (default: `true`)
- `intervalMs`: Auto-play interval in milliseconds (default: 5000)
- `loop`: Enable looping (default: `false`)

**Outputs:**
- `activeIndexChange`: Emits when the active index changes

**Features:**
- Keyboard navigation (arrow keys)
- Auto-play with pause/resume
- Template projection for custom item rendering
- Focus trap for accessibility
- Programmatic navigation via `goTo()` method

### Rating Component

Star rating component that:
- Displays interactive star ratings
- Emits rating changes
- Integrates with `RatingService`

### Skeleton Component

Loading placeholder component for better UX during data fetching.

## Interfaces

### IQuote

```typescript
interface IQuote {
  id: number;              // Internal unique ID
  originalId: number | string;  // Original ID from API
  quote: string;           // Quote text
  author: string;          // Author name
}
```

### IQuoteService

```typescript
interface IQuoteService {
  loadQuotes$(): Observable<IQuote[]>;
}
```

## Utilities

### RxJS Utils

- `verifyResponseType`: Validates HTTP responses against Zod schemas

### General Utils

- `filterUniqueBy`: Filters arrays to remove duplicates based on a property

## Styling

The project uses SASS with:
- Global variables in `styles/variables.scss`
- Material Design styles in `styles/mat.styles.scss`
- Component-scoped styles following Angular best practices

## Best Practices Implemented

✅ **Standalone Components**: All components are standalone for better tree-shaking  
✅ **Signal-Based State**: Modern reactive state management  
✅ **Type Safety**: Full TypeScript with no `any` types  
✅ **Runtime Validation**: Zod schemas for API response validation  
✅ **OnPush Change Detection**: Optimized performance  
✅ **Dependency Injection**: Using `inject()` function  
✅ **Error Handling**: Comprehensive error handling with fallbacks  
✅ **Accessibility**: Keyboard navigation and focus management  
✅ **Immutability**: Immutable state updates  
✅ **Pure Functions**: Utility functions are pure  
✅ **Single Responsibility**: Each service/component has a clear purpose  
✅ **Interface Segregation**: Clean interface definitions  

## Testing

Run unit tests with:

```bash
npm test
```

The project uses:
- **Jasmine**: Testing framework
- **Karma**: Test runner
- **Angular Testing Utilities**: Component and service testing

## Building for Production

Build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory. The production build optimizes the application for performance and speed.

## Browser Support

The application supports modern browsers that implement ES6+ features and support Angular 20.

## Contributing

1. Follow the Angular style guide
2. Maintain type safety (avoid `any`)
3. Use signals for state management
4. Write unit tests for new features
5. Follow the existing code structure and naming conventions

## License

This project is private and proprietary.

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Overview](https://angular.dev/tools/cli)
- [RxJS Documentation](https://rxjs.dev)
- [Zod Documentation](https://zod.dev)
