const libBaseLogger = require('fable-log').LogProviderBase;
const libBunyan = require('bunyan');

class BunyanLogger extends libBaseLogger
{
	constructor(pLogStreamSettings, pLogStreamHash)
	{
		super(pLogStreamSettings, pLogStreamHash);

		this.bunyanLogger = libBunyan.createLogger(this._Settings);
	}

	trace(pLogText, pLogObject)
	{
		this.bunyanLogger.trace(pLogText, pLogObject);
	}

	debug(pLogText, pLogObject)
	{
		this.bunyanLogger.debug(pLogText, pLogObject);
	}

	info(pLogText, pLogObject)
	{
		this.bunyanLogger.info(pLogText, pLogObject);
	}

	warn(pLogText, pLogObject)
	{
		this.bunyanLogger.warn(pLogText, pLogObject);
	}

	error(pLogText, pLogObject)
	{
		this.bunyanLogger.error(pLogText, pLogObject);
	}

	fatal(pLogText, pLogObject)
	{
		this.bunyanLogger.fatal(pLogText, pLogObject);
	}
}

module.exports = BunyanLogger;