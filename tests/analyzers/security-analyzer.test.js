/**
 * Security Analyzer Tests
 *
 * Tests for REQ-P0-B007: Security Risk Detection
 */

'use strict';

const {
  SecurityAnalyzer,
  SecurityRisk,
  SecurityAnalysisResult,
  RiskLevel,
  SECURITY_PATTERNS,
  RISK_SEVERITY,
} = require('../../src/analyzers/security-analyzer');

describe('SecurityAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new SecurityAnalyzer();
  });

  describe('constructor', () => {
    test('should create with default options', () => {
      expect(analyzer.options.confirmationMode).toBe(true);
      expect(analyzer.options.riskThreshold).toBe(RiskLevel.MEDIUM);
    });

    test('should accept custom options', () => {
      const custom = new SecurityAnalyzer({
        confirmationMode: false,
        riskThreshold: RiskLevel.HIGH,
        allowedCommands: ['npm install'],
        ignorePaths: ['test/'],
      });
      expect(custom.options.confirmationMode).toBe(false);
      expect(custom.options.riskThreshold).toBe(RiskLevel.HIGH);
      expect(custom.options.allowedCommands).toContain('npm install');
    });
  });

  describe('analyzeContent - Secrets Detection', () => {
    test('should detect API key patterns', () => {
      const content = 'const apiKey = "sk-abc123def456ghi789jkl012mno345pqr678stu901vwx234";';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.length).toBeGreaterThan(0);
      expect(result.risks.some(r => r.category === 'secrets')).toBe(true);
    });

    test('should detect password patterns', () => {
      const content = 'password = "supersecretpassword123"';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('Password'))).toBe(true);
    });

    test('should detect private keys', () => {
      const content = '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.level === RiskLevel.CRITICAL)).toBe(true);
    });

    test('should detect GitHub tokens', () => {
      const content = 'const token = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('GitHub'))).toBe(true);
    });

    test('should detect OpenAI API keys', () => {
      const content = 'OPENAI_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('OpenAI'))).toBe(true);
    });

    test('should detect AWS access keys', () => {
      const content = 'aws_access_key_id = AKIAIOSFODNN7EXAMPLE';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('AWS'))).toBe(true);
    });
  });

  describe('analyzeContent - Dangerous Commands', () => {
    test('should detect rm -rf /', () => {
      const content = 'exec("rm -rf /")';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.level === RiskLevel.CRITICAL)).toBe(true);
    });

    test('should detect rm -rf ~', () => {
      const content = 'rm -rf ~';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.category === 'dangerousCommands')).toBe(true);
    });

    test('should detect chmod 777', () => {
      const content = 'chmod 777 /var/www/html';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('Chmod 777'))).toBe(true);
    });

    test('should detect curl pipe to bash', () => {
      const content = 'curl https://example.com/script.sh | bash';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('Curl Pipe'))).toBe(true);
    });

    test('should detect mkfs commands', () => {
      const content = 'mkfs.ext4 /dev/sda1';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.level === RiskLevel.CRITICAL)).toBe(true);
    });
  });

  describe('analyzeContent - Vulnerability Patterns', () => {
    test('should detect eval usage', () => {
      const content = 'eval(userInput)';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('Eval'))).toBe(true);
    });

    test('should detect innerHTML assignment', () => {
      const content = 'element.innerHTML = userContent;';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('innerHTML'))).toBe(true);
    });

    test('should detect document.write', () => {
      const content = 'document.write(data);';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('Document Write'))).toBe(true);
    });

    test('should detect dangerouslySetInnerHTML', () => {
      const content = '<div dangerouslySetInnerHTML={{__html: content}} />';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('React Dangerous'))).toBe(true);
    });

    test('should detect SQL injection patterns', () => {
      const content = 'sql = "SELECT * FROM users WHERE id = " + userId;';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('SQL Injection'))).toBe(true);
    });
  });

  describe('analyzeContent - Network Risks', () => {
    test('should detect insecure HTTP URLs', () => {
      const content = 'const url = "http://api.example.com/data";';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('Insecure HTTP'))).toBe(true);
    });

    test('should allow localhost HTTP', () => {
      const content = 'const url = "http://localhost:3000";';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.filter(r => r.name.includes('Insecure HTTP')).length).toBe(0);
    });

    test('should detect binding to all interfaces', () => {
      const content = 'server.listen(3000, "0.0.0.0:8080");';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('Binding'))).toBe(true);
    });

    test('should detect disabled TLS verification', () => {
      const content = 'process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('TLS'))).toBe(true);
    });
  });

  describe('analyzeAction', () => {
    test('should analyze action content', () => {
      const action = {
        type: 'write_file',
        content: 'api_key = "secret-api-key-12345678901234567890"',
        file: 'config.js',
      };
      const result = analyzer.analyzeAction(action);
      expect(result.risks.length).toBeGreaterThan(0);
    });

    test('should analyze action command', () => {
      const action = {
        type: 'run_command',
        command: 'rm -rf /tmp/*',
      };
      const result = analyzer.analyzeAction(action);
      expect(result.risks.some(r => r.category === 'dangerousCommands')).toBe(true);
    });

    test('should analyze action code', () => {
      const action = {
        type: 'edit_file',
        code: 'eval(req.body.code)',
      };
      const result = analyzer.analyzeAction(action);
      expect(result.risks.some(r => r.name.includes('Eval'))).toBe(true);
    });
  });

  describe('analyzeFiles', () => {
    test('should analyze multiple files', () => {
      const files = [
        { path: 'config.js', content: 'api_key = "secret123456789012345678901234567890"' },
        { path: 'utils.js', content: 'eval(input)' },
      ];
      const result = analyzer.analyzeFiles(files);
      expect(result.risks.length).toBeGreaterThanOrEqual(2);
    });

    test('should include file path in risks', () => {
      const files = [{ path: 'src/config.js', content: 'password = "mypassword123"' }];
      const result = analyzer.analyzeFiles(files);
      expect(result.risks[0].file).toBe('src/config.js');
    });

    test('should skip ignored paths', () => {
      const customAnalyzer = new SecurityAnalyzer({
        ignorePaths: ['test/', '*.test.js'],
      });
      const files = [
        { path: 'test/config.test.js', content: 'password = "testpassword123"' },
        { path: 'src/config.js', content: 'password = "prodpassword123"' },
      ];
      const result = customAnalyzer.analyzeFiles(files);
      expect(result.risks.every(r => !r.file.includes('test/'))).toBe(true);
    });
  });

  describe('validateAction', () => {
    test('should block critical risks', () => {
      const action = {
        type: 'run_command',
        command: 'rm -rf /',
      };
      const validation = analyzer.validateAction(action);
      expect(validation.allowed).toBe(false);
      expect(validation.reason).toContain('Critical');
    });

    test('should require confirmation for medium risks', () => {
      const action = {
        type: 'write_file',
        code: 'eval(input)',
      };
      const validation = analyzer.validateAction(action);
      expect(validation.allowed).toBe(false);
      expect(validation.reason).toContain('Confirmation');
    });

    test('should allow low-risk actions in relaxed mode', () => {
      const relaxed = new SecurityAnalyzer({
        confirmationMode: false,
        riskThreshold: RiskLevel.HIGH,
      });
      const action = {
        type: 'write_file',
        code: 'const url = "http://api.example.com";',
      };
      const validation = relaxed.validateAction(action);
      expect(validation.allowed).toBe(true);
    });

    test('should allow safe actions', () => {
      const action = {
        type: 'write_file',
        code: 'const x = 1 + 2;',
      };
      const validation = analyzer.validateAction(action);
      expect(validation.allowed).toBe(true);
    });
  });

  describe('addCustomPatterns', () => {
    test('should add custom patterns', () => {
      analyzer.addCustomPatterns(['CUSTOM_SECRET_\\w+'], RiskLevel.HIGH);
      const content = 'const key = CUSTOM_SECRET_12345';
      const result = analyzer.analyzeContent(content);
      expect(result.risks.some(r => r.name.includes('Custom'))).toBe(true);
    });

    test('should handle invalid regex gracefully', () => {
      // Should not throw
      expect(() => {
        analyzer.addCustomPatterns(['[invalid(regex']);
      }).not.toThrow();
    });
  });

  describe('isAllowedCommand', () => {
    test('should allow whitelisted commands', () => {
      const customAnalyzer = new SecurityAnalyzer({
        allowedCommands: ['npm install', 'npm run test'],
      });
      expect(customAnalyzer.isAllowedCommand('npm install lodash')).toBe(true);
      expect(customAnalyzer.isAllowedCommand('npm run test')).toBe(true);
    });

    test('should not allow non-whitelisted commands', () => {
      expect(analyzer.isAllowedCommand('rm -rf /')).toBe(false);
    });
  });

  describe('generateReport', () => {
    test('should generate markdown report', () => {
      const content = 'password = "secret123"; eval(input);';
      const result = analyzer.analyzeContent(content);
      const report = analyzer.generateReport(result);

      expect(report).toContain('# Security Analysis Report');
      expect(report).toContain('## Summary');
      expect(report).toContain('## Detailed Findings');
    });

    test('should include risk levels in report', () => {
      const content = '-----BEGIN RSA PRIVATE KEY-----';
      const result = analyzer.analyzeContent(content);
      const report = analyzer.generateReport(result);

      expect(report).toContain('CRITICAL');
    });
  });

  describe('fromProjectConfig', () => {
    test('should create from project config', () => {
      const config = {
        security: {
          confirmation_mode: false,
          risk_threshold: 'HIGH',
          allowed_commands: ['npm test'],
          ignore_paths: ['dist/'],
        },
      };
      const fromConfig = SecurityAnalyzer.fromProjectConfig(config);
      expect(fromConfig.options.confirmationMode).toBe(false);
      expect(fromConfig.options.riskThreshold).toBe('HIGH');
      expect(fromConfig.options.allowedCommands).toContain('npm test');
    });

    test('should use defaults for missing config', () => {
      const fromConfig = SecurityAnalyzer.fromProjectConfig({});
      expect(fromConfig.options.confirmationMode).toBe(true);
    });
  });
});

