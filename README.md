# Fable Bunyan Logger

A bunyan log provider for fable-log.

## Example:

```js
// Gather dependencies.
const libFable = require('fable');
const libFableLoggerBunyan = require('../source/Fable-Log-Logger-Bunyan.js');

// Initialize fable.
const _Fable = new libFable({
	Product: 'fable-log-bunyan-harness',
	Version: '1.0.0'
});

// Add the bunyan logger...
_Fable.Logging.addLogger(new libFableLoggerBunyan(
	// This is passed directly to Bunyan
	{
		name: _Fable.settings.Product,
		version: _Fable.settings.Version
	}));

// Try it out!
_Fable.log.info('Bunyan do your thing, yo...');
_Fable.log.info('Some objects:', { foo: 'bar', baz: 'quux'});
_Fable.log.fatal('This was fatal wound.');
```