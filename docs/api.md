# API Reference

## Class: BunyanLogger

Extends `LogProviderBase` from fable-log, which in turn extends `CoreServiceProviderBase` from fable-serviceproviderbase.

```javascript
const libFableLoggerBunyan = require('fable-log-logger-bunyan');
let tmpLogger = new libFableLoggerBunyan({ name: 'my-app' });
```

## Constructor

```javascript
new BunyanLogger(pLogStreamSettings, pLogStreamHash)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pLogStreamSettings` | object | Yes | Configuration passed directly to `bunyan.createLogger()` |
| `pLogStreamHash` | string | No | Service hash for the provider base |

The `pLogStreamSettings` object must include at minimum a `name` property (required by Bunyan). All other Bunyan options are supported:

| Bunyan Option | Type | Description |
|---------------|------|-------------|
| `name` | string | Logger name (required) |
| `level` | string or number | Minimum log level for the default stream |
| `streams` | array | Array of stream definitions with per-stream level filtering |
| `serializers` | object | Custom serializer functions for structured data |
| `src` | boolean | Include source file/line in output (slow -- dev only) |

## Instance Properties

### bunyanLogger

- **Type:** Bunyan logger instance
- **Description:** The underlying Bunyan logger created from the settings. You can access this directly if needed, but normally you log through Fable's logging interface.

## Log Level Methods

All six methods follow the same signature:

```javascript
logger.trace(pLogText, pLogObject)
logger.debug(pLogText, pLogObject)
logger.info(pLogText, pLogObject)
logger.warn(pLogText, pLogObject)
logger.error(pLogText, pLogObject)
logger.fatal(pLogText, pLogObject)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pLogText` | string | Yes | The log message |
| `pLogObject` | object | No | Additional data to include in the log entry |

Each method delegates to the corresponding Bunyan method. The arguments are mapped from fable-log's convention (text first, object second) to Bunyan's convention (object first, text second):

```javascript
// fable-log calls:
logger.info('message', { key: 'value' });

// Bunyan receives:
bunyanLogger.info({ key: 'value' }, 'message');
```

If `pLogObject` is not provided, an empty object is passed to Bunyan.

## Bunyan Log Levels

| Level | Number | Method | Typical Use |
|-------|--------|--------|-------------|
| trace | 10 | `trace()` | Granular debugging (request details, variable dumps) |
| debug | 20 | `debug()` | Development debugging |
| info | 30 | `info()` | Normal operation (startup, request handled) |
| warn | 40 | `warn()` | Potential issues (deprecated usage, retry) |
| error | 50 | `error()` | Errors that are handled |
| fatal | 60 | `fatal()` | Unrecoverable errors |

## JSON Output Format

Each log line is a JSON object. Bunyan adds several standard fields automatically:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Logger name from settings |
| `hostname` | string | Machine hostname |
| `pid` | number | Process ID |
| `level` | number | Numeric log level |
| `msg` | string | The log message (`pLogText`) |
| `time` | string | ISO 8601 timestamp |
| `v` | number | Bunyan log format version |

Properties from `pLogObject` (or from a datum decorator) appear as additional top-level fields in the JSON.

## Registration with Fable

Register the logger with fable-log's `addLogger` method:

```javascript
const _Fable = new libFable({
    Product: 'MyApp',
    LogStreams: []  // disable default console logger
});

let tmpLogger = new libFableLoggerBunyan({
    name: _Fable.settings.Product
});

// Second argument sets the minimum level this logger receives
_Fable.Logging.addLogger(tmpLogger, 'trace');
```

The level passed to `addLogger` controls which calls fable-log routes to this provider. Bunyan's own stream-level filtering is applied on top of that.

## Multiple Loggers

You can register multiple Bunyan loggers with different configurations:

```javascript
// Verbose JSON to stdout
_Fable.Logging.addLogger(new libFableLoggerBunyan({
    name: 'my-app-verbose',
    level: 'trace'
}), 'trace');

// Errors only to a file
_Fable.Logging.addLogger(new libFableLoggerBunyan({
    name: 'my-app-errors',
    streams: [{ level: 'error', path: '/var/log/errors.log' }]
}), 'error');
```

## Inherited Properties

From `LogProviderBase` (fable-log):

| Property | Description |
|----------|-------------|
| `loggerUUID` | Auto-generated UUID for this logger instance |
| `serviceType` | `'Logging-Provider'` |
| `_Settings` | The settings object passed to the constructor |

From `CoreServiceProviderBase` (fable-serviceproviderbase):

| Property | Description |
|----------|-------------|
| `UUID` | Service UUID |
| `Hash` | Service instance hash |
| `options` | Service options |
