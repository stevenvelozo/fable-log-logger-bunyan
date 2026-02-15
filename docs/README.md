# Fable Bunyan Logger

A structured JSON log provider for fable-log. Routes all Fable logging through Bunyan, producing machine-parseable JSON output suitable for production log pipelines.

## Why Bunyan

Fable's default logger writes human-readable text to the console. For production environments you often need structured JSON logs that can be ingested by log aggregators (ELK, Datadog, Splunk, etc.). Bunyan provides that -- every log line is a JSON object with a consistent schema including timestamp, level, hostname, and pid.

This module bridges the two: it extends fable-log's `LogProviderBase` and delegates every log call to a Bunyan logger instance.

## Quick Start

```bash
npm install fable fable-log-logger-bunyan
```

```javascript
const libFable = require('fable');
const libFableLoggerBunyan = require('fable-log-logger-bunyan');

const _Fable = new libFable({
    Product: 'MyApp',
    ProductVersion: '1.0.0',
    LogStreams: []  // disable the default console logger
});

// Create and register the Bunyan logger
_Fable.Logging.addLogger(new libFableLoggerBunyan({
    name: _Fable.settings.Product,
    version: _Fable.settings.ProductVersion
}), 'trace');

// Use Fable's standard logging -- output is now JSON
_Fable.log.info('Server started');
_Fable.log.info('Request received:', { method: 'GET', path: '/api/users' });
_Fable.log.error('Something broke:', { code: 500 });
```

Each call produces a JSON line like:

```json
{"name":"MyApp","hostname":"your-host","pid":12345,"level":30,"msg":"Server started","time":"2026-01-15T12:00:00.000Z","v":0}
```

## Bunyan Configuration

The settings object you pass to the constructor is forwarded directly to `bunyan.createLogger()`. Any Bunyan option works:

```javascript
let tmpLogger = new libFableLoggerBunyan({
    name: 'my-app',
    level: 'info',
    streams: [
        { level: 'info', stream: process.stdout },
        { level: 'error', path: '/var/log/my-app-errors.log' }
    ],
    serializers: bunyan.stdSerializers
});
```

See the Bunyan documentation for the full list of options.

## Multiple Streams

Bunyan supports multiple output streams, each with its own level filter. This lets you send verbose logs to one destination and errors to another:

```javascript
const { PassThrough } = require('stream');

let tmpLogger = new libFableLoggerBunyan({
    name: 'my-app',
    streams: [
        { level: 'trace', stream: process.stdout },
        { level: 'error', path: '/var/log/errors.log' }
    ]
});

_Fable.Logging.addLogger(tmpLogger, 'trace');

_Fable.log.trace('Verbose debug info');  // stdout only
_Fable.log.error('Something failed');    // stdout AND errors.log
```

## Datum Decorator

Fable-log supports a datum decorator that transforms the data object before it reaches any logger. This works with Bunyan too -- the decorated data appears as top-level JSON fields:

```javascript
_Fable.log.setDatumDecorator((pSourceDatum) =>
{
    return {
        Source: _Fable.settings.Product,
        Meta: pSourceDatum
    };
});

_Fable.log.info('Request handled:', { userId: 42 });
// JSON output includes: "Source":"MyApp", "Meta":{"userId":42}
```

## Learn More

- [API Reference](api.md) -- Class details, method signatures, and Bunyan field mapping
- [Fable-Log](/fable/fable-log/) -- The parent logging framework
- [Fable](/fable/fable/) -- The core ecosystem