describe('SecurityRisk', () => {
  test('should create risk with all properties', () => {
    const risk = new SecurityRisk({
      category: 'secrets',
      name: 'API Key',
      level: RiskLevel.HIGH,
      match: 'api_key=secret123',
      position: 10,
      file: 'config.js',
      line: 5,
    });

    expect(risk.category).toBe('secrets');
    expect(risk.name).toBe('API Key');
    expect(risk.level).toBe(RiskLevel.HIGH);
    expect(risk.file).toBe('config.js');
    expect(risk.line).toBe(5);
  });

  test('should return correct severity', () => {
    const lowRisk = new SecurityRisk({
      category: 'vulnerabilities',
      name: 'Test',
      level: RiskLevel.LOW,
      match: 'test',
      position: 0,
    });
    const criticalRisk = new SecurityRisk({
      category: 'secrets',
      name: 'Test',
      level: RiskLevel.CRITICAL,
      match: 'test',
      position: 0,
    });

    expect(lowRisk.getSeverity()).toBe(1);
    expect(criticalRisk.getSeverity()).toBe(4);
  });

  test('should mask secret matches', () => {
    const risk = new SecurityRisk({
      category: 'secrets',
      name: 'API Key',
      level: RiskLevel.HIGH,
      match: 'secret12345678901234567890',
      position: 0,
    });

    const masked = risk.getMaskedMatch();
    expect(masked).toContain('...');
    expect(masked).not.toBe('secret12345678901234567890');
  });

  test('should not mask non-secret matches', () => {
    const risk = new SecurityRisk({
      category: 'dangerousCommands',
      name: 'rm -rf',
      level: RiskLevel.CRITICAL,
      match: 'rm -rf /',
      position: 0,
    });

    expect(risk.getMaskedMatch()).toBe('rm -rf /');
  });
});

