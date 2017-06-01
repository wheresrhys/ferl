#!/usr/bin/env node
const program = require('commander');
const fetch = require('node-fetch');

function collect(val, memo) {
  memo.push(val);
  return memo;
}

function getUserHeaders (headers) {
  if (!headers.length) {
    return {};
  }
  try {
    return JSON.parse(headers[0])
  } catch (e) {
    return headers.reduce((obj, header) => {
      try {
        const [all, name, val] = /([\w-]+)\:(.*)/.exec(header.trim())
        obj[name] = val;
        return obj;
      } catch (e) {
        throw new Error(`Invalid header ${header}`)
      }
    }, {})
  }

}

function getHeaders (headers, contentType) {
  const userHeaders = getUserHeaders(headers)
  if (contentType && Object.keys(headers).map(name => name.toLowerCase()).indexOf('content-type') === -1) {
    headers['Content-Type'] = contentType;
  }
  return headers

}

function prepareData (data) {
  if (!data.length) {
    return {};
  }

  if (data.length === 1) {
    try {
      JSON.parse(data[0])
      return {body: data[0], contentType: 'application/json'};
    } catch (e) {}
  }
  if (data.some(d => d.indexOf('=') === -1)) {
    throw new Error('data does not all look like form data')
  }
  return {
    body: data.join('&'),
    contentType: 'application/x-www-form-urlencoded'
  }
}

function extractProperty(json, props) {
  propChain = props.split('.');
  while (propChain.length) {
    const prop = propChain.shift()
    try {
      json = json[prop]
    } catch (e) {
      throw new Error(`could not find property "${prop}" in property chain "${props}"`)
    }

  }
  return json;
}

program
  .version('0.2.1')
  .usage('ferl <URL> [options]')
  .arguments('<URL>')
  .description('subset of curl with added json parsing')
  .option('-X --method [method]', 'http method to use')
  .option('-L --redirect', 'follow redirects')
  .option('-H --headers [header]', 'set a header', collect, [])
  .option('-d --data [data]', 'send form data (of type application/x-www-form-urlencoded if it doesn\'t look like json)', collect, [])
  .option('-e --extract [property]', 'extract a property from the response using a property chain e.g. \'supplier.primaryContact.tel\' ')
  .option('-m --map [func]', `map over an array, extracting property using a property chain e.g. \'name.email\'
Will output multiple values if -m is specified multiple times`, collect, [])
  // .option('-u [user]', 'authenticate with basic auth')
  .action(function (url, options) {
    if (!url) {
      throw new Error('calls to ferl must begin with a url')
    }

    const {body, contentType} = prepareData(options.data)

    fetch(url, {
      headers: getHeaders(options.headers, contentType),
      redirect: options.redirect ? 'follow': 'manual',
      method: options.method || 'GET',
      body
    })
      .then(res => {
        if (!res.ok) {
          console.error(res.message)
        }
        return res.json()
      })
      .then(json => {
        if (options.extract) {
          json = extractProperty(json, options.extract)
        }
        if (options.map) {
          if (options.map.length === 1) {
            json = json.map(item => extractProperty(item, options.map[0]))
          } else {
            json = json.map(item =>
              options.map.map(propChain => extractProperty(item, propChain))
            )
          }
        }
        console.log(JSON.stringify(json, null, 2))
      })
  });

program.parse(process.argv)