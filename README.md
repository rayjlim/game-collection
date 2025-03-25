# game-collection

[![Backend](https://github.com/rayjlim/game-collection/actions/workflows/backend.yml/badge.svg)](https://github.com/rayjlim/game-collection/actions/workflows/backend.yml)
[![Frontend](https://github.com/rayjlim/game-collection/actions/workflows/node.js.yml/badge.svg)](https://github.com/rayjlim/game-collection/actions/workflows/node.js.yml)

to run the phpunit with npm watch, I had to  
to change the default timeout from 300 to a large number  
`export COMPOSER_PROCESS_TIMEOUT=50000`

how to migrate the sheets data to the db?

----

handle category: SWITCH EMULATED

## SQL

```sql
# find duplicates
SELECT  id, fg_id, title
FROM gc_games
GROUP BY fg_url
HAVING COUNT(id) > 1
```
