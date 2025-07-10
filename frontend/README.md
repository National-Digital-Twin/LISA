# LISA Frontend

### Localhost Development

If you need to simulate alternative users you can run the following in the browser (devtools) console

```
localStorage.setItem('local-auth', JSON.stringify({ userId: 'test.user', userEmail: 'test.user@example.com', userName: 'Test User' }))
```

Note you can edit the values however needed, this will only work when the backend is running in development mode.
