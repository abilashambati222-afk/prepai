import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  XCircle,
  Loader,
  Copy,
  Download,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  FileText,
  Terminal,
  Cpu,
  BookmarkMinus
} from 'lucide-react';
import api from '../lib/api';

export default function CodingProblemDetails() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [note, setNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Editor states
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [activeLeftTab, setActiveLeftTab] = useState('description'); // 'description' | 'notes'
  
  // Console execution states
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState('run'); // 'run' | 'submit'

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const res = await api.get(`/coding/problems/${slug}`);
        const data = res.data.data;
        setProblem(data.problem);
        setIsBookmarked(data.isBookmarked);
        setNote(data.note || '');
        
        // Find default javascript starter code
        const jsStarter = data.problem.starterCode.find(c => c.language === 'javascript');
        if (jsStarter) {
          setCode(jsStarter.code);
        } else if (data.problem.starterCode.length > 0) {
          setCode(data.problem.starterCode[0].code);
          setLanguage(data.problem.starterCode[0].language);
        }
      } catch (err) {
        console.error('Failed to load problem details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblemDetails();
  }, [slug]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const starter = problem?.starterCode.find(c => c.language === newLang);
    if (starter) {
      setCode(starter.code);
    }
  };

  const handleToggleBookmark = async () => {
    try {
      if (isBookmarked) {
        await api.delete(`/coding/bookmark/${problem._id}`);
      } else {
        await api.post('/coding/bookmark', { problemId: problem._id });
      }
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNote(true);
      await api.post('/coding/notes', {
        problemId: problem._id,
        content: note
      });
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setRunResult(null);
      setActiveConsoleTab('run');
      const res = await api.post('/coding/run', {
        problemId: problem._id,
        language,
        code
      });
      setRunResult(res.data.data);
    } catch (err) {
      console.error('Failed to run code:', err);
      setRunResult({
        stdout: '',
        stderr: err.response?.data?.error || 'Execution failed. Please check code syntax.',
        verdict: 'Compilation Error',
        executionTime: 0,
        memory: 0
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    try {
      setIsSubmitting(true);
      setSubmitResult(null);
      setActiveConsoleTab('submit');
      const res = await api.post('/coding/submit', {
        problemId: problem._id,
        language,
        code
      });
      setSubmitResult(res.data.data);
    } catch (err) {
      console.error('Failed to submit code:', err);
      setSubmitResult({
        allPassed: false,
        failedTestCase: {
          input: 'Global evaluation error',
          expected: 'Success output',
          actual: err.response?.data?.error || 'Execution error.',
          verdict: 'Runtime Error'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleResetCode = () => {
    const starter = problem?.starterCode.find(c => c.language === language);
    if (starter) {
      setCode(starter.code);
    }
  };

  const handleDownloadCode = () => {
    const extensions = { javascript: 'js', python: 'py', java: 'java', cpp: 'cpp', c: 'c' };
    const ext = extensions[language] || 'txt';
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${slug}.${ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="glass-panel p-8 text-center rounded-2xl">
        <p className="text-sm text-slate-400">Problem not found. Return to the problem catalog.</p>
        <Link to="/coding-practice" className="text-xs text-brand-primary font-bold hover:underline mt-4 inline-block">
          Return
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-[calc(100vh-80px)] space-y-4">
      {/* Top action header bar */}
      <div className="flex items-center justify-between border-b border-brand-border/40 pb-3 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/coding-practice/problems" className="p-2 rounded-xl bg-slate-800 border border-brand-border text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              {problem.title}
              <span className={`text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-md uppercase ${
                problem.difficulty === 'Easy' ? 'bg-brand-success/15 text-brand-success' :
                problem.difficulty === 'Medium' ? 'bg-brand-warning/15 text-brand-warning' :
                'bg-brand-danger/15 text-brand-danger'
              }`}>
                {problem.difficulty}
              </span>
            </h1>
            <p className="text-xs text-slate-400">Category: {problem.category}</p>
          </div>
        </div>

        <button
          onClick={handleToggleBookmark}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            isBookmarked ? 'bg-brand-warning/10 border-brand-warning/30 text-brand-warning' : 'bg-slate-800 border-brand-border text-slate-400 hover:text-white'
          }`}
        >
          {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>

      {/* Main Workspace Splitter Pane */}
      <div className="flex flex-col lg:flex-row gap-4 h-full min-h-0">
        {/* Left Hand side description and notes panel */}
        <div className="w-full lg:w-1/2 flex flex-col glass-panel rounded-2xl overflow-hidden min-h-0 border border-brand-border/60">
          <div className="flex bg-slate-900/60 border-b border-brand-border/60 shrink-0">
            <button
              onClick={() => setActiveLeftTab('description')}
              className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold transition-all border-b-2 ${
                activeLeftTab === 'description' ? 'border-brand-primary text-brand-primary bg-brand-primary/5' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              Description
            </button>
            <button
              onClick={() => setActiveLeftTab('notes')}
              className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold transition-all border-b-2 ${
                activeLeftTab === 'notes' ? 'border-brand-primary text-brand-primary bg-brand-primary/5' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Personal Notes
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-6 text-sm text-slate-300 leading-relaxed">
            {activeLeftTab === 'description' ? (
              <>
                {/* Description Body */}
                <div className="whitespace-pre-line bg-slate-900/40 p-4 rounded-xl border border-brand-border/40 text-slate-200">
                  {problem.description}
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <h3 className="font-bold text-white uppercase tracking-wider text-xs">Examples</h3>
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-brand-border/60 space-y-2 font-mono text-xs">
                      <div>
                        <span className="text-brand-secondary font-bold">Input: </span>
                        <span className="text-slate-300">{example.input}</span>
                      </div>
                      <div>
                        <span className="text-brand-primary font-bold">Output: </span>
                        <span className="text-slate-300">{example.output}</span>
                      </div>
                      {example.explanation && (
                        <div className="text-slate-400 mt-2 font-sans italic">
                          <span className="font-bold font-sans not-italic text-white">Explanation: </span>
                          {example.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                {problem.constraints?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">Constraints</h3>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 font-mono">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {problem.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-800 border border-brand-border px-2 py-0.5 rounded-md text-slate-400">
                      {tag}
                    </span>
                  ))}
                  {problem.companyTags.map((company, idx) => (
                    <span key={idx} className="text-[10px] bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded-md text-brand-primary font-semibold">
                      {company}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col h-full space-y-4">
                <div className="flex justify-between items-center shrink-0">
                  <span className="text-xs text-slate-400">Write Markdown personal notes and comments for this problem.</span>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNote}
                    className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-xs font-bold text-white rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    {savingNote ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Save Notes
                  </button>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Type your notes here..."
                  className="flex-1 w-full p-4 bg-slate-900 border border-brand-border focus:border-brand-primary focus:outline-none rounded-xl text-slate-200 text-xs font-mono resize-none min-h-[200px]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Hand side compiler and console output panel */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-0 space-y-4">
          {/* Monaco compiler layout window */}
          <div className="flex-1 min-h-0 flex flex-col glass-panel rounded-2xl overflow-hidden border border-brand-border/60">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-brand-border/60 shrink-0">
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-slate-850 border border-brand-border focus:outline-none focus:border-brand-primary text-slate-200"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                </select>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="px-3 py-1.5 text-xs rounded-xl bg-slate-850 border border-brand-border focus:outline-none focus:border-brand-primary text-slate-200"
                >
                  <option value="12">12px</option>
                  <option value="14">14px</option>
                  <option value="16">16px</option>
                  <option value="18">18px</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={handleCopyCode} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all" title="Copy Code">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={handleResetCode} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all" title="Reset Code">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button onClick={handleDownloadCode} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all" title="Download Code">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editor Canvas */}
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : language === 'python' ? 'python' : language}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  fontSize,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  scrollbar: { vertical: 'auto', horizontal: 'auto' },
                  tabSize: 4
                }}
              />
            </div>

            {/* Run Actions panel footer */}
            <div className="px-4 py-3 bg-slate-900 border-t border-brand-border/60 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">Ctrl+Enter to Run</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="px-4 py-2 border border-brand-border bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-bold text-white rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  {isRunning ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  Run Code
                </button>
                <button
                  onClick={handleSubmitCode}
                  disabled={isRunning || isSubmitting}
                  className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/95 disabled:opacity-50 text-xs font-bold text-white rounded-xl transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Submit Code
                </button>
              </div>
            </div>
          </div>

          {/* Console output display tab panel */}
          <div className="h-48 glass-panel rounded-2xl overflow-hidden border border-brand-border/60 flex flex-col shrink-0">
            <div className="flex bg-slate-900/60 border-b border-brand-border/60 shrink-0">
              <button
                onClick={() => setActiveConsoleTab('run')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
                  activeConsoleTab === 'run' ? 'border-brand-primary text-brand-primary bg-brand-primary/5' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Run Output
              </button>
              <button
                onClick={() => setActiveConsoleTab('submit')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
                  activeConsoleTab === 'submit' ? 'border-brand-primary text-brand-primary bg-brand-primary/5' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Submit Outcome
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 min-h-0 select-text">
              {activeConsoleTab === 'run' ? (
                isRunning ? (
                  <div className="flex items-center gap-2 text-slate-450 h-full justify-center">
                    <Loader className="w-4 h-4 text-brand-primary animate-spin" />
                    Executing code against sample input...
                  </div>
                ) : runResult ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-450">Verdict:</span>
                      <span className={`font-bold ${runResult.verdict === 'Accepted' ? 'text-brand-success' : 'text-brand-danger'}`}>
                        {runResult.verdict}
                      </span>
                    </div>
                    {runResult.stdout && (
                      <div>
                        <div className="text-slate-450 font-sans">Stdout:</div>
                        <pre className="p-2 rounded bg-slate-900 border border-brand-border/40 mt-1 whitespace-pre-wrap">{runResult.stdout}</pre>
                      </div>
                    )}
                    {runResult.stderr && (
                      <div>
                        <div className="text-brand-danger font-sans">Error Output:</div>
                        <pre className="p-2 rounded bg-brand-danger/5 border border-brand-danger/20 text-brand-danger mt-1 whitespace-pre-wrap">{runResult.stderr}</pre>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-slate-500 pt-2 border-t border-brand-border/20 text-[10px]">
                      <span>Time: {runResult.executionTime} ms</span>
                      <span>Memory: {runResult.memory} KB</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 text-center h-full flex items-center justify-center">Click Run Code to compile solution.</div>
                )
              ) : (
                isSubmitting ? (
                  <div className="flex items-center gap-2 text-slate-450 h-full justify-center">
                    <Loader className="w-4 h-4 text-brand-primary animate-spin" />
                    Submitting solution and evaluating all test cases...
                  </div>
                ) : submitResult ? (
                  submitResult.allPassed ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-2 text-brand-success">
                      <CheckCircle2 className="w-10 h-10" />
                      <span className="font-bold text-sm">All Test Cases Passed Successfully!</span>
                      <span className="text-xs text-slate-400">Your solution is correct and progress is updated.</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-brand-danger font-bold text-sm">
                        <XCircle className="w-5 h-5" />
                        Compilation / Evaluation Failed
                      </div>
                      {submitResult.failedTestCase && (
                        <div className="space-y-2 p-3 rounded-xl bg-slate-900 border border-brand-border/45">
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <span className="text-slate-450">Input:</span>
                              <pre className="p-1 rounded bg-slate-950 mt-1 whitespace-pre-wrap">{submitResult.failedTestCase.input}</pre>
                            </div>
                            <div>
                              <span className="text-slate-450">Expected:</span>
                              <pre className="p-1 rounded bg-slate-955 mt-1 text-brand-success whitespace-pre-wrap">{submitResult.failedTestCase.expected}</pre>
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-450 text-[10px]">Actual Output / Error:</span>
                            <pre className="p-1.5 rounded bg-slate-950 text-brand-danger mt-1 whitespace-pre-wrap text-[10px]">
                              {submitResult.failedTestCase.actual}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="text-slate-500 text-center h-full flex items-center justify-center">Click Submit Code to run against hidden test cases.</div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
