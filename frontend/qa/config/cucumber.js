module.exports = {
  default: {
    tags: process.env.npm_config_TAGS ? `${process.env.npm_config_TAGS} and not @ignore` : 'not @ignore',
    formatOptions: {
      snippetInterface: 'async-await'
    },
    paths: [
      'src/test/features',
      'src/test/performance',
    ],
    publishQuiet: true,
    dryRun: false,
    require: ['src/test/steps/*.ts', 'src/hooks/hooks.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
      'json:test-results/cucumber-report.json',
      'rerun:@rerun.txt'
    ],
    parallel: 1
  },
  rerun: {
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    dryRun: false,
    require: ['src/test/steps/*.ts', 'src/hooks/hooks.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
      'json:test-results/cucumber-report.json',
      'rerun:@rerun.txt'
    ],
    parallel: 2
  }
};
