# Fable Log Logger Bunyan

A [Bunyan](https://github.com/trentm/node-bunyan) log provider for fable-log. Outputs structured JSON logs through the standard fable logging interface, supporting all six log levels and custom stream configurations.

[![npm version](https://badge.fury.io/js/fable-log-logger-bunyan.svg)](https://badge.fury.io/js/fable-log-logger-bunyan)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Features

- **Structured JSON Logging** - All log output is Bunyan-format JSON with timestamps, level numbers, hostnames, and PIDs
- **Fable Log Provider** - Extends the `fable-log` LogProviderBase, plugging directly into the fable logging pipeline
- **Six Log Levels** - `trace`, `debug`, `info`, `warn`, `error`, and `fatal` mapped to their Bunyan equivalents
- **Object Context** - Attach arbitrary data objects to any log call; they are merged into the JSON output
- **Custom Streams** - Pass Bunyan stream configurations (stdout, files, rotating files, ringbuffers) through the settings object
- **Datum Decorators** - Works with fable-log's `setDatumDecorator` to enrich log objects with application metadata

## Installation

```bash
npm install fable-log-logger-bunyan
```

## Quick Start

```javascript
const libFable = require('fable');
const libFableLoggerBunyan = require('fable-log-logger-bunyan');

let fable = new libFable(
{
	Product: 'my-app',
	Version: '1.0.0',
	LogStreams: []
});

// Create the bunyan logger — settings are passed directly to Bunyan
let bunyanLogger = new libFableLoggerBunyan(
{
	name: fable.settings.Product
});

// Add it to the fable logging pipeline
fable.Logging.addLogger(bunyanLogger, 'trace');

// Log away
fable.log.info('Application started.');
fable.log.info('User loaded:', { id: 42, name: 'Ada' });
fable.log.error('Something went wrong!');
```

## Usage

### Custom Streams

Bunyan stream configurations are passed directly through the settings object:

```javascript
const { PassThrough } = require('stream');
const logCapture = new PassThrough();

let bunyanLogger = new libFableLoggerBunyan(
{
	name: 'my-app',
	streams:
	[
		{ level: 'trace', stream: process.stdout },
		{ level: 'info', stream: logCapture },
		{ level: 'error', path: '/var/log/my-app-error.log' }
	]
});

fable.Logging.addLogger(bunyanLogger, 'trace');
```

### Datum Decorators

Use fable-log's datum decorator to enrich every log entry with application context:

```javascript
fable.log.setDatumDecorator((pSourceDatum) =>
{
	return {
		Source: fable.settings.Product,
		Meta: pSourceDatum
	};
});

fable.log.info('Hello!', { requestId: 'abc-123' });
// JSON output includes Source, Meta.requestId, msg, level, time, etc.
```

## API

### Constructor

```javascript
new BunyanLogger(pLogStreamSettings, pLogStreamHash)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `pLogStreamSettings` | `Object` | Settings passed directly to `bunyan.createLogger()` (must include `name`) |
| `pLogStreamHash` | `String` | Optional hash identifier for the log stream |

### Log Methods

All methods accept a log message string and an optional context object:

| Method | Bunyan Level | Description |
|--------|-------------|-------------|
| `trace(pLogText, pLogObject)` | 10 | Finest-grain debug output |
| `debug(pLogText, pLogObject)` | 20 | Debug-level messages |
| `info(pLogText, pLogObject)` | 30 | Informational messages |
| `warn(pLogText, pLogObject)` | 40 | Warning conditions |
| `error(pLogText, pLogObject)` | 50 | Error conditions |
| `fatal(pLogText, pLogObject)` | 60 | Fatal / unrecoverable errors |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `bunyanLogger` | `Object` | The underlying Bunyan logger instance |

## Part of the Retold Framework

Fable Log Logger Bunyan is a logging provider in the Fable ecosystem:

- [fable-log](https://github.com/stevenvelozo/fable-log) - Logging framework with pluggable providers
- [fable](https://github.com/stevenvelozo/fable) - Application services framework
- [fable-serviceproviderbase](https://github.com/stevenvelozo/fable-serviceproviderbase) - Service provider base class

## Testing

Run the test suite:

```bash
npm test
```

Run with coverage:

```bash
npm run coverage
```

## License

MIT - See [LICENSE](LICENSE) for details.

## Author

Steven Velozo - [steven@velozo.com](mailto:steven@velozo.com)
