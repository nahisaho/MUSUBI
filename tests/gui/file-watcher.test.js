/**
 * @fileoverview Tests for File Watcher Service
 */

const FileWatcher = require('../../src/gui/services/file-watcher');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

describe('FileWatcher', () => {
  let tempDir;
  let watcher;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `musubi-test-${Date.now()}`);
    await fs.ensureDir(path.join(tempDir, 'steering'));
    await fs.ensureDir(path.join(tempDir, 'storage'));
  });

  afterEach(async () => {
    if (watcher) {
      await watcher.close();
      watcher = null;
    }
    await fs.remove(tempDir);
  });

  describe('constructor()', () => {
    it('should create a watcher instance', () => {
      watcher = new FileWatcher(tempDir);

      expect(watcher).toBeInstanceOf(FileWatcher);
      expect(watcher.projectPath).toBe(tempDir);
    });

    it('should accept custom options', () => {
      watcher = new FileWatcher(tempDir, {
        persistent: false,
      });

      expect(watcher.options.persistent).toBe(false);
    });
  });

  describe('isActive', () => {
    it('should return true when watching', () => {
      watcher = new FileWatcher(tempDir);

      expect(watcher.isActive).toBe(true);
    });

    it('should return false after close', async () => {
      watcher = new FileWatcher(tempDir);
      await watcher.close();

      expect(watcher.isActive).toBe(false);
    });
  });

  describe('close()', () => {
    it('should close the watcher', async () => {
      watcher = new FileWatcher(tempDir);
      
      await watcher.close();

      expect(watcher.watcher).toBeNull();
    });

    it('should clear debounce timers', async () => {
      watcher = new FileWatcher(tempDir);
      watcher.debounceTimers.set('test', setTimeout(() => {}, 10000));
      
      await watcher.close();

      expect(watcher.debounceTimers.size).toBe(0);
    });
  });

  describe('events', () => {
    it('should emit ready event', (done) => {
      watcher = new FileWatcher(tempDir);

      watcher.on('ready', () => {
        done();
      });
    }, 5000);

    it('should emit change event for file changes', (done) => {
      watcher = new FileWatcher(tempDir);
      watcher.debounceDelay = 100;

      const testFile = path.join(tempDir, 'steering', 'test.md');

      watcher.on('ready', async () => {
        await fs.writeFile(testFile, 'initial content');
      });

      watcher.on('add', () => {
        // File was added, now modify it
        fs.writeFile(testFile, 'modified content');
      });

      watcher.on('change', (filePath) => {
        expect(filePath).toBe(testFile);
        done();
      });
    }, 10000);

    it('should emit add event for new files', (done) => {
      watcher = new FileWatcher(tempDir);
      watcher.debounceDelay = 100;

      const testFile = path.join(tempDir, 'steering', 'new-file.md');

      watcher.on('ready', async () => {
        await fs.writeFile(testFile, 'new content');
      });

      watcher.on('add', (filePath) => {
        expect(filePath).toBe(testFile);
        done();
      });
    }, 10000);

    it('should emit unlink event for deleted files', (done) => {
      watcher = new FileWatcher(tempDir);
      watcher.debounceDelay = 100;

      const testFile = path.join(tempDir, 'steering', 'delete-me.md');

      watcher.on('ready', async () => {
        await fs.writeFile(testFile, 'content');
      });

      watcher.on('add', async () => {
        await fs.remove(testFile);
      });

      watcher.on('unlink', (filePath) => {
        expect(filePath).toBe(testFile);
        done();
      });
    }, 10000);
  });

  describe('debounce()', () => {
    it('should debounce rapid events', async () => {
      watcher = new FileWatcher(tempDir);
      watcher.debounceDelay = 100;

      let eventCount = 0;
      watcher.on('change', () => {
        eventCount++;
      });

      // Simulate rapid events
      watcher.debounce('change', 'test-file.md');
      watcher.debounce('change', 'test-file.md');
      watcher.debounce('change', 'test-file.md');

      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(eventCount).toBe(1);
    });

    it('should handle different files separately', async () => {
      watcher = new FileWatcher(tempDir);
      watcher.debounceDelay = 100;

      const changedFiles = [];
      watcher.on('change', (file) => {
        changedFiles.push(file);
      });

      watcher.debounce('change', 'file1.md');
      watcher.debounce('change', 'file2.md');

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(changedFiles).toHaveLength(2);
      expect(changedFiles).toContain('file1.md');
      expect(changedFiles).toContain('file2.md');
    });
  });
});
