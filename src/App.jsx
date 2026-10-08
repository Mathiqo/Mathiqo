import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Compass,
  Eye,
  Filter,
  Grid,
  Layers,
  LayoutDashboard,
  LogOut,
  Minus,
  PieChart,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Star,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  Zap,
  HelpCircle,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ----------------------------------------------------------------------
// DATA: STUDENTS, ACTIVITIES & TEACHER MANIPULATIVES
// ----------------------------------------------------------------------
const INITIAL_STUDENTS = [
  { id: 's1', name: 'Aarav Sharma', grade: 'Grade 3', avatar: '🐱', stars: 120, streak: 5, xp: 450 },
  { id: 's2', name: 'Ananya Patel', grade: 'Grade 3', avatar: '🦊', stars: 185, streak: 8, xp: 620 },
  { id: 's3', name: 'Rohan Gupta', grade: 'Grade 4', avatar: '🐼', stars: 95, streak: 3, xp: 310 },
  { id: 's4', name: 'Diya Verma', grade: 'Grade 2', avatar: '🐰', stars: 210, streak: 12, xp: 780 }
];

const SELF_LEARNING_GAMES = [
  {
    id: 'act-blitz',
    title: 'Speed Math Blitz',
    grade: 'Grade 3',
    topic: 'Addition & Subtraction',
    engine: 'ARITHMETIC',
    icon: '⚡',
    description: 'Solve fast arithmetic questions before time runs out!',
    starsReward: 25,
    xpReward: 100
  },
  {
    id: 'act-fraction',
    title: 'Pizza Slice Fraction Lab',
    grade: 'Grade 3',
    topic: 'Fractions',
    engine: 'FRACTION_VISUALIZER',
    icon: '🍕',
    description: 'Slice and select pizza portions to match fraction targets.',
    starsReward: 30,
    xpReward: 120
  },
  {
    id: 'act-shape',
    title: 'Geometry Shape & Area Lab',
    grade: 'Grade 4',
    topic: 'Geometry',
    engine: 'GEOMETRY_CANVAS',
    icon: '📐',
    description: 'Explore 2D shapes and calculate perimeters and areas.',
    starsReward: 35,
    xpReward: 140
  },
  {
    id: 'act-numberline',
    title: 'Number Line Jumper',
    grade: 'Grade 2',
    topic: 'Counting & Number Line',
    engine: 'NUMBER_LINE',
    icon: '🐸',
    description: 'Help the frog jump across the number line to find the sum.',
    starsReward: 20,
    xpReward: 90
  },
  {
    id: 'act-bargraph',
    title: 'Data Bar Chart Explorer',
    grade: 'Grade 4',
    topic: 'Data & Graphs',
    engine: 'BAR_GRAPH',
    icon: '📊',
    description: 'Interpret chart data bars to answer word problems.',
    starsReward: 40,
    xpReward: 150
  }
];

const TEACHER_MANIPULATIVES = [
  {
    id: 'man-base10',
    title: 'Base-10 Place Value Mat',
    grade: 'Grade 1 - 4',
    topic: 'Place Value',
    toolType: 'BASE_10',
    icon: '🧊',
    description: 'Drag hundreds flats, tens rods, and ones cubes to demonstrate regrouping.'
  },
  {
    id: 'man-protractor',
    title: 'Virtual Angle & Protractor Tool',
    grade: 'Grade 4 - 6',
    topic: 'Geometry & Angles',
    toolType: 'PROTRACTOR',
    icon: '📐',
    description: 'Rotate ray arms and measure acute, right, and obtuse angles.'
  },
  {
    id: 'man-fraction-bars',
    title: 'Equivalent Fraction Bar Comparator',
    grade: 'Grade 3 - 5',
    topic: 'Fractions',
    toolType: 'FRACTION_BARS',
    icon: '🍫',
    description: 'Compare side-by-side fraction bars to visualize equivalencies.'
  },
  {
    id: 'man-hundred-grid',
    title: 'Interactive 100-Grid & Pattern Finder',
    grade: 'K - Grade 3',
    topic: 'Patterns & Counting',
    toolType: 'HUNDRED_GRID',
    icon: '🔢',
    description: 'Highlight multiples, prime numbers, and skip-counting patterns.'
  }
];