describe('SecurityAnalysisResult', () => {
  test('should calculate highest level', () => {
    const risks = [
      new SecurityRisk({ category: 'a', name: 'a', level: RiskLevel.LOW, match: '', position: 0 }),
      new SecurityRisk({ category: 'b', name: 'b', level: RiskLevel.HIGH, match: '', position: 0 }),
      new SecurityRisk({
        category: 'c',
        name: 'c',
        level: RiskLevel.MEDIUM,
        match: '',
        position: 0,
      }),
    ];
    const result = new SecurityAnalysisResult(risks);
    expect(result.getHighestLevel()).toBe(RiskLevel.HIGH);
  });

  test('should check threshold exceedance', () => {
    const risks = [
      new SecurityRisk({
        category: 'a',
        name: 'a',
        level: RiskLevel.MEDIUM,
        match: '',
        position: 0,
      }),
    ];
    const result = new SecurityAnalysisResult(risks);

    expect(result.exceedsThreshold(RiskLevel.LOW)).toBe(true);
    expect(result.exceedsThreshold(RiskLevel.HIGH)).toBe(false);
  });

  test('should determine if action should be blocked', () => {
    const criticalRisks = [
      new SecurityRisk({
        category: 'a',
        name: 'a',
        level: RiskLevel.CRITICAL,
        match: '',
        position: 0,
      }),
    ];
    const mediumRisks = [
      new SecurityRisk({
        category: 'a',
        name: 'a',
        level: RiskLevel.MEDIUM,
        match: '',
        position: 0,
      }),
    ];

    expect(new SecurityAnalysisResult(criticalRisks).shouldBlock()).toBe(true);
    expect(new SecurityAnalysisResult(mediumRisks).shouldBlock()).toBe(false);
  });

  test('should get risks by level', () => {
    const risks = [
      new SecurityRisk({ category: 'a', name: 'a', level: RiskLevel.LOW, match: '', position: 0 }),
      new SecurityRisk({ category: 'b', name: 'b', level: RiskLevel.LOW, match: '', position: 0 }),
      new SecurityRisk({ category: 'c', name: 'c', level: RiskLevel.HIGH, match: '', position: 0 }),
    ];
    const result = new SecurityAnalysisResult(risks);

    expect(result.getRisksByLevel(RiskLevel.LOW).length).toBe(2);
    expect(result.getRisksByLevel(RiskLevel.HIGH).length).toBe(1);
  });

  test('should get summary statistics', () => {
    const risks = [
      new SecurityRisk({
        category: 'secrets',
        name: 'a',
        level: RiskLevel.HIGH,
        match: '',
        position: 0,
      }),
      new SecurityRisk({
        category: 'dangerousCommands',
        name: 'b',
        level: RiskLevel.CRITICAL,
        match: '',
        position: 0,
      }),
    ];
    const result = new SecurityAnalysisResult(risks);
    const summary = result.getSummary();

    expect(summary.total).toBe(2);
    expect(summary.byCategory.secrets).toBe(1);
    expect(summary.byCategory.dangerousCommands).toBe(1);
    expect(summary.highestLevel).toBe(RiskLevel.CRITICAL);
    expect(summary.shouldBlock).toBe(true);
  });
});

