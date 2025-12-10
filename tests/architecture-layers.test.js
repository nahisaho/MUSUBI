/**
 * Architecture Layer Standards Tests
 *
 * Tests for the standardized architecture layer definitions
 */

const path = require('path');
const fs = require('fs-extra');

describe('Architecture Layer Standards', () => {
  const structureTemplatePath = path.join(
    __dirname,
    '..',
    'src',
    'templates',
    'shared',
    'steering',
    'structure.md'
  );

  let structureContent;

  beforeAll(async () => {
    structureContent = await fs.readFile(structureTemplatePath, 'utf8');
  });

  describe('Layer Definitions', () => {
    it('should define Layer 1: Domain / Core', () => {
      expect(structureContent).toContain('Layer 1: Domain / Core');
      expect(structureContent).toContain('MUST NOT depend on any other layer');
    });

    it('should define Layer 2: Application / Use Cases', () => {
      expect(structureContent).toContain('Layer 2: Application / Use Cases');
      expect(structureContent).toContain('Depends only on Domain layer');
    });

    it('should define Layer 3: Infrastructure / Adapters', () => {
      expect(structureContent).toContain('Layer 3: Infrastructure / Adapters');
      expect(structureContent).toContain('Depends on Application layer');
    });

    it('should define Layer 4: Interface / Presentation', () => {
      expect(structureContent).toContain('Layer 4: Interface / Presentation');
      expect(structureContent).toContain('Entry points');
    });
  });

  describe('Language Examples', () => {
    const languages = ['TypeScript', 'Rust', 'Python', 'Go', 'Java'];

    languages.forEach(lang => {
      it(`should include ${lang} examples for layers`, () => {
        expect(structureContent).toContain(`| ${lang} |`);
      });
    });
  });

  describe('Layer Dependency Rules', () => {
    it('should document dependency direction', () => {
      expect(structureContent).toContain('Dependency Direction');
    });

    it('should state that Domain layer has no dependencies', () => {
      expect(structureContent).toContain('Domain layer has NO dependencies');
    });
  });

  describe('Domain Layer Rules', () => {
    it('should prohibit framework dependencies', () => {
      expect(structureContent).toContain('No framework dependencies');
    });

    it('should prohibit I/O in domain layer', () => {
      expect(structureContent).toContain('no I/O');
    });

    it('should list domain concepts', () => {
      expect(structureContent).toContain('Entities');
      expect(structureContent).toContain('Value Objects');
      expect(structureContent).toContain('Domain Services');
    });
  });

  describe('Infrastructure Layer Rules', () => {
    it('should contain repositories', () => {
      expect(structureContent).toContain('Repositories');
    });

    it('should contain API clients', () => {
      expect(structureContent).toContain('API Clients');
    });

    it('should note that all I/O operations belong here', () => {
      expect(structureContent).toContain('All I/O operations here');
    });
  });

  describe('Application Layer Rules', () => {
    it('should mention use cases', () => {
      expect(structureContent).toContain('Use Cases');
    });

    it('should mention commands and queries', () => {
      expect(structureContent).toContain('Commands');
      expect(structureContent).toContain('Queries');
    });

    it('should prohibit direct I/O', () => {
      expect(structureContent).toContain('No direct I/O');
    });
  });
});
