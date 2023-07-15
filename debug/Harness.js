const libFable = require('fable');

const libFableLoggerBunyan = require('../source/Fable-Log-Logger-Bunyan.js');

const _Fable = new libFable({
	Product: 'fable-log-bunyan-harness',
	Version: '1.0.0'
});

// TODO: Switch these to fable services
const _FableLoggerBunyan = new libFableLoggerBunyan(
	// This is passed directly to Bunyan as well.
	{
		name: 'fable-log-bunyan-harness-instance'
	});

_Fable.Logging.addLogger(_FableLoggerBunyan);

_Fable.log.info('Bunyan do your thing, yo...');
_Fable.log.info('Some objects:', { foo: 'bar', baz: 'quux'});
_Fable.log.fatal('This was a critical wound.');