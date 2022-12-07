# Contributing

1. [Clone it](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
2. Install dependencies (`npm install`)
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Added some feature'`)
5. Test your changes (`npm test`)
6. Push to the branch (`git push origin my-new-feature`)
7. [Create new Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)

## Testing

We use [Jest](https://github.com/facebook/jest) to write tests. Run our test suite with this command:

```
npm test
```

## Code Style

We use [Prettier](https://prettier.io/) and [Eslint](https://eslint.org/) to maintain code style and best practices.
Please make sure your MR adheres to the guides by running:

```
npm run format
```

and
```
npm run lint
```
