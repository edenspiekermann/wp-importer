# JSON API to Static importer

This Node.js script helps importing data from a JSON API and generating files to use in a static website setup.

```js
const importer = require('static-importer')({
  // Options…
});

// Import all content types
importer()
  .then(() => console.log('All data successfully imported.'))
  .catch((err) => console.log('Something went wrong: ', err));

// Import a specific content type
importer('posts')
  .then(() => console.log('All posts successfully imported.'))
  .catch((err) => console.log('Something went wrong: ', err));
```

## Options

* **Name**: `contentTypes`
* **Required**: yes
* **Type**: array of objects
* **Defaults**: —
* **Description**: Content types that should be imported and their configuration.

```js
importer({
  contentTypes: [
    { … },
    { … }
  ]
});
```

* **Name**: `<contentType>.name`
* **Required**: yes
* **Type**: string
* **Defaults**: —
* **Description**: Unique name for the content type.

```js
{
  name: 'posts'
}
```

* **Name**: `<contentType>.endpoint`
* **Required**: yes
* **Type**: URL
* **Defaults**: —
* **Description**: API endpoint for the content type.

```js
{
  endpoint: 'https://api.example.com/1.1/posts'
}
```

* **Name**: `<contentType>.dest`
* **Required**: no
* **Type**: string
* **Defaults**: `./.import`
* **Description**: Where to output files for the content type.

```js
{
  dest: '_posts'
}
```

* **Name**: `<contentType>.filename`
* **Required**: no
* **Type**: string or function
* **Defaults**: `{slug}.md`
* **Description**: Pattern to name files for the content type. If specified as a string, tokens wrapped in brackets will be replaced with their respective value from the API response. If specified as a function, it receives the API response as only parameter.

```js
// Replaces the `{slug}` token with the value from the `slug` key from the API response
{
  filename: '{slug}.md'
}

// Dynamically create the filename based on the date and the slug returned by the API response, with the help of Moment.js
{
  filename: ({ date, slug }) =>
    `${moment(date).format('YYYY-MM-DD')}-${slug}.md`
}
```

* **Name**: `<contentType>.responsePath`
* **Required**: no
* **Type**: string
* **Defaults**: `null` 
* **Description**: Where to look for the relevant data in the API response; useful when the API returns more than just the data. Any falsey value will use the response as a whole.

```js
// Uses the whole API response directly
{
  responsePath: null
}

// Consider an API returning something like:
// { count: n, meta: { … }, data: { posts: [ … ] } }
// To access the collection of posts, we could use:
{
  responsePath: 'data.posts'
}
```

* **Name**: `<contentType>.yfm`
* **Required**: no
* **Type**: object
* **Defaults**: —
* **Description**: Specification for the YAML Front Matter of generated files from the content type. Each key will end up in the YAML Front Matter, knowing that if its value is:
  - `true` or falsey (e.g. `undefined`), the resulting value will be looked up in the API response based on the key name;
  - a string (e.g. `foo`), the resulting value will be set to this same string.
  - a function (exposing the API response), the resulting value will be the returned value from the function.

```js
{
  yfm: {
    // Looks for the `title` key in the API response and applies its value
    title: true,
    // Statically applies `post` as a value for `layout` variable
    layout: 'post',
    // Looks up for `author.nice_name` in the API response and applies its value
    author: (data) => data.author.nice_name;
  }
}
```

* **Name**: `<contentType>.contentPath`
* **Required**: no
* **Type**: string or function
* **Defaults**: `content`
* **Description**: Where to look for the page content in the API response. If specified as a function, it receives the API response as only parameter.

```js
// The content of each item from the collection is stored in the `content` key from the API response
{
  contentPath: 'content'
}

// The content of each item from the collection is stored in a `textContent` key and needs to post-processed
{
  contentPath: (data) => data.textContent.replace('<p></p>', '')
}
```

## Example

* [WordPress to Jekyll](https://github.com/edenspiekermann/wp-importer/blob/master/example/wordpress-to-jekyll.js)
