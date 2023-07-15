/*
	Unit tests for FableLogLoggerBunyan v.1.0.0 Default
*/

const Chai = require('chai');
const Expect = Chai.expect;


const libFable = require('fable');
const libFableLoggerBunyan = require(`../source/Fable-Log-Logger-Bunyan.js`);

suite
(
	'FableLogLoggerBunyan Default Suite',
	() =>
	{
		setup(() => { });

		suite
			(
				'Basic .v. Default Tests',
				() =>
				{
					test(
							'Object Instantiation',
							(fDone) =>
							{

								let _Fable = new libFable({
									Product: 'fable-log-bunyan-harness',
									Version: '1.0.0'
								});

								// TODO: Switch these to fable services
								let _FableLoggerBunyan = new libFableLoggerBunyan(
									// This is passed directly to Bunyan as well.
									{
										name: 'fable-log-bunyan-harness-instance'
									});

								_Fable.Logging.addLogger(_FableLoggerBunyan);

								_Fable.log.info('Bunyan do your thing, yo...');
								_Fable.log.info('Some objects:', { foo: 'bar', baz: 'quux'});
								_Fable.log.fatal('This was a critical wound.');
								Expect(_FableLoggerBunyan).to.be.an('object');
								return fDone();
							}
						);
				}
			);
	}
);