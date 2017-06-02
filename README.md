# ferl
The unholy union of fetch and curl

```
  Usage: ferl <URL> [options]

  subset of curl with added json traversal

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -X --method [method]          http method to use
    -L --redirect                 follow redirects
    -H --headers [header]         set a header
    -d --data [data]              send form data (of type application/x-www-form-urlencoded if it doesn't look like json)
    -e --extract [property]       extract a property from the response using a property chain e.g. 'supplier.primaryContact.tel'
    -m --map [property]           map over an array, extracting property using a property chain e.g. 'name.email'
    Will output multiple values if -m is specified multiple times
    -f --filter [property=value]  filter an array, checking property using a property chain e.g. 'name.email'
    Will filter on multiple values if -f is specified multiple times
```