import { useState } from 'react'
import './App.css'
import {
  Shield, CheckCircle, TrendingUp, AlertTriangle, Clock, Zap, Target,
  BarChart3, BookOpen, Brain, Layers, ChevronDown, ChevronUp,
  GitPullRequest, Bug, TestTube, Cpu, Users, Building2, Rocket,
  FileCode, Search, Wrench, Award, X, ChevronRight, ExternalLink
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LineChart, Line, Legend, RadialBarChart, RadialBar
} from 'recharts'

const COLORS = {
  bg: '#0a0a0f',
  card: '#18181b',
  border: '#27272a',
  muted: '#71717a',
  text: '#fafafa',
  purple: '#3969CA',
  green: '#21C19A',
  blue: '#0294DE',
  red: '#ef4444',
  orange: '#f59e0b',
}

type Section = 'summary' | 'playbook' | 'heuristics' | 'case-study' | 'iterations' | 'scale' | 'roi'

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'summary', label: 'Executive Summary', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'playbook', label: 'The Playbook Approach', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'heuristics', label: 'Overcoming Heuristics', icon: <Brain className="w-4 h-4" /> },
  { id: 'case-study', label: 'Real-World Case Study', icon: <FileCode className="w-4 h-4" /> },
  { id: 'iterations', label: 'PR Iterations & Learnings', icon: <GitPullRequest className="w-4 h-4" /> },
  { id: 'scale', label: 'Mass Applicability', icon: <Layers className="w-4 h-4" /> },
  { id: 'roi', label: 'ROI & Impact', icon: <TrendingUp className="w-4 h-4" /> },
]

function MetricCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color: string
}) {
  return (
    <div className="p-6 rounded-xl border" style={{ background: COLORS.card, borderColor: COLORS.border }}>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg" style={{ background: `${color}20` }}>
          {icon}
        </div>
        <div>
          <p className="text-sm" style={{ color: COLORS.muted }}>{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {sub && <p className="text-xs mt-1" style={{ color }}>{sub}</p>}
        </div>
      </div>
    </div>
  )
}

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 rounded-xl border ${className}`} style={{ background: COLORS.card, borderColor: COLORS.border }}>
      {children}
    </div>
  )
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: `${color}20`, color }}>
      {text}
    </span>
  )
}

function ExecutiveSummary() {
  const coverageData = [
    { name: 'Before Devin', value: 9, fill: COLORS.red },
    { name: 'With Knowledge', value: 36, fill: COLORS.orange },
    { name: 'With Playbook', value: 80, fill: COLORS.green },
  ]

  const achievements = [
    { text: '734 unit tests generated in a single 90-minute session', icon: <TestTube className="w-5 h-5" style={{ color: COLORS.green }} /> },
    { text: '81x productivity multiplier vs. manual test writing', icon: <Zap className="w-5 h-5" style={{ color: COLORS.purple }} /> },
    { text: '80.19% code coverage achieved on legacy codebase', icon: <Target className="w-5 h-5" style={{ color: COLORS.blue }} /> },
    { text: 'Compiled successfully on first attempt', icon: <CheckCircle className="w-5 h-5" style={{ color: COLORS.green }} /> },
    { text: '11,000+ lines of test code produced', icon: <FileCode className="w-5 h-5" style={{ color: COLORS.purple }} /> },
    { text: 'Method-level coverage analysis across entire codebase', icon: <Search className="w-5 h-5" style={{ color: COLORS.blue }} /> },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Executive Summary</h1>
        <p style={{ color: COLORS.muted }}>
          How Devin + structured playbooks deliver an 81x productivity gain on legacy unit test coverage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Zap className="w-8 h-8" style={{ color: COLORS.purple }} />}
          label="Productivity Multiplier"
          value="81x"
          sub="vs. manual engineering"
          color={COLORS.purple}
        />
        <MetricCard
          icon={<TestTube className="w-8 h-8" style={{ color: COLORS.green }} />}
          label="Tests Generated"
          value="734"
          sub="in a single session"
          color={COLORS.green}
        />
        <MetricCard
          icon={<Target className="w-8 h-8" style={{ color: COLORS.blue }} />}
          label="Code Coverage"
          value="80.19%"
          sub="from 9% baseline"
          color={COLORS.blue}
        />
        <MetricCard
          icon={<Clock className="w-8 h-8" style={{ color: COLORS.orange }} />}
          label="Session Duration"
          value="90 min"
          sub="vs. 122 hours manual"
          color={COLORS.orange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard>
          <h3 className="text-lg font-semibold text-white mb-4">Coverage Progression</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={coverageData}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="name" tick={{ fill: COLORS.muted, fontSize: 12 }} />
              <YAxis tick={{ fill: COLORS.muted, fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text }}
                formatter={(value: number) => [`${value}%`, 'Coverage']}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {coverageData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard>
          <h3 className="text-lg font-semibold text-white mb-4">Key Achievements</h3>
          <div className="space-y-3">
            {achievements.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: `${COLORS.bg}` }}>
                {a.icon}
                <span className="text-sm text-white">{a.text}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard>
        <h3 className="text-lg font-semibold text-white mb-3">The Bottom Line</h3>
        <p className="text-sm leading-relaxed" style={{ color: COLORS.muted }}>
          A legacy enterprise codebase with mixed framework versions (v6/v8/v10) and minimal test coverage was transformed
          using Devin's AI-powered playbook approach. What would have taken a senior engineer <strong className="text-white">122 hours</strong> of
          manual work was completed in <strong className="text-white">90 minutes</strong> — a verified <strong style={{ color: COLORS.green }}>81x
          productivity multiplier</strong>. The generated tests compiled on the first attempt and passed the customer's internal
          validation tools, proving both quality and reliability at scale.
        </p>
      </SectionCard>
    </div>
  )
}

function PlaybookApproach() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null)

  const phases = [
    {
      phase: 'Phase 1: Baseline Assessment',
      icon: <Search className="w-5 h-5" style={{ color: COLORS.blue }} />,
      description: 'Run existing customer prompt against the codebase to establish baseline metrics.',
      details: [
        'Execute the standard unit test generation prompt on the target repository',
        'Measure baseline coverage percentage and test count',
        'Identify gaps between expected and actual coverage',
        'Document which files and methods were covered vs. skipped',
      ],
      result: 'Baseline: 74 tests, 36% coverage — well below the 80% target',
    },
    {
      phase: 'Phase 2: Analyze with Advanced Devin',
      icon: <Brain className="w-5 h-5" style={{ color: COLORS.purple }} />,
      description: 'Use Advanced Devin to analyze session behavior and uncover hidden heuristics.',
      details: [
        'Use "Analyze Session" in Advanced Devin to examine how Devin approached the task',
        'Identify decision points where Devin made suboptimal choices',
        'Uncover heuristic patterns (e.g., file-level vs method-level analysis)',
        'Document root causes for coverage gaps',
      ],
      result: 'Discovered coarse "has tests" heuristic that skipped large files with partial coverage',
    },
    {
      phase: 'Phase 3: Create Targeted Knowledge',
      icon: <BookOpen className="w-5 h-5" style={{ color: COLORS.green }} />,
      description: 'Build organization-level knowledge that encodes lessons learned from analysis.',
      details: [
        'Create Knowledge entries that address discovered heuristic issues',
        'Encode principles: "Never assume \'has tests\' = \'has comprehensive coverage\'"',
        'Add rules: "\'Indirectly tested\' is NOT an exemption"',
        'Require method-level gap analysis for every file regardless of existing test status',
      ],
      result: '150 tests with Knowledge alone — a 103% improvement, but still below target',
    },
    {
      phase: 'Phase 4: Build & Iterate on Playbook',
      icon: <Wrench className="w-5 h-5" style={{ color: COLORS.orange }} />,
      description: 'Use Advanced Devin to create an operationalized playbook with process controls.',
      details: [
        'Use "Improve Playbook" in Advanced Devin to generate structured playbook',
        'Add tier classification (large files = Tier-0, addressed first)',
        'Include midpoint checkpoints requiring approval before writing tests',
        'Add source inventory + manifest parity gates',
        'Define forbidden actions: "NEVER defer large files", "NEVER use \'prioritized for future coverage\'"',
      ],
      result: '734 tests, 80.19% coverage — target exceeded with single session',
    },
  ]

  const playbookComponents = [
    { name: 'Tier Classification', desc: 'Files >1000 lines = Tier-0, must be addressed FIRST. Prevents skipping the most important files.', color: COLORS.red },
    { name: 'Method-Level Analysis', desc: 'Every public method must be inventoried and compared against existing tests. No file-level shortcuts.', color: COLORS.purple },
    { name: 'Midpoint Checkpoints', desc: 'Approval gates at 50% completion to verify coverage trajectory before continuing.', color: COLORS.orange },
    { name: 'Source Inventory Gates', desc: 'Manifest parity check ensures every source file has been analyzed and accounted for.', color: COLORS.blue },
    { name: 'Forbidden Actions', desc: '"NEVER defer large files", "NEVER use \'prioritized for future coverage\'", "NEVER skip indirectly tested methods"', color: COLORS.red },
    { name: 'Line-by-Line Analysis', desc: 'Force method-level analysis, line by line, without skipping directories. No coarse heuristics allowed.', color: COLORS.green },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">The Playbook Approach</h1>
        <p style={{ color: COLORS.muted }}>
          How structured, iterative playbooks transform Devin from good to exceptional
        </p>
      </div>

      <SectionCard>
        <h3 className="text-lg font-semibold text-white mb-2">Why Playbooks Matter</h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: COLORS.muted }}>
          Out-of-the-box AI code generation produces adequate results. But for enterprise-grade coverage on legacy codebases,
          you need <strong className="text-white">structured process controls</strong> that prevent the AI from taking shortcuts.
          Playbooks encode organizational knowledge, enforce quality gates, and ensure consistent, reproducible results
          across sessions, repositories, and teams.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={{ background: COLORS.bg }}>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4" style={{ color: COLORS.green }} />
              <span className="text-sm font-medium text-white">Reproducible</span>
            </div>
            <p className="text-xs" style={{ color: COLORS.muted }}>Same playbook, same results — across any repo, any team, any session</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: COLORS.bg }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" style={{ color: COLORS.purple }} />
              <span className="text-sm font-medium text-white">Quality-Gated</span>
            </div>
            <p className="text-xs" style={{ color: COLORS.muted }}>Built-in checkpoints prevent drift and ensure coverage targets are met</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: COLORS.bg }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" style={{ color: COLORS.blue }} />
              <span className="text-sm font-medium text-white">Iterative</span>
            </div>
            <p className="text-xs" style={{ color: COLORS.muted }}>Each session's learnings improve the next — compounding value over time</p>
          </div>
        </div>
      </SectionCard>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">The 4-Phase Iteration Process</h2>
        <div className="space-y-4">
          {phases.map((p, i) => (
            <SectionCard key={i}>
              <button
                className="w-full flex items-center justify-between"
                onClick={() => setExpandedPhase(expandedPhase === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style={{ background: `${COLORS.purple}30`, color: COLORS.purple }}>
                    {i + 1}
                  </div>
                  {p.icon}
                  <div className="text-left">
                    <h3 className="text-base font-semibold text-white">{p.phase}</h3>
                    <p className="text-sm" style={{ color: COLORS.muted }}>{p.description}</p>
                  </div>
                </div>
                {expandedPhase === i ? <ChevronUp className="w-5 h-5" style={{ color: COLORS.muted }} /> : <ChevronDown className="w-5 h-5" style={{ color: COLORS.muted }} />}
              </button>
              {expandedPhase === i && (
                <div className="mt-4 pl-11 space-y-3">
                  <ul className="space-y-2">
                    {p.details.map((d, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm" style={{ color: COLORS.muted }}>
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: COLORS.purple }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="p-3 rounded-lg" style={{ background: `${COLORS.green}10`, border: `1px solid ${COLORS.green}30` }}>
                    <p className="text-sm" style={{ color: COLORS.green }}>
                      <strong>Result:</strong> {p.result}
                    </p>
                  </div>
                </div>
              )}
            </SectionCard>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Playbook Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playbookComponents.map((c, i) => (
            <SectionCard key={i}>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: c.color }} />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">{c.name}</h4>
                  <p className="text-xs" style={{ color: COLORS.muted }}>{c.desc}</p>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      </div>
    </div>
  )
}

function OvercomingHeuristics() {
  const heuristicComparison = [
    { aspect: 'File Analysis', before: 'Binary check: "has test file" or "no test file"', after: 'Method-level inventory of every public method' },
    { aspect: 'Coverage Assessment', before: 'If any tests exist, mark as "covered"', after: 'Compare each method against existing test methods' },
    { aspect: 'Large Files', before: 'Skip if test file exists (even with 50 tests for 100+ methods)', after: 'Tier-0 priority: address largest files FIRST' },
    { aspect: 'Indirect Testing', before: 'Accept "indirectly tested" as valid coverage', after: 'Direct test required for every public method' },
    { aspect: 'Gap Analysis', before: 'None — coarse file-level decisions only', after: 'Coverage report + source file comparison per method' },
    { aspect: 'Prioritization', before: 'Only test files with zero existing tests', after: 'Test all files, prioritized by size and gap severity' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Overcoming Heuristics</h1>
        <p style={{ color: COLORS.muted }}>
          How Devin identifies and fixes its own analytical shortcuts — a capability unique to AI-native engineering
        </p>
      </div>

      <SectionCard>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg" style={{ background: `${COLORS.red}20` }}>
            <AlertTriangle className="w-6 h-6" style={{ color: COLORS.red }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">The Heuristic Problem</h3>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.muted }}>
              When AI systems analyze codebases for test coverage, they often use <strong className="text-white">coarse heuristics</strong> —
              quick rules of thumb that sacrifice accuracy for speed. The most common: <strong style={{ color: COLORS.red }}>
              "This file has a test file, therefore it's covered."</strong> This binary classification misses
              the critical difference between <em>having some tests</em> and <em>having comprehensive coverage</em>.
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard>
          <div className="flex items-center gap-2 mb-4">
            <X className="w-5 h-5" style={{ color: COLORS.red }} />
            <h3 className="text-lg font-semibold text-white">What the AI Did Wrong</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg" style={{ background: COLORS.bg }}>
              <p className="text-sm" style={{ color: COLORS.muted }}>
                <X className="w-4 h-4 inline mr-1" style={{ color: COLORS.red }} />
                Did NOT open source files to enumerate public methods
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: COLORS.bg }}>
              <p className="text-sm" style={{ color: COLORS.muted }}>
                <X className="w-4 h-4 inline mr-1" style={{ color: COLORS.red }} />
                Did NOT compare 5,000+ line source files against existing tests to find gaps
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: COLORS.bg }}>
              <p className="text-sm" style={{ color: COLORS.muted }}>
                <X className="w-4 h-4 inline mr-1" style={{ color: COLORS.red }} />
                Did NOT use coverage reports to identify uncovered methods
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: COLORS.bg }}>
              <p className="text-sm" style={{ color: COLORS.muted }}>
                <X className="w-4 h-4 inline mr-1" style={{ color: COLORS.red }} />
                Classified files with ~50 tests as "covered" despite 100+ public methods
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5" style={{ color: COLORS.green }} />
            <h3 className="text-lg font-semibold text-white">How Knowledge + Playbook Fixed It</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg" style={{ background: `${COLORS.green}08` }}>
              <p className="text-sm font-medium text-white mb-1">Knowledge Established Principles:</p>
              <ul className="space-y-1">
                <li className="text-sm flex items-start gap-1" style={{ color: COLORS.muted }}>
                  <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: COLORS.green }} />
                  "Never assume 'has tests' = 'has comprehensive coverage'"
                </li>
                <li className="text-sm flex items-start gap-1" style={{ color: COLORS.muted }}>
                  <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: COLORS.green }} />
                  "'Indirectly tested' is NOT an exemption"
                </li>
                <li className="text-sm flex items-start gap-1" style={{ color: COLORS.muted }}>
                  <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: COLORS.green }} />
                  Method-level gap analysis for EVERY file
                </li>
              </ul>
            </div>
            <div className="p-3 rounded-lg" style={{ background: `${COLORS.purple}08` }}>
              <p className="text-sm font-medium text-white mb-1">Playbook Added Process Controls:</p>
              <ul className="space-y-1">
                <li className="text-sm flex items-start gap-1" style={{ color: COLORS.muted }}>
                  <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: COLORS.purple }} />
                  Tier classification (large files = Tier-0, must address FIRST)
                </li>
                <li className="text-sm flex items-start gap-1" style={{ color: COLORS.muted }}>
                  <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: COLORS.purple }} />
                  Midpoint checkpoint requiring approval before writing tests
                </li>
                <li className="text-sm flex items-start gap-1" style={{ color: COLORS.muted }}>
                  <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: COLORS.purple }} />
                  Source inventory + manifest parity gate
                </li>
              </ul>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard>
        <h3 className="text-lg font-semibold text-white mb-4">Before vs. After: Heuristic Resolution</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <th className="text-left py-3 px-4 font-medium" style={{ color: COLORS.muted }}>Aspect</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: COLORS.red }}>Before (Coarse Heuristic)</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: COLORS.green }}>After (Playbook-Driven)</th>
              </tr>
            </thead>
            <tbody>
              {heuristicComparison.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td className="py-3 px-4 font-medium text-white">{row.aspect}</td>
                  <td className="py-3 px-4" style={{ color: COLORS.muted }}>{row.before}</td>
                  <td className="py-3 px-4" style={{ color: COLORS.muted }}>{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg" style={{ background: `${COLORS.purple}20` }}>
            <Brain className="w-6 h-6" style={{ color: COLORS.purple }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Why This Matters</h3>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.muted }}>
              Other AI coding tools cannot self-analyze their own decision-making process. Devin's <strong className="text-white">Advanced
              Session analysis</strong> capability allows it to introspect on previous sessions, identify where it took shortcuts,
              and generate corrective knowledge and playbook rules. This <strong style={{ color: COLORS.purple }}>meta-learning
              capability</strong> is what separates Devin from other providers — it doesn't just write code, it learns how to
              write better code through structured self-improvement.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

function CaseStudy() {
  const prData = [
    { name: 'PR #1\n(Baseline)', tests: 74, coverage: 36, linesAdded: 2100, session: 45 },
    { name: 'PR #2\n(+Knowledge)', tests: 150, coverage: 52, linesAdded: 4800, session: 60 },
    { name: 'PR #3\n(+Playbook)', tests: 734, coverage: 80.19, linesAdded: 11000, session: 90 },
  ]

  const chartData = [
    { name: 'PR #1 (Baseline)', tests: 74, coverage: 36 },
    { name: 'PR #2 (+Knowledge)', tests: 150, coverage: 52 },
    { name: 'PR #3 (+Playbook)', tests: 734, coverage: 80.19 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Real-World Case Study</h1>
        <p style={{ color: COLORS.muted }}>
          A legacy .NET enterprise codebase — mixed framework versions, 5,000+ line service files, minimal existing coverage
        </p>
      </div>

      <SectionCard>
        <h3 className="text-lg font-semibold text-white mb-4">The Challenge</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg" style={{ background: COLORS.bg }}>
            <Building2 className="w-5 h-5 mb-2" style={{ color: COLORS.blue }} />
            <p className="text-sm font-medium text-white">Enterprise Legacy Codebase</p>
            <p className="text-xs mt-1" style={{ color: COLORS.muted }}>Large-scale .NET application with mixed framework versions (v6, v8, v10)</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: COLORS.bg }}>
            <FileCode className="w-5 h-5 mb-2" style={{ color: COLORS.purple }} />
            <p className="text-sm font-medium text-white">Complex Service Layer</p>
            <p className="text-xs mt-1" style={{ color: COLORS.muted }}>5,000+ line service files with 100+ public methods and multiple API endpoints</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: COLORS.bg }}>
            <Bug className="w-5 h-5 mb-2" style={{ color: COLORS.red }} />
            <p className="text-sm font-medium text-white">Low Initial Coverage</p>
            <p className="text-xs mt-1" style={{ color: COLORS.muted }}>Only ~50 existing test methods covering a fraction of the service layer</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: COLORS.bg }}>
            <Target className="w-5 h-5 mb-2" style={{ color: COLORS.green }} />
            <p className="text-sm font-medium text-white">80% Coverage Target</p>
            <p className="text-xs mt-1" style={{ color: COLORS.muted }}>Enterprise mandate requiring 80% minimum unit test coverage</p>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard>
          <h3 className="text-lg font-semibold text-white mb-4">Test Count Progression</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="name" tick={{ fill: COLORS.muted, fontSize: 11 }} />
              <YAxis tick={{ fill: COLORS.muted, fontSize: 12 }} />
              <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text }} />
              <Bar dataKey="tests" fill={COLORS.purple} radius={[6, 6, 0, 0]} name="Tests Generated" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard>
          <h3 className="text-lg font-semibold text-white mb-4">Coverage % Progression</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="name" tick={{ fill: COLORS.muted, fontSize: 11 }} />
              <YAxis tick={{ fill: COLORS.muted, fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text }} />
              <Line type="monotone" dataKey="coverage" stroke={COLORS.green} strokeWidth={3} dot={{ fill: COLORS.green, r: 6 }} name="Coverage %" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard>
        <h3 className="text-lg font-semibold text-white mb-4">PR Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <th className="text-left py-3 px-4 font-medium" style={{ color: COLORS.muted }}>Metric</th>
                {prData.map((pr, i) => (
                  <th key={i} className="text-left py-3 px-4 font-medium" style={{ color: i === 2 ? COLORS.green : COLORS.muted }}>
                    {pr.name.split('\n')[0]} <span className="text-xs block font-normal">{pr.name.split('\n')[1]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td className="py-3 px-4 font-medium text-white">Unit Tests</td>
                {prData.map((pr, i) => (
                  <td key={i} className="py-3 px-4" style={{ color: i === 2 ? COLORS.green : COLORS.muted }}>{pr.tests}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td className="py-3 px-4 font-medium text-white">Coverage</td>
                {prData.map((pr, i) => (
                  <td key={i} className="py-3 px-4" style={{ color: i === 2 ? COLORS.green : COLORS.muted }}>{pr.coverage}%</td>
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td className="py-3 px-4 font-medium text-white">Lines Added</td>
                {prData.map((pr, i) => (
                  <td key={i} className="py-3 px-4" style={{ color: i === 2 ? COLORS.green : COLORS.muted }}>{pr.linesAdded.toLocaleString()}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td className="py-3 px-4 font-medium text-white">Session Duration</td>
                {prData.map((pr, i) => (
                  <td key={i} className="py-3 px-4" style={{ color: i === 2 ? COLORS.green : COLORS.muted }}>{pr.session} min</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Target Met</td>
                {prData.map((pr, i) => (
                  <td key={i} className="py-3 px-4">
                    {pr.coverage >= 80 ? (
                      <Badge text="YES" color={COLORS.green} />
                    ) : (
                      <Badge text="NO" color={COLORS.red} />
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg" style={{ background: `${COLORS.green}20` }}>
            <Award className="w-6 h-6" style={{ color: COLORS.green }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Customer Validation</h3>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.muted }}>
              The customer tested all PRs internally with their existing validation tools. The final playbook-driven PR
              <strong className="text-white"> compiled on the first attempt</strong> — a result that surprised even the customer.
              The quality of the generated unit tests was validated as production-ready, with comprehensive coverage of
              API endpoints, error handling paths, and edge cases.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

function PRIterations() {
  const timeline = [
    {
      title: 'Session 1: Baseline Run',
      date: 'Initial Assessment',
      color: COLORS.red,
      items: [
        { label: 'Approach', value: 'Customer\'s existing prompt run against the codebase' },
        { label: 'Result', value: '74 unit tests added, 36% coverage' },
        { label: 'Issue Found', value: 'Devin used coarse "has tests" heuristic — skipped largest service files' },
        { label: 'Coverage Gain', value: 'Only 9% above baseline' },
      ],
      learning: 'Standard prompts are insufficient for legacy codebases with partial coverage. AI defaults to coarse file-level heuristics.'
    },
    {
      title: 'Advanced Devin: Analyze Session',
      date: 'Root Cause Analysis',
      color: COLORS.purple,
      items: [
        { label: 'Action', value: 'Used Advanced Devin "Analyze Session" to examine decision-making' },
        { label: 'Discovery', value: 'Files categorized as "Has test file" vs "No test file" — binary classification' },
        { label: 'Root Cause', value: 'Only files with NO tests were prioritized; partial-coverage files were skipped entirely' },
        { label: 'Evidence', value: 'At state 116/205: Devin never opened source file to enumerate methods' },
      ],
      learning: 'Advanced Devin\'s session analysis can identify the exact decision point where AI takes shortcuts. This meta-learning is unique to Devin.'
    },
    {
      title: 'Session 2: Knowledge-Enhanced Run',
      date: 'Knowledge Applied',
      color: COLORS.orange,
      items: [
        { label: 'Action', value: 'Created org-level knowledge to overcome heuristic issue' },
        { label: 'Knowledge Rules', value: '"Never assume \'has tests\' = \'has comprehensive coverage\'", "Method-level gap analysis for EVERY file"' },
        { label: 'Result', value: '150 new test methods added' },
        { label: 'Improvement', value: '103% increase over baseline — but still below 80% target' },
      ],
      learning: 'Knowledge alone improves behavior significantly (103% improvement) but isn\'t sufficient for hitting aggressive coverage targets on complex codebases.'
    },
    {
      title: 'Advanced Devin: Improve Playbook',
      date: 'Playbook Engineering',
      color: COLORS.blue,
      items: [
        { label: 'Action', value: 'Used Advanced Devin to generate and iterate on a comprehensive unit test playbook' },
        { label: 'Key Additions', value: 'Tier classification, midpoint checkpoints, manifest parity gates, forbidden actions' },
        { label: 'Sessions', value: '2-3 Advanced Devin iterations to refine the playbook' },
        { label: 'Innovation', value: 'Force line-by-line method analysis without skipping directories' },
      ],
      learning: 'The playbook operationalizes knowledge into enforceable process controls. It\'s the difference between knowing what to do and ensuring it gets done.'
    },
    {
      title: 'Session 3: Playbook-Driven Run',
      date: 'Final Result',
      color: COLORS.green,
      items: [
        { label: 'Approach', value: 'Knowledge + Playbook combined in a single Devin session' },
        { label: 'Result', value: '734 unit tests, 80.19% coverage, 11K lines of code' },
        { label: 'Duration', value: '90 minutes (vs. estimated 122 hours manual)' },
        { label: 'Validation', value: 'Compiled on first attempt, passed customer\'s internal validation tools' },
      ],
      learning: 'The combination of Knowledge (principles) + Playbook (process controls) is what unlocks production-grade results. This is the formula for 81x productivity.'
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">PR Iterations & Learnings</h1>
        <p style={{ color: COLORS.muted }}>
          The journey from 36% to 80% coverage — each iteration building on the last
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: COLORS.border }} />
        <div className="space-y-8">
          {timeline.map((item, i) => (
            <div key={i} className="relative pl-16">
              <div
                className="absolute left-4 w-5 h-5 rounded-full border-2"
                style={{ background: COLORS.card, borderColor: item.color, top: '1.5rem' }}
              />
              <SectionCard>
                <div className="flex items-center gap-2 mb-1">
                  <Badge text={item.date} color={item.color} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                <div className="space-y-2 mb-4">
                  {item.items.map((detail, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="text-xs font-medium min-w-24 pt-0.5" style={{ color: item.color }}>{detail.label}:</span>
                      <span className="text-sm" style={{ color: COLORS.muted }}>{detail.value}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg" style={{ background: `${item.color}10`, border: `1px solid ${item.color}30` }}>
                  <p className="text-xs" style={{ color: item.color }}>
                    <strong>Key Learning:</strong> {item.learning}
                  </p>
                </div>
              </SectionCard>
            </div>
          ))}
        </div>
      </div>

      <SectionCard>
        <h3 className="text-lg font-semibold text-white mb-4">The Compounding Effect</h3>
        <p className="text-sm leading-relaxed" style={{ color: COLORS.muted }}>
          Each iteration didn't just improve results — it created <strong className="text-white">reusable assets</strong>.
          The Knowledge and Playbook generated during this engagement can now be applied to <strong style={{ color: COLORS.green }}>
          any .NET repository</strong> in the organization, producing the same 80%+ coverage results without repeating
          the iteration process. This is the foundation for mass applicability.
        </p>
      </SectionCard>
    </div>
  )
}

function MassApplicability() {
  const scaleData = [
    { repos: '1', manual: 122, devin: 1.5 },
    { repos: '10', manual: 1220, devin: 15 },
    { repos: '50', manual: 6100, devin: 75 },
    { repos: '100', manual: 12200, devin: 150 },
    { repos: '500', manual: 61000, devin: 750 },
  ]

  const parallelCapabilities = [
    {
      title: 'Playbook Reusability',
      desc: 'One playbook, proven on a single repo, deployed identically across hundreds of repositories',
      icon: <BookOpen className="w-5 h-5" style={{ color: COLORS.purple }} />,
      stat: '1 playbook \u2192 N repos',
    },
    {
      title: 'Concurrent Sessions',
      desc: 'Advanced Devin runs multiple sessions simultaneously — 50+ repos processed in parallel',
      icon: <Cpu className="w-5 h-5" style={{ color: COLORS.blue }} />,
      stat: '50+ parallel sessions',
    },
    {
      title: 'Cross-Framework',
      desc: 'While proven on .NET, the playbook methodology applies to Java, Python, TypeScript, Go, and more',
      icon: <Layers className="w-5 h-5" style={{ color: COLORS.green }} />,
      stat: 'Any language/framework',
    },
    {
      title: 'Organizational Learning',
      desc: 'Knowledge compounds — each repo\'s learnings improve the playbook for all subsequent repos',
      icon: <TrendingUp className="w-5 h-5" style={{ color: COLORS.orange }} />,
      stat: 'Continuous improvement',
    },
  ]

  const useCases = [
    { name: 'Legacy Modernization', desc: 'Add test coverage before migrating framework versions', repos: '100+', impact: '80%+ coverage baseline' },
    { name: 'Compliance Requirements', desc: 'Meet coverage mandates across entire portfolio', repos: '500+', impact: 'Audit-ready in days' },
    { name: 'M&A Due Diligence', desc: 'Rapidly assess and improve acquired codebase quality', repos: '50+', impact: 'Risk reduction at scale' },
    { name: 'DevSecOps Pipeline', desc: 'Automated coverage enforcement in CI/CD', repos: 'Ongoing', impact: 'Zero-coverage-debt policy' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mass Applicability</h1>
        <p style={{ color: COLORS.muted }}>
          From one repo to hundreds — how Advanced Devin scales playbook-driven testing across the enterprise
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {parallelCapabilities.map((cap, i) => (
          <SectionCard key={i}>
            <div className="flex items-center gap-2 mb-3">
              {cap.icon}
              <h4 className="text-sm font-semibold text-white">{cap.title}</h4>
            </div>
            <p className="text-xs mb-3" style={{ color: COLORS.muted }}>{cap.desc}</p>
            <Badge text={cap.stat} color={COLORS.purple} />
          </SectionCard>
        ))}
      </div>

      <SectionCard>
        <h3 className="text-lg font-semibold text-white mb-4">Time Savings at Scale</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={scaleData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="repos" tick={{ fill: COLORS.muted, fontSize: 12 }} label={{ value: 'Number of Repositories', position: 'bottom', fill: COLORS.muted, fontSize: 12, dy: 10 }} />
            <YAxis tick={{ fill: COLORS.muted, fontSize: 12 }} label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: COLORS.muted, fontSize: 12 }} />
            <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text }} />
            <Legend wrapperStyle={{ color: COLORS.muted }} />
            <Bar dataKey="manual" fill={COLORS.red} name="Manual (hours)" radius={[4, 4, 0, 0]} opacity={0.7} />
            <Bar dataKey="devin" fill={COLORS.green} name="Devin + Playbook (hours)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-center mt-2" style={{ color: COLORS.muted }}>
          Based on 122 hours manual per repo vs. 1.5 hours Devin per repo (81x multiplier)
        </p>
      </SectionCard>

      <SectionCard>
        <h3 className="text-lg font-semibold text-white mb-4">Enterprise Use Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {useCases.map((uc, i) => (
            <div key={i} className="p-4 rounded-lg" style={{ background: COLORS.bg }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">{uc.name}</h4>
                <Badge text={uc.repos + ' repos'} color={COLORS.blue} />
              </div>
              <p className="text-xs mb-2" style={{ color: COLORS.muted }}>{uc.desc}</p>
              <p className="text-xs" style={{ color: COLORS.green }}>Impact: {uc.impact}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg" style={{ background: `${COLORS.green}20` }}>
            <Rocket className="w-6 h-6" style={{ color: COLORS.green }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">The Advanced Devin Advantage</h3>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.muted }}>
              With Advanced Devin, organizations can run <strong className="text-white">hundreds of concurrent sessions</strong>,
              each executing the same battle-tested playbook. A portfolio of 100 repositories that would take a team of
              engineers <strong style={{ color: COLORS.red }}>over 12,000 hours</strong> (roughly 6 engineer-years) can be completed in
              <strong style={{ color: COLORS.green }}> under 150 hours of Devin time</strong> — running in parallel,
              that's days, not years. And because the playbook encodes all the hard-won learnings from iteration,
              every session produces consistent, high-quality results.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

function ROIImpact() {
  const roiData = [
    { name: 'Manual\nEngineering', hours: 122, cost: 18300, tests: 734, color: COLORS.red },
    { name: 'Standard AI\n(No Playbook)', hours: 3, cost: 450, tests: 74, color: COLORS.orange },
    { name: 'Devin +\nPlaybook', hours: 1.5, cost: 225, tests: 734, color: COLORS.green },
  ]

  const costChart = [
    { name: 'Manual', cost: 18300 },
    { name: 'AI (No Playbook)', cost: 450 },
    { name: 'Devin + Playbook', cost: 225 },
  ]

  const qualityRadial = [
    { name: 'Coverage', value: 80, fill: COLORS.green },
    { name: 'First-Compile', value: 100, fill: COLORS.purple },
    { name: 'Validation', value: 100, fill: COLORS.blue },
  ]

  const valueProps = [
    {
      category: 'Speed',
      icon: <Zap className="w-5 h-5" style={{ color: COLORS.purple }} />,
      metrics: [
        { label: '81x faster', desc: 'Than manual test writing' },
        { label: '90 minutes', desc: 'To generate 734 tests' },
        { label: 'First-compile success', desc: 'No iteration needed' },
      ]
    },
    {
      category: 'Quality',
      icon: <Award className="w-5 h-5" style={{ color: COLORS.green }} />,
      metrics: [
        { label: '80.19% coverage', desc: 'Exceeding 80% target' },
        { label: 'Method-level analysis', desc: 'Not file-level shortcuts' },
        { label: 'Customer-validated', desc: 'Passed internal tools' },
      ]
    },
    {
      category: 'Scale',
      icon: <Layers className="w-5 h-5" style={{ color: COLORS.blue }} />,
      metrics: [
        { label: 'Reusable playbook', desc: 'One investment, infinite repos' },
        { label: 'Parallel execution', desc: '50+ sessions at once' },
        { label: 'Cross-framework', desc: '.NET, Java, Python, etc.' },
      ]
    },
    {
      category: 'Learning',
      icon: <Brain className="w-5 h-5" style={{ color: COLORS.orange }} />,
      metrics: [
        { label: 'Self-improving', desc: 'Each session improves the next' },
        { label: 'Heuristic detection', desc: 'Finds its own shortcuts' },
        { label: 'Knowledge compound', desc: 'Org-wide improvements' },
      ]
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">ROI & Impact</h1>
        <p style={{ color: COLORS.muted }}>
          Quantifying the value of AI-powered, playbook-driven unit test coverage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Zap className="w-8 h-8" style={{ color: COLORS.purple }} />}
          label="Time Saved"
          value="120.5 hrs"
          sub="per repository"
          color={COLORS.purple}
        />
        <MetricCard
          icon={<TrendingUp className="w-8 h-8" style={{ color: COLORS.green }} />}
          label="Cost Savings"
          value="$18,075"
          sub="per repository @ $150/hr"
          color={COLORS.green}
        />
        <MetricCard
          icon={<Users className="w-8 h-8" style={{ color: COLORS.blue }} />}
          label="Engineer Equivalent"
          value="3 weeks"
          sub="of full-time work saved"
          color={COLORS.blue}
        />
        <MetricCard
          icon={<Target className="w-8 h-8" style={{ color: COLORS.orange }} />}
          label="Quality Score"
          value="100%"
          sub="first-compile success rate"
          color={COLORS.orange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard>
          <h3 className="text-lg font-semibold text-white mb-4">Cost Comparison (per repo)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={costChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis type="number" tick={{ fill: COLORS.muted, fontSize: 12 }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <YAxis type="category" dataKey="name" tick={{ fill: COLORS.muted, fontSize: 11 }} width={120} />
              <Tooltip
                contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cost']}
              />
              <Bar dataKey="cost" radius={[0, 6, 6, 0]}>
                {costChart.map((_, i) => (
                  <Cell key={i} fill={[COLORS.red, COLORS.orange, COLORS.green][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-center mt-2" style={{ color: COLORS.muted }}>Based on $150/hour engineering rate</p>
        </SectionCard>

        <SectionCard>
          <h3 className="text-lg font-semibold text-white mb-4">Quality Metrics</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={qualityRadial} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" cornerRadius={10} label={{ fill: COLORS.text, fontSize: 12 }} />
              <Legend
                iconSize={10}
                layout="horizontal"
                verticalAlign="bottom"
                wrapperStyle={{ color: COLORS.muted, fontSize: 12 }}
              />
              <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard>
        <h3 className="text-lg font-semibold text-white mb-4">Comparison Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <th className="text-left py-3 px-4 font-medium" style={{ color: COLORS.muted }}>Metric</th>
                {roiData.map((r, i) => (
                  <th key={i} className="text-left py-3 px-4 font-medium" style={{ color: r.color }}>
                    {r.name.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td className="py-3 px-4 font-medium text-white">Time Required</td>
                {roiData.map((r, i) => (
                  <td key={i} className="py-3 px-4" style={{ color: r.color }}>{r.hours} hours</td>
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td className="py-3 px-4 font-medium text-white">Cost (@$150/hr)</td>
                {roiData.map((r, i) => (
                  <td key={i} className="py-3 px-4" style={{ color: r.color }}>${r.cost.toLocaleString()}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td className="py-3 px-4 font-medium text-white">Tests Generated</td>
                {roiData.map((r, i) => (
                  <td key={i} className="py-3 px-4" style={{ color: r.color }}>{r.tests}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td className="py-3 px-4 font-medium text-white">Coverage Target Met</td>
                {roiData.map((r, i) => (
                  <td key={i} className="py-3 px-4">
                    <Badge text={r.tests >= 734 ? 'YES' : 'NO'} color={r.tests >= 734 ? COLORS.green : COLORS.red} />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Productivity</td>
                {roiData.map((r, i) => (
                  <td key={i} className="py-3 px-4" style={{ color: r.color }}>
                    {i === 0 ? '1x (baseline)' : i === 1 ? '~40x' : '81x'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {valueProps.map((vp, i) => (
          <SectionCard key={i}>
            <div className="flex items-center gap-2 mb-4">
              {vp.icon}
              <h4 className="text-sm font-bold text-white">{vp.category}</h4>
            </div>
            <div className="space-y-3">
              {vp.metrics.map((m, j) => (
                <div key={j}>
                  <p className="text-sm font-medium text-white">{m.label}</p>
                  <p className="text-xs" style={{ color: COLORS.muted }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>

      <SectionCard>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg" style={{ background: `${COLORS.purple}20` }}>
            <Rocket className="w-6 h-6" style={{ color: COLORS.purple }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">The Path Forward</h3>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.muted }}>
              This case study demonstrates that <strong className="text-white">Devin + structured playbooks</strong> delivers
              enterprise-grade results that scale. The 81x productivity multiplier isn't a one-time event — it's a
              <strong style={{ color: COLORS.green }}> repeatable, scalable capability</strong> that can be applied to any
              repository, in any framework, across the entire organization. With Advanced Devin running sessions in parallel,
              the question isn't whether to invest in AI-powered testing — it's how fast you can deploy it across your portfolio.
            </p>
            <div className="mt-4">
              <a
                href="https://cognition.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-80"
                style={{ background: COLORS.purple }}
              >
                Learn More at Cognition AI <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState<Section>('summary')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderSection = () => {
    switch (activeSection) {
      case 'summary': return <ExecutiveSummary />
      case 'playbook': return <PlaybookApproach />
      case 'heuristics': return <OvercomingHeuristics />
      case 'case-study': return <CaseStudy />
      case 'iterations': return <PRIterations />
      case 'scale': return <MassApplicability />
      case 'roi': return <ROIImpact />
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: COLORS.bg }}>
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}
        style={{ background: COLORS.card, borderRight: `1px solid ${COLORS.border}` }}
      >
        <div className="p-6 flex-shrink-0" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: COLORS.purple }}>BY COGNITION</p>
          <h2 className="text-sm font-bold text-white leading-tight">Unit Test Coverage</h2>
          <p className="text-xs mt-1" style={{ color: COLORS.muted }}>Playbook-Driven AI Demo</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                activeSection === item.id ? 'text-white font-medium' : ''
              }`}
              style={{
                background: activeSection === item.id ? `${COLORS.purple}20` : 'transparent',
                color: activeSection === item.id ? COLORS.text : COLORS.muted,
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 flex-shrink-0" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <p className="text-xs" style={{ color: COLORS.muted }}>Cognition AI Platform</p>
          <p className="text-xs mt-0.5" style={{ color: '#52525b' }}>The world's first AI software engineer</p>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4" style={{ background: `${COLORS.bg}ee`, borderBottom: `1px solid ${COLORS.border}`, backdropFilter: 'blur(8px)' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <BarChart3 className="w-5 h-5" style={{ color: COLORS.muted }} />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-white">
              {NAV_ITEMS.find(n => n.id === activeSection)?.label}
            </h1>
            <Badge text="81x Productivity" color={COLORS.green} />
          </div>
        </header>

        <div className="p-6 lg:p-8 max-w-7xl">
          {renderSection()}
        </div>

        <footer className="px-6 py-4 mt-8" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: COLORS.muted }}>
              Cognition AI Platform — The world's first AI software engineer + agentic IDE
            </p>
            <a
              href="https://cognition.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline"
              style={{ color: COLORS.purple }}
            >
              cognition.ai
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
