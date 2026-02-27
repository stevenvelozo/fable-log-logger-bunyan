# Fable Bunyan Logger

> Structured JSON logging for the Fable ecosystem

A log provider that routes fable-log output through Bunyan, producing machine-parseable JSON log lines for production environments and log aggregation pipelines.

- **JSON Output** -- Every log line is a structured JSON object with timestamp, level, hostname, and pid
- **Multiple Streams** -- Route different log levels to different destinations (stdout, files, services)
- **Datum Decorator** -- Works with fable-log's decorator to enrich every log entry with custom fields
- **Drop-In Provider** -- Register with one call and all existing `_Fable.log` usage produces JSON

[Get Started](README.md)
[API Reference](api.md)
[GitHub](https://github.com/stevenvelozo/fable-log-logger-bunyan)
