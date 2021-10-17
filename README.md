# Little Link (litl.ink)

Little Link is a 6-hour project inspired by bit.ly, tinyurl.com, and similar sites. It takes a long URL and returns
a compact version that, when accessed, will redirect the user to the desired long URL originally input.

The production website is available at [https://www.litl.ink](https://www.litl.ink).

## Running Locally

* Clone the repo and install dependencies with `yarn install`.
* Install Redis and start a local redis server with `redis-server`.
* Create a .env file in the root directory and add two values:

```
REDIS_URL=[your redis url]
ENVIRONMENT="DEVELOPMENT"
```
The default Redis URL is "redis://:6379"

* Start the server with `yarn start`.
* Navigate to `http://localhost:8080` and enjoy the app.

If you would like to run tests, run `yarn test`.

## Technologies used
- Node, Express
- Redis
- HTML, CSS, Javascript, JQuery
- Jest, eslint
- Heroku

## Discussion
### Choice of database

As our primary concern for this site is availability and speed, and as our querying needs are extremely simple
(literally get the value at a given key), our use case is perfect for a key-value store database. Every time
a URL is provided we create a hash and store mirrored pairs in the DB. `{Hash: URL}`, and `{URL: Hash}`.

### Hash collisions

The 32-bit hashes generated from the passed-in URLs are created from a combination of the URL and the timestamp at
which they were added. In the event of a collision, the app waits 2 milliseconds and creates a new hash, and
continues doing so until such time as an empty slot is found. Hashes expire after 7 days of non-use.

The 32-bit hash is a compromise between likelihood of collision and length. If I were to acquire ~30,000 hash values
in my database, the odds of collision would be approximately 1/10. If I ever get in that range, I will be very happy
at the success of my site, but I do not expect that to happen.

If a user attempts to add a URL that is already in the database, the DB simply returns the present hash and extends
its lifespan for another 7 days.

### Front End Design

As speed is of utmost importance and the front-end demands are extremely minimal, I opted to build a static HTML
page for the front end and serve it from the Node server rather than building an independently deployable
front end as I have with other projects. This makes the back-end resources more readily available to the front-end
and trivializes CORS setup.

### Scalability

As I have deployed the app to Heroku I do not expect to be personally responsible for scaling. However, if I were,
I have designed the app such that it would be extremely simply. It would be a matter of read replications of the
database and replications of the service layer behind a load balancer.

### Conclusion

Thank you for checking out the repository. If you have questions, feel free to reach out at howard.reith@gmail.com.