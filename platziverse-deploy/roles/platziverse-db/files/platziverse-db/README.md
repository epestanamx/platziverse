# platziverse-db

## Usage
```js
const setupDatase = require('platziverse-db')

setupDatabase(config).then(db => {
  const { Agent, Metric } = db
}).catch(err => console.log(err))
```
## Todo's
- [ ] Metric tests
