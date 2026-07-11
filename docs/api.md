# REST API Documentation - LifeMax

This document lists the endpoint routes and specifications for the LifeMax Backend API.

## Authentication
- `POST /auth/register` - Create a new user account.
- `POST /auth/login` - Authenticate and get JWT token.
- `POST /auth/logout` - Clear user session/cookie.
- `GET /auth/me` - Get current authenticated user details.

## Categories
- `GET /categories` - List categories.
- `POST /categories` - Create a new category.
- `PATCH /categories/:id` - Update category details.
- `DELETE /categories/:id` - Delete a category.

## Activities
- `GET /activities` - List activities.
- `POST /activities` - Create an activity.
- `PATCH /activities/:id` - Update / archive activity.
- `DELETE /activities/:id` - Hard delete activity.

## Day Logs
- `GET /day-logs` - Retrieve daily log.
- `POST /day-logs` - Instantiate a daily log.
- `PATCH /day-logs/:id` - Update daily metrics (mood, energy, sleep).

## Time Blocks
- `GET /time-blocks` - List tracked blocks.
- `POST /time-blocks` - Log a new time duration.
- `PATCH /time-blocks/:id` - Edit block timing or notes.
- `DELETE /time-blocks/:id` - Remove a tracked block.

## Goals
- `GET /goals` - List objectives.
- `POST /goals` - Set a new goal.
- `PATCH /goals/:id` - Update goal progress or metadata.
- `DELETE /goals/:id` - Remove a goal.

## Habits & Habit Entries
- `GET /habits` - List habits.
- `POST /habits` - Create a new habit.
- `PATCH /habits/:id` - Update habit definition.
- `DELETE /habits/:id` - Delete a habit.
- `GET /habits/entries` - List habit logs.
- `POST /habits/:id/entries` - Log habit completion.
- `PATCH /habits/entries/:id` - Toggle completion status.

## Analytics
- `GET /analytics/day` - Daily productivity breakdown.
- `GET /analytics/week` - Weekly aggregation.
- `GET /analytics/month` - Monthly trend.
- `GET /analytics/year` - Yearly heatmap.
