const libBaseLogger = require('fable-log').LogProviderBase;
const libBunyan = require('bunyan');

const libPackage = require('../package.json');

class BunyanLogger extends libBaseLogger
{
	constructor(pLogStreamSettings, pLogStreamHash)
	{
		super(pLogStreamSettings, pLogStreamHash);

		/** @type {Object} */
		this._Package = libPackage;

		this.bunyanLogger = libBunyan.createLogger(this._Settings);
	}

	trace(pLogText, pLogObject)
	{
		this.bunyanLogger.trace(pLogObject || { }, pLogText);
	}

	debug(pLogText, pLogObject)
	{
		this.bunyanLogger.debug(pLogObject || { }, pLogText);
	}

	info(pLogText, pLogObject)
	{
		this.bunyanLogger.info(pLogObject || { }, pLogText);
	}

	warn(pLogText, pLogObject)
	{
		this.bunyanLogger.warn(pLogObject || { }, pLogText);
	}

	error(pLogText, pLogObject)
	{
		this.bunyanLogger.error(pLogObject || { }, pLogText);
	}

	fatal(pLogText, pLogObject)
	{
		this.bunyanLogger.fatal(pLogObject || { }, pLogText);
	}
}

module.exports = BunyanLogger;