describe('RiskLevel', () => {
  test('should have all expected levels', () => {
    expect(RiskLevel.LOW).toBe('LOW');
    expect(RiskLevel.MEDIUM).toBe('MEDIUM');
    expect(RiskLevel.HIGH).toBe('HIGH');
    expect(RiskLevel.CRITICAL).toBe('CRITICAL');
  });
});

describe('SECURITY_PATTERNS', () => {
  test('should have all categories', () => {
    expect(SECURITY_PATTERNS.secrets).toBeDefined();
    expect(SECURITY_PATTERNS.dangerousCommands).toBeDefined();
    expect(SECURITY_PATTERNS.vulnerabilities).toBeDefined();
    expect(SECURITY_PATTERNS.network).toBeDefined();
  });

  test('should have patterns with required properties', () => {
    for (const patterns of Object.values(SECURITY_PATTERNS)) {
      for (const pattern of patterns) {
        expect(pattern.pattern).toBeInstanceOf(RegExp);
        expect(typeof pattern.name).toBe('string');
        expect(Object.values(RiskLevel)).toContain(pattern.level);
      }
    }
  });
});

describe('RISK_SEVERITY', () => {
  test('should have correct ordering', () => {
    expect(RISK_SEVERITY[RiskLevel.LOW]).toBeLessThan(RISK_SEVERITY[RiskLevel.MEDIUM]);
    expect(RISK_SEVERITY[RiskLevel.MEDIUM]).toBeLessThan(RISK_SEVERITY[RiskLevel.HIGH]);
    expect(RISK_SEVERITY[RiskLevel.HIGH]).toBeLessThan(RISK_SEVERITY[RiskLevel.CRITICAL]);
  });
});
