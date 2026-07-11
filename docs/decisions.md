# Architectural Decisions Document (ADD) - LifeMax

This document tracks major design and technical decisions made throughout the lifecycle of LifeMax.

## ADD-001: Separating Express Configuration from Server Bootstrap

### Context
Typically, Express projects start by initializing the express app and immediately calling `app.listen()` inside the entrypoint file. However, this tightly couples the server networking to the app initialization logic, creating testing difficulties.

### Decision
We separated the codebase into:
1. `app.ts` - Express configurations, routing hooks, global middlewares.
2. `server.ts` - Simple server listener wrapper.

### Consequences
- **Testing**: Allows us to write integration tests (e.g., using Supertest) against the `app` instance without spinning up actual TCP server sockets.
- **Maintainability**: Clear separation between network infrastructure logic (ports, protocol configs) and HTTP application layer logic (routes, middleware setup).

---

## ADD-002: Structured Logging with Pino

### Context
Using standard `console.log` makes it difficult to parse logs programmatically (e.g., inside logging aggregators like Datadog, ELK, or AWS CloudWatch) and lacks standardized metadata like timestamps, process IDs, or request context.

### Decision
We integrated `pino` and `pino-http` for all server logging.

### Consequences
- **Format**: All logs are printed as structured JSON lines.
- **Traceability**: `pino-http` automatically tags every incoming HTTP request with a unique ID and logs duration, method, and status codes.
- **Speed**: Pino is significantly faster than Winston or basic console logging due to asynchronous stringification.
