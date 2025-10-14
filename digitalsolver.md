# Atelier Enligne - 3D Product Customization Platform

## Overview

Atelier Enligne is a web-based print-on-demand (POD) platform that enables users to create personalized physical products with real-time 3D visualization. The platform features a professional workspace ("Atelier") for product customization, a marketplace for selling designs, and an integrated shop system where users can become resellers.

**Primary Use Case:** Users arrive from social media (Facebook, Instagram), customize products (t-shirts, mugs, accessories) using a 3D design tool, and can either order products or sell their designs in the marketplace.

**Design Philosophy:** Inspired by Canva (intuitive tools), Figma (panel-based workspace), and Printful (POD product visualization), with the 3D Atelier workspace as the central experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool:**
- React 18+ with TypeScript for type safety
- Vite as the build tool for fast development and optimized production builds
- React Router (wouter) for client-side navigation

**State Management:**
- TanStack Query (React Query) for server state management and caching
- Local component state for UI interactions
- Query invalidation patterns for data synchronization

**UI Component System:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui design system with "new-york" style variant
- Tailwind CSS for styling with custom HSL color variables
- Custom design tokens supporting both light and dark modes

**3D Rendering:**
- Babylon.js core engine for 3D scene rendering
- Babylon.js loaders for importing 3D models
- Babylon.js materials for advanced material rendering
- Canvas-based viewport for real-time product visualization

**Design Tools:**
- Element-based design system (text, images, shapes)
- Real-time manipulation of design elements
- Layer management and property panels
- Multi-surface texture mapping (front, back, etc.)

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- RESTful API architecture
- Session-based authentication

**API Structure:**
- `/api/auth/*` - Authentication endpoints (Replit Auth)
- `/api/products/*` - Product catalog management
- `/api/designs/*` - User design CRUD operations
- `/api/orders/*` - Order management
- `/api/marketplace/*` - Marketplace listings
- `/api/shop/*` - User shop management

**Data Models:**
- Users: Extended profile with shop capabilities
- Products: Base product catalog with 3D models and pricing
- Designs: User-created designs with element composition
- Orders: Purchase records with status tracking
- ShopItems: Marketplace listings linking designs to products
- Design interactions: Comments and likes

### Authentication & Authorization

**Authentication Provider:** Replit Auth (OpenID Connect)
- OAuth2/OIDC flow for secure authentication
- Session management using connect-pg-simple
- PostgreSQL-backed session storage
- User profile synchronization with Replit identity

**Session Management:**
- 7-day session TTL
- Secure, HTTP-only cookies
- Session persistence across server restarts

**Authorization Pattern:**
- `isAuthenticated` middleware for protected routes
- User context available via `req.user.claims.sub`
- Query-based authorization checks in storage layer

### Data Storage

**Database:**
- PostgreSQL via Neon serverless
- Drizzle ORM for type-safe database access
- Schema-first approach with TypeScript inference

**Schema Design:**
- Sessions table for authentication state
- Users table with extended POD platform fields (shop metadata)
- Products with categories and 3D model references
- Designs with JSONB element storage for flexible composition
- Orders with status workflow tracking
- Marketplace relationships via ShopItems

**Data Access Layer:**
- Storage interface abstraction (`IStorage`)
- Repository pattern for each entity
- Drizzle query builder for complex queries
- Transaction support where needed

### Key Design Patterns

**Frontend Patterns:**
- Compound component pattern for UI flexibility
- Custom hooks for reusable logic (useAuth, useIsMobile)
- Query client configuration with error handling strategies
- Optimistic updates for better UX

**Backend Patterns:**
- Middleware chain for request processing
- Route registration pattern for modular API
- Error handling middleware with status code mapping
- Storage abstraction for database operations

**Design System Patterns:**
- Color system using HSL with CSS custom properties
- Elevation system with hover/active states
- Typography scale with semantic font families
- Responsive breakpoints with mobile-first approach

## External Dependencies

### Third-Party Services

**Replit Platform:**
- Replit Auth for user authentication (OpenID Connect provider)
- Environment-based configuration (REPL_ID, REPLIT_DOMAINS)
- Development tooling integration (Cartographer, dev banner)

**Database:**
- Neon PostgreSQL serverless database
- WebSocket connection support for serverless environments
- Connection pooling via @neondatabase/serverless

### Key Libraries & APIs

**3D & Graphics:**
- @babylonjs/core, @babylonjs/loaders, @babylonjs/materials - 3D rendering engine
- Canvas API for 2D texture composition (planned: Fabric.js integration)

**UI Framework:**
- @radix-ui/* components - Accessible UI primitives (17+ component packages)
- class-variance-authority - Variant-based component styling
- tailwind-merge & clsx - CSS class composition
- cmdk - Command palette component

**Data & State:**
- @tanstack/react-query - Server state management
- drizzle-orm - Type-safe ORM
- drizzle-zod - Runtime schema validation
- zod - Schema validation

**Authentication:**
- openid-client - OAuth/OIDC client implementation
- passport - Authentication middleware
- express-session - Session management
- connect-pg-simple - PostgreSQL session store

**Development Tools:**
- Vite - Build tool and dev server
- TypeScript - Type system
- ESBuild - Production bundler
- @replit/vite-plugin-* - Replit-specific tooling

**Planned Integrations:**
- Fabric.js for 2D canvas manipulation (currently placeholder)
- Image upload service (react-dropzone referenced but not yet implemented)
- Social sharing capabilities (react-share, html2canvas for screenshots)
- Payment processing (not yet implemented)

### Asset Management

**Static Assets:**
- `/attached_assets` - Documentation and requirements
- Product 3D models (referenced but storage location TBD)
- User-uploaded images (storage strategy pending)

**Font Loading:**
- Google Fonts: Inter (UI), Poppins (headings), JetBrains Mono (technical)
- Preconnect optimization for font delivery