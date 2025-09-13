# Olopa - Freelancer Marketplace Platform

## Overview

Olopa is a freelancer marketplace platform that bridges clients and developers through smart contract-based work agreements. The platform combines traditional web technologies with Solana blockchain integration for secure, transparent transactions. It features a full-stack architecture with a Node.js/Express backend, MongoDB data persistence, and a vanilla JavaScript frontend that integrates with Solana wallets for cryptocurrency payments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Express.js server providing RESTful API endpoints
- **Database**: MongoDB with Mongoose ODM for data modeling and persistence
- **Data Models**: User and Contract entities with relationship management
- **API Structure**: Modular route handlers for authentication and contract management
- **Environment Configuration**: Environment variables for database connection and port configuration

### Frontend Architecture
- **Type**: Single Page Application (SPA) with vanilla JavaScript
- **Navigation**: Client-side routing system using data attributes and DOM manipulation
- **Styling**: Tailwind CSS for responsive design with custom glassmorphism effects
- **State Management**: localStorage for persisting wallet and user data
- **UI Components**: Section-based layout with dynamic content switching

### Blockchain Integration
- **Platform**: Solana blockchain integration using devnet for development
- **Wallet Support**: Phantom wallet provider detection and connection
- **Payment System**: SOL-based transactions for contract payments and fee collection
- **Demo Features**: Local wallet simulation with balance tracking and activity logging

### Data Storage Strategy
- **Primary Database**: MongoDB for persistent user accounts, contracts, and transaction records
- **Local Storage**: Browser localStorage for temporary wallet state and user preferences
- **Session Management**: Client-side state management without server-side sessions

### Authentication & Authorization
- **User Registration**: Simple email-based registration with role selection (freelancer/employer)
- **Role-Based Access**: Differentiated functionality based on user roles
- **Wallet Authentication**: Solana wallet connection for blockchain operations
- **No Authentication Middleware**: Currently implements basic user creation without token-based auth

## External Dependencies

### Core Backend Dependencies
- **express**: Web framework for API server and static file serving
- **mongoose**: MongoDB object modeling and database connection management
- **mongodb**: Native MongoDB driver for database operations

### Frontend Dependencies
- **Solana Web3.js**: Blockchain interaction library loaded via CDN
- **Tailwind CSS**: Utility-first CSS framework loaded via CDN

### Development Environment
- **MongoDB**: Database service requiring MONGO_URI environment variable
- **Solana Devnet**: Development blockchain network for testing transactions
- **Phantom Wallet**: Browser extension for Solana wallet functionality

### Third-Party Services
- **Solana RPC**: clusterApiUrl connection to Solana devnet for blockchain operations
- **CDN Services**: External hosting for Solana Web3.js and Tailwind CSS libraries

### Environment Variables
- **MONGO_URI**: MongoDB connection string for database access
- **PORT**: Server port configuration (defaults to 5000)