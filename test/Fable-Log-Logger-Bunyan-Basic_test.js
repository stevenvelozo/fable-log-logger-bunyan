/*
	Unit tests for FableLogLoggerBunyan v.1.0.0 Default
*/

const Chai = require('chai');
const Expect = Chai.expect;

const { PassThrough } = require('stream');

const libFable = require('fable');
const libFableLoggerBunyan = require(`../source/Fable-Log-Logger-Bunyan.js`);

/**
 * Helper to convert a stream of utf8 bytes to a string.
 */
async function streamToString(stream)
{
	return new Promise((resolve, reject) =>
	{
		const chunks = [];
		stream.on('data', (chunk) => chunks.push(chunk));
		stream.on('error', reject);
		stream.on('end', () =>
		{
			if (Buffer.isBuffer(chunks[0]))
			{
				resolve(Buffer.concat(chunks).toString('utf8'));
			}
			else
			{
				// assume it's just a broken string, and stitch together
				// TODO: can we be more explicit here for the various formats?
				resolve(chunks.join(''));
			}
		});
	});
}

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
									Version: '1.0.0',
									LogStreams: [], // no default logger
								});

								// TODO: Switch these to fable services
								let _FableLoggerBunyan = new libFableLoggerBunyan(
									// This is passed directly to Bunyan as well.
									{
										name: 'fable-log-bunyan-harness-instance'
									});

								_Fable.Logging.addLogger(_FableLoggerBunyan, 'trace');

								_Fable.log.info('Bunyan do your thing, yo...');
								_Fable.log.info('Some objects:', { foo: 'bar', baz: 'quux'});
								_Fable.log.fatal('This was a critical wound.');
								Expect(_FableLoggerBunyan).to.be.an('object');
								return fDone();
							}
						);
					test(
							'Bunyan stream config',
							async () =>
							{

								let _Fable = new libFable({
									Product: 'fable-log-bunyan-harness',
									Version: '1.0.0',
									LogStreams: [], // no default logger
								});

								const passThrough = new PassThrough();
								// TODO: Switch these to fable services
								let _FableLoggerBunyan = new libFableLoggerBunyan(
									// This is passed directly to Bunyan as well.
									{
										name: 'fable-log-bunyan-harness-instance',
										streams:
										[
											{
												level: 'trace',
												stream: process.stdout,
											},
											{
												level: 'info',
												stream: passThrough,
											},
										],
									});
								Expect(_FableLoggerBunyan).to.be.an('object');

								_Fable.Logging.addLogger(_FableLoggerBunyan, 'trace');

								_Fable.log.info('Bunyan do your thing, yo...');
								_Fable.log.trace('Bunyan should eat me.', { is: 'ignored' });
								_Fable.log.info('Some objects:', { foo: 'bar', baz: 'quux'});
								_Fable.log.fatal('This was a critical wound.');
								passThrough.end();

								const logs = await streamToString(passThrough);

								const logLines = logs.split('\n').filter((l) => !!l); // filter out blank lines (probably last newline)
								Expect(logLines.length).to.equal(3);

								Expect(logLines[0]).to.include('"Bunyan do your thing, yo..."');
								let jsonLine = JSON.parse(logLines[0]); // ensure it's valid JSON

								Expect(logLines[1]).to.include('"Some objects:"');
								jsonLine = JSON.parse(logLines[1]);
								Expect(jsonLine.foo).to.equal('bar');
								Expect(jsonLine.baz).to.equal('quux');

								Expect(logLines[2]).to.include('"This was a critical wound."');
								jsonLine = JSON.parse(logLines[2]); // ensure it's valid JSON
							}
						);
					test(
							'Bunyan with datum decorator',
							async () =>
							{

								let _Fable = new libFable({
									Product: 'fable-log-bunyan-harness',
									Version: '1.0.0',
									LogStreams: [], // no default logger
								});
								_Fable.log.setDatumDecorator((sourceDatum) =>
								{
									const datum = { };
									datum.Source = _Fable.settings.Product;
									datum.Meta = sourceDatum;
									return datum;
								});

								const passThrough = new PassThrough();
								// TODO: Switch these to fable services
								let _FableLoggerBunyan = new libFableLoggerBunyan(
									// This is passed directly to Bunyan as well.
									{
										name: 'fable-log-bunyan-harness-instance',
										streams:
										[
											{
												level: 'trace',
												stream: process.stdout,
											},
											{
												level: 'info',
												stream: passThrough,
											},
										],
									});
								Expect(_FableLoggerBunyan).to.be.an('object');

								_Fable.Logging.addLogger(_FableLoggerBunyan, 'trace');

								_Fable.log.info('Bunyan do your thing, yo...');
								_Fable.log.trace('Bunyan should eat me.', { is: 'ignored' });
								_Fable.log.info('Some objects:', { foo: 'bar', baz: 'quux'});
								_Fable.log.fatal('This was a critical wound.');
								passThrough.end();

								const logs = await streamToString(passThrough);

								const logLines = logs.split('\n').filter((l) => !!l); // filter out blank lines (probably last newline)
								Expect(logLines.length).to.equal(3);

								let jsonLine = JSON.parse(logLines[0]);
								Expect(jsonLine.msg).to.equal('Bunyan do your thing, yo...');
								Expect(jsonLine.Source).to.equal('fable-log-bunyan-harness');

								jsonLine = JSON.parse(logLines[1]);
								Expect(jsonLine.msg).to.equal('Some objects:');
								Expect(jsonLine.Source).to.equal('fable-log-bunyan-harness');
								Expect(jsonLine.Meta.foo).to.equal('bar');
								Expect(jsonLine.Meta.baz).to.equal('quux');

								jsonLine = JSON.parse(logLines[2]);
								Expect(jsonLine.msg).to.equal('This was a critical wound.');
								Expect(jsonLine.Source).to.equal('fable-log-bunyan-harness');
							}
						);
				}
			);
	}
);
