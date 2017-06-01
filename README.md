# ferl
The unholy union of fetch and curl

```
  Usage: index [options] <URL>

  subset of curl with added json parsing

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -X --method [method]     http method to use
    -L --redirect            follow redirects
    -H --headers [header]    set a header
    -d --data [data]         send form data (of type application/x-www-form-urlencoded if it doesn't look like json)
    -e --extract [property]  extract a property from the response using a property chain e.g. 'supplier.primaryContact.tel'
    -m --map [func]          map over an array, extracting property using a property chain e.g. 'name.email'
```