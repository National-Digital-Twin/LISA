# RUN_MULTIPLE_USERS.md

This document outlines how to run the LISA application to test multiple user functionality.

## The setup

In order to run multiple users for LISA we are going to be running two instances of the frontend that are going to connect to the same instance of the backend.

## Prereqisites

- Create a copy of the LISA repository

## Changes to the backend

- In the `src/services/auth.ts` add the following lines of code to the `getUserDetails` method:

```typescript
if (req.header('X-FE2')) {
   return new User('local.user.2', 'local.user.2@example.com', 'Local User 2');
}
```

- In the `src/auth/cognito.ts` add the following lines of code to the `getUsers` method:

```typescript
return resp.Users?.map(cognitoUserToUserListItem).concat([
   { username: 'local.user', displayName: 'Local User' },
   { username: 'local.user.2', displayName: 'Local User 2' }
]);
```

## Changes to the second instance of the frontend

- In the `src/api/index.ts` add the following line of code to the `getHeaders` method:

```typescript
headers['X-FE2'] = "FE2";
```