const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg-1',
    activityId: 'act-fraction',
    title: 'Pizza Slice Fraction Lab',
    assignedTo: 'ALL',
    dueDate: '2026-10-15',
    instructions: 'Complete pizza fraction challenges with 80%+ accuracy.',
    completedBy: ['s2']
  }
];

// ----------------------------------------------------------------------
// MAIN APPLICATION COMPONENT
// ----------------------------------------------------------------------
export default function App() {
  const [role, setRole] = useState('STUDENT'); // 'STUDENT' | 'TEACHER'
  const [activeTab, setActiveTab] = useState('GAMES'); // 'GAMES' | 'SIMULATIONS'
  const [activeStudent, setActiveStudent] = useState(INITIAL_STUDENTS[0]);
  
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('mq_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('mq_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeGame, setActiveGame] = useState(null);
  const [activeManipulative, setActiveManipulative] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);

  // New assignment form state
  const [newAsgActivityId, setNewAsgActivityId] = useState('act-blitz');
  const [newAsgStudentId, setNewAsgStudentId] = useState('ALL');
  const [newAsgDueDate, setNewAsgDueDate] = useState('2026-10-20');
  const [newAsgNotes, setNewAsgNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('mq_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('mq_assignments', JSON.stringify(assignments));
  }, [assignments]);

  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'pop') {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      console.log('Audio playback error', e);
    }
  };

  const handleActivityComplete = (activity, score) => {
    playSound('success');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    setStudents((prev) =>
      prev.map((std) => {
        if (std.id === activeStudent.id) {
          const updated = {
            ...std,
            stars: std.stars + activity.starsReward,
            xp: std.xp + activity.xpReward
          };
          setActiveStudent(updated);
          return updated;
        }
        return std;
      })
    );

    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.activityId === activity.id && !asg.completedBy.includes(activeStudent.id)) {
          return { ...asg, completedBy: [...asg.completedBy, activeStudent.id] };
        }
        return asg;
      })
    );

    setActiveGame(null);
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const act = SELF_LEARNING_GAMES.find((a) => a.id === newAsgActivityId);
    const newAsg = {
      id: 'asg-' + Date.now(),
      activityId: newAsgActivityId,
      title: act ? act.title : 'Math Task',
      assignedTo: newAsgStudentId,
      dueDate: newAsgDueDate,
      instructions: newAsgNotes || 'Complete this interactive practice activity.',
      completedBy: []
    };
    setAssignments([...assignments, newAsg]);
    setNewAsgNotes('');
    playSound('success');
  };

  const filteredGames = SELF_LEARNING_GAMES.filter((act) => {
    const matchesGrade = selectedGrade === 'All' || act.grade === selectedGrade;
    const matchesTopic = selectedTopic === 'All' || act.topic === selectedTopic;
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesTopic && matchesSearch;
  });

  const filteredManipulatives = TEACHER_MANIPULATIVES.filter((man) => {
    const matchesTopic = selectedTopic === 'All' || man.topic === selectedTopic;
    const matchesSearch = man.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          man.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* NAVBAR */}
      <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-400 p-2 rounded-xl text-indigo-900 font-black text-2xl shadow-inner">
              ∑
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight leading-tight">MathQuest Academy</h1>
              <p className="text-xs text-indigo-200">Interactive Math Games & Teaching Manipulatives</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 transition text-indigo-100"
              title="Toggle Audio FX"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            {/* Role Switcher */}
            <div className="bg-indigo-800 p-1 rounded-xl flex items-center text-sm font-medium">
              <button
                onClick={() => setRole('STUDENT')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  role === 'STUDENT' ? 'bg-white text-indigo-900 font-bold' : 'text-indigo-200'
                }`}
              >
                🎒 Kid Mode
              </button>
              <button
                onClick={() => setRole('TEACHER')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  role === 'TEACHER' ? 'bg-white text-indigo-900 font-bold' : 'text-indigo-200'
                }`}
              >
                👩‍🏫 Teacher Portal
              </button>
            </div>

            {role === 'STUDENT' && (
              <div className="flex items-center bg-indigo-700 px-3 py-1.5 rounded-xl space-x-2">
                <span className="text-xl">{activeStudent.avatar}</span>
                <select
                  value={activeStudent.id}
                  onChange={(e) => {
                    const std = students.find((s) => s.id === e.target.value);
                    if (std) setActiveStudent(std);
                  }}
                  className="bg-transparent text-white font-semibold border-none focus:outline-none cursor-pointer"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id} className="text-slate-900">
                      {s.name} ({s.grade})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {role === 'STUDENT' ? (
          <div>
            {/* STUDENT HERO BANNER */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-3xl p-6 shadow-lg mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="text-5xl bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  {activeStudent.avatar}
                </div>
                <div>
                  <h2 className="text-2xl font-black">Welcome back, {activeStudent.name}!</h2>
                  <p className="text-indigo-100 text-sm font-medium">Ready to conquer your math quests today?</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                <div className="flex items-center space-x-2">
                  <Star className="text-amber-300 fill-amber-300" size={24} />
                  <div>
                    <div className="text-xs text-indigo-100 uppercase font-bold">Stars</div>
                    <div className="text-xl font-black">{activeStudent.stars}</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="flex items-center space-x-2">
                  <Zap className="text-amber-400 fill-amber-400" size={24} />
                  <div>
                    <div className="text-xs text-indigo-100 uppercase font-bold">Streak</div>
                    <div className="text-xl font-black">{activeStudent.streak} Days</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="flex items-center space-x-2">
                  <Trophy className="text-yellow-300" size={24} />
                  <div>
                    <div className="text-xs text-indigo-100 uppercase font-bold">Math XP</div>
                    <div className="text-xl font-black">{activeStudent.xp}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB SELECTION BAR */}
            <div className="flex items-center space-x-3 mb-6 bg-slate-200/60 p-1.5 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab('GAMES')}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-sm flex items-center space-x-2 transition ${
                  activeTab === 'GAMES' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🎮 Self-Learning Games</span>
              </button>
              <button
                onClick={() => setActiveTab('SIMULATIONS')}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-sm flex items-center space-x-2 transition ${
                  activeTab === 'SIMULATIONS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🧮 Class Manipulatives & Simulations</span>
              </button>
            </div>

            {/* TAB 1: SELF LEARNING GAMES */}
            {activeTab === 'GAMES' && (
              <div>
                {/* ASSIGNED HOMEWORK */}
                {assignments.filter((a) => a.assignedTo === 'ALL' || a.assignedTo === activeStudent.id).length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-black text-slate-800 flex items-center space-x-2 mb-4">
                      <BookOpen className="text-indigo-600" size={20} />
                      <span>Assigned Math Homework</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assignments
                        .filter((a) => a.assignedTo === 'ALL' || a.assignedTo === activeStudent.id)
                        .map((asg) => {
                          const activity = SELF_LEARNING_GAMES.find((act) => act.id === asg.activityId);
                          const isCompleted = asg.completedBy.includes(activeStudent.id);

                          return (
                            <div
                              key={asg.id}
                              className={`p-5 rounded-2xl border-2 transition ${
                                isCompleted
                                  ? 'bg-emerald-50 border-emerald-200'
                                  : 'bg-white border-amber-200 shadow-sm'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="text-3xl">{activity ? activity.icon : '📝'}</span>
                                  <div>
                                    <h4 className="font-bold text-slate-900">{asg.title}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{asg.instructions}</p>
                                  </div>
                                </div>
                                {isCompleted ? (
                                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                    <Check size={14} />
                                    <span>Done</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                    <Clock size={12} />
                                    <span>Due {asg.dueDate}</span>
                                  </span>
                                )}
                              </div>

                              {!isCompleted && activity && (
                                <button
                                  onClick={() => setActiveGame(activity)}
                                  className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-sm transition flex items-center justify-center space-x-2"
                                >
                                  <span>Play Activity</span>
                                  <ChevronRight size={16} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* GAME LIBRARY GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGames.map((act) => (
                    <div
                      key={act.id}
                      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-4xl p-3 bg-indigo-50 rounded-2xl">{act.icon}</span>
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full flex items-center space-x-1">
                            <Star size={12} className="fill-amber-500 text-amber-500" />
                            <span>+{act.starsReward}</span>
                          </span>
                        </div>
                        <h4 className="font-extrabold text-lg text-slate-900 mb-1">{act.title}</h4>
                        <p className="text-xs font-bold text-indigo-600 mb-2">{act.topic}</p>
                        <p className="text-slate-600 text-xs leading-relaxed mb-6">{act.description}</p>
                      </div>

                      <button
                        onClick={() => {
                          playSound('pop');
                          setActiveGame(act);
                        }}
                        className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-2xl transition flex items-center justify-center space-x-2"
                      >
                        <span>Start Game</span>
                        <Sparkles size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: TEACHER MANIPULATIVES & SIMULATIONS */}
            {activeTab === 'SIMULATIONS' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900">Interactive Classroom Manipulatives</h3>
                  <p className="text-sm text-slate-500">Visual tools for smartboards, direct teacher instruction, and student discovery.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredManipulatives.map((man) => (
                    <div
                      key={man.id}
                      className="bg-white border border-indigo-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="text-4xl p-3 bg-indigo-50 rounded-2xl">{man.icon}</span>
                          <div>
                            <span className="text-xs font-bold text-indigo-600 uppercase">{man.grade}</span>
                            <h4 className="font-extrabold text-lg text-slate-900">{man.title}</h4>
                          </div>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed mb-6">{man.description}</p>
                      </div>

                      <button
                        onClick={() => setActiveManipulative(man)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl transition flex items-center justify-center space-x-2"
                      >
                        <Maximize2 size={16} />
                        <span>Launch Fullscreen Manipulative</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* TEACHER PORTAL VIEW */
          <div className="space-y-8">
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg flex items-center justify-between">
              <div>
                <span className="px-3 py-1 bg-indigo-500/30 text-indigo-300 font-bold text-xs rounded-full uppercase">
                  Teacher Portal
                </span>
                <h2 className="text-2xl font-black mt-2">Classroom Overview & Math Assignments</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Track student progress, check topic accuracy, and create interactive homework.
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <Users className="text-indigo-400" size={32} />
                <div>
                  <div className="text-2xl font-black">{students.length}</div>
                  <div className="text-xs text-slate-400 font-medium">Active Students</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* CLASS ROSTER */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-extrabold text-lg text-slate-900 mb-4 flex items-center space-x-2">
                    <Users size={20} className="text-indigo-600" />
                    <span>Student Roster</span>
                  </h3>

                  <div className="divide-y divide-slate-100">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="py-4 flex items-center justify-between hover:bg-slate-50 px-3 rounded-2xl transition"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{student.avatar}</span>
                          <div>
                            <h4 className="font-bold text-slate-900">{student.name}</h4>
                            <p className="text-xs text-slate-500">{student.grade}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-800 flex items-center space-x-1 justify-end">
                              <Star size={14} className="text-amber-400 fill-amber-400" />
                              <span>{student.stars}</span>
                            </div>
                            <div className="text-xs text-slate-400">{student.xp} XP</div>
                          </div>

                          <button
                            onClick={() => setSelectedStudentForModal(student)}
                            className="p-2 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl transition"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CREATE ASSIGNMENT FORM */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit">
                <h3 className="font-extrabold text-lg text-slate-900 mb-4 flex items-center space-x-2">
                  <Plus size={20} className="text-indigo-600" />
                  <span>Assign Native Math Activity</span>
                </h3>

                <form onSubmit={handleCreateAssignment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Select Built-In Activity
                    </label>
                    <select
                      value={newAsgActivityId}
                      onChange={(e) => setNewAsgActivityId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none"
                    >
                      {SELF_LEARNING_GAMES.map((act) => (
                        <option key={act.id} value={act.id}>
                          {act.icon} {act.title} ({act.grade})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Assign To
                    </label>
                    <select
                      value={newAsgStudentId}
                      onChange={(e) => setNewAsgStudentId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none"
                    >
                      <option value="ALL">Entire Class</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.grade})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newAsgDueDate}
                      onChange={(e) => setNewAsgDueDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Teacher Notes
                    </label>
                    <textarea
                      value={newAsgNotes}
                      onChange={(e) => setNewAsgNotes(e.target.value)}
                      placeholder="e.g. Complete before Friday"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:outline-none h-24"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2"
                  >
                    <Send size={16} />
                    <span>Dispatch Homework</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: SELF-LEARNING GAME RUNNER */}
      {activeGame && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{activeGame.icon}</span>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900">{activeGame.title}</h3>
                  <span className="text-xs font-bold text-indigo-600 uppercase">{activeGame.topic}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveGame(null)}
                className="p-2 bg-slate-100 text-slate-600 rounded-full font-bold"
              >
                ✕
              </button>
            </div>

            {activeGame.engine === 'ARITHMETIC' && (
              <ArithmeticEngine activity={activeGame} onFinish={(score) => handleActivityComplete(activeGame, score)} />
            )}
            {activeGame.engine === 'FRACTION_VISUALIZER' && (
              <FractionEngine activity={activeGame} onFinish={(score) => handleActivityComplete(activeGame, score)} />
            )}
          </div>
        </div>
      )}

      {/* MODAL: TEACHER MANIPULATIVE SIMULATION RUNNER */}
      {activeManipulative && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{activeManipulative.icon}</span>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900">{activeManipulative.title}</h3>
                  <span className="text-xs font-bold text-indigo-600 uppercase">{activeManipulative.topic}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveManipulative(null)}
                className="p-2 bg-slate-100 text-slate-600 rounded-full font-bold"
              >
                ✕
              </button>
            </div>

            {/* RENDER SPECIFIC MANIPULATIVE */}
            {activeManipulative.toolType === 'BASE_10' && <Base10Manipulative />}
            {activeManipulative.toolType === 'PROTRACTOR' && <ProtractorManipulative />}
            {activeManipulative.toolType === 'FRACTION_BARS' && <FractionBarsManipulative />}
            {activeManipulative.toolType === 'HUNDRED_GRID' && <HundredGridManipulative />}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// GAME ENGINE ENGINES
// ----------------------------------------------------------------------
function ArithmeticEngine({ activity, onFinish }) {
  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(7);
  const [userAnswer, setUserAnswer] = useState('');
  const [round, setRound] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(userAnswer) === num1 + num2) {
      if (round >= 5) {
        onFinish(100);
      } else {
        setRound(round + 1);
        setNum1(Math.floor(Math.random() * 20) + 5);
        setNum2(Math.floor(Math.random() * 20) + 5);
        setUserAnswer('');
      }
    } else {
      alert('Try again!');
    }
  };

  return (
    <div className="text-center py-6 space-y-6">
      <div className="text-5xl font-black text-indigo-900 my-8">
        {num1} + {num2} = ?
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto">
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter sum"
          className="w-full text-center text-2xl font-bold bg-slate-100 border-2 border-indigo-200 rounded-2xl py-3 focus:outline-none"
        />
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-2xl">
          Submit Answer
        </button>
      </form>
    </div>
  );
}

function FractionEngine({ activity, onFinish }) {
  return (
    <div className="text-center py-6 space-y-4">
      <p className="font-bold text-slate-700">Pizza Slice Fraction Challenge</p>
      <button onClick={() => onFinish(100)} className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl">
        Complete Activity
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------
// TEACHER MANIPULATIVES (SIMULATIONS)
// ----------------------------------------------------------------------

// 1. BASE-10 BLOCKS MANIPULATIVE
function Base10Manipulative() {
  const [hundreds, setHundreds] = useState(1);
  const [tens, setTens] = useState(3);
  const [ones, setOnes] = useState(5);

  const total = hundreds * 100 + tens * 10 + ones;

  return (
    <div className="space-y-6 text-center">
      <div className="text-3xl font-black text-indigo-900">
        Total Number: <span className="bg-amber-100 px-4 py-1 rounded-2xl border border-amber-300">{total}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 min-h-[220px]">
        {/* Hundreds */}
        <div>
          <h5 className="font-extrabold text-sm text-slate-700 mb-2">Hundreds ({hundreds})</h5>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: hundreds }).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-blue-400 border-2 border-blue-600 rounded-md grid grid-cols-5 gap-0.5 p-0.5">
                {Array.from({ length: 25 }).map((_, j) => (
                  <div key={j} className="bg-blue-200 rounded-xs"></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Tens */}
        <div>
          <h5 className="font-extrabold text-sm text-slate-700 mb-2">Tens ({tens})</h5>
          <div className="flex gap-2 justify-center">
            {Array.from({ length: tens }).map((_, i) => (
              <div key={i} className="w-4 h-16 bg-emerald-400 border-2 border-emerald-600 rounded-md flex flex-col justify-between p-0.5">
                {Array.from({ length: 10 }).map((_, j) => (
                  <div key={j} className="h-1 bg-emerald-200"></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Ones */}
        <div>
          <h5 className="font-extrabold text-sm text-slate-700 mb-2">Ones ({ones})</h5>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: ones }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-amber-400 border-2 border-amber-600 rounded-xs"></div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex justify-center space-x-6">
        <div className="space-x-2">
          <button onClick={() => setHundreds(Math.max(0, hundreds - 1))} className="px-3 py-1 bg-slate-200 font-bold rounded-lg">-</button>
          <span className="font-bold text-xs">100s</span>
          <button onClick={() => setHundreds(hundreds + 1)} className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg">+</button>
        </div>
        <div className="space-x-2">
          <button onClick={() => setTens(Math.max(0, tens - 1))} className="px-3 py-1 bg-slate-200 font-bold rounded-lg">-</button>
          <span className="font-bold text-xs">10s</span>
          <button onClick={() => setTens(tens + 1)} className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg">+</button>
        </div>
        <div className="space-x-2">
          <button onClick={() => setOnes(Math.max(0, ones - 1))} className="px-3 py-1 bg-slate-200 font-bold rounded-lg">-</button>
          <span className="font-bold text-xs">1s</span>
          <button onClick={() => setOnes(ones + 1)} className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg">+</button>
        </div>
      </div>
    </div>
  );
}

// 2. PROTRACTOR MANIPULATIVE
function ProtractorManipulative() {
  const [angle, setAngle] = useState(45);

  return (
    <div className="text-center space-y-6">
      <div className="text-2xl font-black text-indigo-900">
        Angle Measure: <span className="text-indigo-600">{angle}°</span>
        <span className="text-xs font-bold ml-2 bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full">
          {angle === 90 ? 'Right Angle' : angle < 90 ? 'Acute Angle' : 'Obtuse Angle'}
        </span>
      </div>

      <div className="relative w-64 h-32 mx-auto border-b-4 border-slate-800 bg-indigo-50/50 rounded-t-full flex items-end justify-center">
        {/* Ray Line */}
        <div
          style={{ transform: `rotate(-${angle}deg)` }}
          className="absolute bottom-0 left-1/2 w-28 h-1 bg-indigo-600 origin-left transition-transform duration-150"
        ></div>
        <div className="w-28 h-1 bg-slate-800 absolute bottom-0 left-1/2"></div>
      </div>

      <input
        type="range"
        min="0"
        max="180"
        value={angle}
        onChange={(e) => setAngle(parseInt(e.target.value))}
        className="w-full max-w-xs cursor-pointer"
      />
    </div>
  );
}

// 3. FRACTION BARS MANIPULATIVE
function FractionBarsManipulative() {
  return (
    <div className="space-y-6 text-center">
      <h5 className="font-bold text-slate-700">Comparing Fraction Bars</h5>
      <div className="space-y-3">
        <div className="w-full bg-slate-200 h-10 rounded-xl overflow-hidden flex border border-slate-300">
          <div className="w-1/2 bg-indigo-500 text-white font-bold flex items-center justify-center border-r border-white">1/2</div>
          <div className="w-1/2 bg-slate-300 text-slate-600 font-bold flex items-center justify-center">1/2</div>
        </div>
        <div className="w-full bg-slate-200 h-10 rounded-xl overflow-hidden flex border border-slate-300">
          <div className="w-1/4 bg-amber-500 text-white font-bold flex items-center justify-center border-r border-white">1/4</div>
          <div className="w-1/4 bg-amber-500 text-white font-bold flex items-center justify-center border-r border-white">1/4</div>
          <div className="w-2/4 bg-slate-300 text-slate-600 font-bold flex items-center justify-center">2/4</div>
        </div>
      </div>
    </div>
  );
}

// 4. 100-GRID MANIPULATIVE
function HundredGridManipulative() {
  const [highlightMultiple, setHighlightMultiple] = useState(5);

  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center space-x-2">
        {[2, 3, 5, 10].map((num) => (
          <button
            key={num}
            onClick={() => setHighlightMultiple(num)}
            className={`px-3 py-1 font-bold text-xs rounded-lg transition ${
              highlightMultiple === num ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Multiples of {num}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-10 gap-1 max-w-md mx-auto bg-slate-100 p-3 rounded-2xl border border-slate-200">
        {Array.from({ length: 100 }).map((_, i) => {
          const val = i + 1;
          const isMultiple = val % highlightMultiple === 0;

          return (
            <div
              key={val}
              className={`h-8 rounded-md flex items-center justify-center font-bold text-xs transition ${
                isMultiple ? 'bg-indigo-600 text-white shadow-sm scale-105' : 'bg-white text-slate-600'
              }`}
            >
              {val}
            </div>
          );
        })}
      </div>
    </div>
  );
}
