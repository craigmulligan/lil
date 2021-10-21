# A simple approach to testing next.js apps

<strong>DEVON:</strong> Hello, I'm Devon and you're listening to the ninth episode of Pioneers. A series of conversations with the designers, engineers, writers and inventors who are shaping computing as we know it. Today, I'm talking with Howard Rheingold.

<mark>Howard first plugged into the internet</mark> in 1983 before the world wide web even existed. He was one of the first non-programmers to see computers as mind amplifiers rather than just computing or word processing machines and he coined the word virtual community through his experience as a member of [the WELL](#), one of the first online communities and he's talked in depth about collective action and coordination online.

<strong>The other day</strong> I was writing some tests for a next.js app, I couldn't find any straight forward recommendations on how to test both Pages and APIs with next.js so I thought I'd throw up some samples of my method.

<i>I usually lean as far towards integrations tests as is comfortable to write. Meaning I rarely stub things out but I still want the suite to be straight forward to write and quick to run so there is a balance to strike.</i>

> "We are the animal that made its progress through culture. Our progress has not been through genetics, but being able to do something faster than genetics can do."

1. Page Methods - eg. `getServerSideProps`, `getInitialProps`.
2. Page Components - eg. Given `x` props does the component render correctly.
3. Api endpoints - these are your typical rest api tests. eg `get /api/user/<userId>` and asserting it returns the expected values.

Below I'll run through each type of test case and provide some examples.

### 1 + 2 Page Methods & Page Components

I'll lump these two together because often the output of one is used as the input for the other so they are convenient to write together.

Lets image we have the following Dashboard page, It fetches all the users in the db prints them to screen.

```javascript
// pages/dashboard.js
import client from "nawr/client";

const Dash = ({ users }) => (
  <div>
    <h3>User list</h3>
    <p>Here is a list of all users stored in the db</p>
    <ul>
      {users.map(({ email, id }) => {
        return <li key={id}>{email}</li>;
      })}
    </ul>
  </div>
);

export const getServerSideProps = async ({ req, res }) => {
  const { records } = await client.query("select * from users;");

  return {
    props: {
      users: records
    }
  };
};

export default Dash;
```

I'd write a test case like this:

```javascript
// __tests__/pages/dashboard.test.js

import renderer from "react-test-renderer";
import Dash, { getServerSideProps } from "../../pages/dashboard";
import { createRequest, createResponse } from "node-mocks-http";
import { createUser } from "../../lib/db";

it("Renders correctly", async () => {
  const users = [
    {
      email: "x@x.com",
      id: 1
    },
    {
      email: "y@y.com",
      id: 2
    }
  ];

  return Promise.all(users.map(createUser));

  const req = createRequest({
    method: "GET"
  });
  const res = createResponse();

  const { props } = await getServerSideProps({
    req,
    res
  });

  // assert getServerSideProps returns the correct props
  expect(props.users).toBe(users);

  // asserts props + component result in the same snapshot
  const tree = renderer.create(<Dash {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

A few things to notice, I'm not spinning up an http server instead I'm just mocking the Http request and response, I found the tests to be much cleaner and I still feel like I'm testing the important things. I'm just snapshotting the page component, if snapshot testing doesn't suite your use case I'd try out `@testing-library/react`.

### 3. API calls

I found a [post](https://dev.to/metamas/testing-next-js-api-routes-55g3) which recommends using next's internal API resolver launch a server run requests. This method works fine but I'd prefer not to use internal APIs if possible. The approach I've gone with is similar to our Page methods.

For instance, if you have an api like this.

```javascript
// /pages/api/logout.js
import withSession from "../../../lib/session";

export function handler(req, res) {
  req.session.destroy();
  res.send("Logged out");
}

export default withSession(handler);
```

Notice I've exported the handler seperately, this is so I can easily mock the `withSession` higher order function in my tests. Generally when testing APIs I'd use `supertest` but after using the http stub method for pages I thought I'd use the same method for api calls, the test cases look something like:

```javascript
// __tests__/pages/api/logout.test.js
import { createUser } from "../../../lib/db";
import { apply, options as sessionOptions, login } from "../../../lib/session";
import { handler } from "../../../pages/api/auth/logout";
import { createRequest, createResponse } from "node-mocks-http";
import cookie from "cookie";

it("Returns 402 if auth fails", async () => {
  const newUser = {
    email: "x@x.com",
    password: "123"
  };

  await createUser(newUser);

  const req = createRequest({
    method: "POST"
  });

  const res = createResponse();

  // Adds session to the request
  await apply(req, res);

  // log user in
  await login(req, newUser);

  // call api
  await handler(req, res);

  const cookies = cookie.parse(res.getHeader("set-cookie")[0]);
  expect(cookies[sessionOptions.cookieName]).toBeFalsy();

  expect(res.statusCode).toBe(200);
});
```

You may be wondering where I do my setup/cleanup around each test run. I generally add a global Jest `beforeEach` and `afterEach`. They'd look something like:

```javascript
// setupTests.js
import { up, down } from "nawr/migrate";

beforeEach(async () => {
  return up();
});

afterEach(() => {
  return down({ to: 0 });
});
```

This above was mostly pseudo-code but it should be fairly easy to apply these methods to your app. If are after full working examples the code can be found [here](https://github.com/hobochild/boiler)
