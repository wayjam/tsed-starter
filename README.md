## Tsed Starter

A Starter Project of tsed with typescript.

- <http://tsed.io/>
- <https://typeorm.io/>

### Development

```bash
npm run dev
```

Check `package.json` for more commands.

#### compile

- compile: `npm run build`
- build image: docker build -t tsed-starter .

#### api doc

If debugging, swagger will serve at `/api-docs`

### Deployment

autoload environment variable from `.env`

Var | Summary | Example
--- | --- | ---
`PORT` | Port | `8080`
`NODE_ENV` | specify run mode | `production`
`IGNORE_DBCONN` | ignoring database connection and start(for debug) | `true` / `false`
`DISABLE_REQUEST_LOG` | dont show request log | `true` / `false`
`MYSQL_HOST` | MySQL host | |
`MYSQL_PORT` | MySQL port | |
`MYSQL_USER` | MySQL username | |
`MYSQL_PASSWORD` | MySQL password | |
`MONGO_DB` | MySQL database name, split with comma | `todo_service`、`a_db,b_db`' |
`MONGO_HOST` | Mongo host | |
`MMONGO_PORT` | Mongo port | |
`MONGO_USER` | Mongo username | |
`MONGO_PASSWORD` | Mongo password | |
`MONGO_DB` | Mongo database name | |

```bash
NODE_ENV=production node server.js
```
