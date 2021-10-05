# cURL commands to test the server

## fetch 200
```
curl -X POST -H "Content-Type: application/json" \
  -d '{ "file": "/Users/adrian/Library/Mobile Documents/27N4MQEA55~pro~writer/Documents/notes/kanban.md" }' \
  http://localhost:3000/board
```

## fetch 404
```
curl -X POST -H "Content-Type: application/json" \
  -d '{ "file": "/Users/adrian/Library/404.md" }' \
  http://localhost:3000/board
```

## update 200
```
curl -X PUT -H "Content-Type: application/json" \
  -d '{ "file": "/Users/adrian/Library/Mobile Documents/27N4MQEA55~pro~writer/Documents/notes/kanban.md", "data": "XXX" }' \
  http://localhost:3000/board
```

## update 404 ... CAREFUL!
```
curl -X PUT -H "Content-Type: application/json" \
  -d '{ "file": "/Users/adrian/Library/404.md", "data": "XXX" }' \
  http://localhost:3000/board
```