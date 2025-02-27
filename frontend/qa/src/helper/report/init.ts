import fs from 'fs-extra';

try {
  fs.ensureDir('test-results');
  fs.emptyDir('test-results');
} catch (error) {
  // eslint-disable-next-line no-console
  console.log(`Folder not created! ${error}`);
}
