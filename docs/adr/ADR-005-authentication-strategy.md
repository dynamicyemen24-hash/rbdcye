# ADR-005: Authentication Strategy

## Status
Accepted

## Date
2026-08-23

## Context
The ecosystem has three different authentication systems:
- NexoraOS: JWT with bcrypt
- NexWebSite: Supabase Auth + custom session
- NexOSMobile: OAuth + custom session

This creates confusion and security risks. A unified auth strategy is needed.

## Decision
Implement **JWT-Based Authentication** with refresh token rotation across all three applications.

## Architecture

### Token Structure
```typescript
// Access Token (8h expiry)
{
  id: string;        // User ID
  email: string;
  role: string;
  org_id: string;    // Organization ID
  security_level: number;
  iat: number;
  exp: number;
}

// Refresh Token (7d expiry)
{
  userId: string;
  type: 'refresh';
  iat: number;
  exp: number;
}
```

### Token Flow
```
1. User login → Server validates credentials
2. Server returns: accessToken + refreshToken
3. Client stores: accessToken in memory, refreshToken in secure storage
4. Client sends: Authorization: Bearer <accessToken>
5. When accessToken expires → Use refreshToken to get new pair
6. Refresh token rotation → Old refresh token is invalidated
```

### Device Management
```typescript
// Device registration on first login
{
  id: string;           // Device ID (generated once)
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  fingerprint: string;  // Browser/device fingerprint
  lastSeen: Date;
  status: 'active' | 'revoked';
}
```

## Rationale
1. **Stateless**: JWT doesn't require server-side session storage
2. **Scalable**: Works across multiple server instances
3. **Secure**: Refresh token rotation prevents token theft
4. **Cross-Platform**: Same token format for web, mobile, desktop
5. **Multi-Tenant**: Organization ID embedded in token

## Security Measures
- Access token expiry: 8 hours
- Refresh token expiry: 7 days
- Refresh token rotation on use
- Device fingerprinting
- Session revocation on password change
- Rate limiting on auth endpoints
- Brute-force protection (5 attempts, 15-min lockout)

## Consequences
- All three applications must use the same JWT format
- NexWebSite must migrate from Supabase Auth to JWT
- NexOSMobile must use JWT instead of custom session
- Token refresh logic must be implemented in all clients

## Alternatives Considered
- **Session-Based**: Requires server-side storage, doesn't scale
- **OAuth Only**: Adds dependency on external providers
- **Supabase Auth**: Vendor lock-in, inconsistent across apps

## Related
- ADR-001: Central PostgreSQL
- ADR-006: Multi-Tenant Isolation
- ADR-007: Financial Consistency
