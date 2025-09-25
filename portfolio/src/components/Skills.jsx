import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

// Default fallback data
const defaultCore = [
  { name: 'React.js', level: 85, icon: '⚛️', color: 'from-blue-500 to-cyan-500', category: 'Frontend' },
  { name: 'JavaScript', level: 90, icon: '🟨', color: 'from-yellow-400 to-orange-500', category: 'Language' },
  { name: 'Python', level: 80, icon: '🐍', color: 'from-green-500 to-emerald-500', category: 'Backend' },
  { name: 'HTML/CSS', level: 95, icon: '🎨', color: 'from-pink-500 to-rose-500', category: 'Styling' },
  { name: 'Bootstrap', level: 85, icon: '💜', color: 'from-purple-500 to-violet-500', category: 'Framework' },
  { name: 'Node.js', level: 70, icon: '🟢', color: 'from-green-600 to-green-400', category: 'Runtime' },
]

const defaultTools = [
  { name: 'Express', icon: '🚀', color: 'from-gray-600 to-gray-800' },
  { name: 'SQLite', icon: '🗄️', color: 'from-blue-600 to-blue-800' },
  { name: 'Git', icon: '📦', color: 'from-orange-600 to-red-600' },
  { name: 'REST API', icon: '🔗', color: 'from-indigo-600 to-purple-600' },
  { name: 'Local Storage', icon: '💾', color: 'from-green-600 to-teal-600' },
  { name: 'AI/ML', icon: '🤖', color: 'from-purple-600 to-pink-600' }
]

const defaultCategories = [
  { name: 'Frontend Development', skills: ['React.js', 'HTML/CSS', 'Bootstrap'], color: 'from-blue-500 to-cyan-500' },
  { name: 'Backend Development', skills: ['Python', 'Node.js', 'Express'], color: 'from-green-500 to-emerald-500' },
  { name: 'Tools & Technologies', skills: ['Git', 'SQLite', 'REST API'], color: 'from-purple-500 to-pink-500' }
]

 function SkillBar({ level, color, name, showHeader = false }) {
  return (
    <div className="relative">
      {showHeader && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">{name}</span>
          <span className="text-sm font-bold text-gray-800">{level}%</span>
        </div>
      )}
      <div className="relative h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out shadow-lg`}
          style={{ width: `${level}%` }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch('/api/skills');
      console.log('Fetched skills data:', data);
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
      setError('Failed to load skills. Using default data.');
      // Use default data as fallback
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  // Process skills data for display
  const processSkillsData = () => {
    // Ensure skills is always an array
    const skillsArray = Array.isArray(skills) ? skills : [];
    
    if (skillsArray.length === 0) {
      console.log('No skills data, using default fallback');
      return {
        core: defaultCore,
        tools: defaultTools,
        categories: defaultCategories
      };
    }

    console.log('Processing skills data:', skillsArray);

    // Separate skills by category and level - prioritize featured skills for core
    const coreSkills = skillsArray.filter(skill => {
      // Normalize category for comparison
      const normalizedCategory = skill.category || 'Technical';
      const normalizedLevel = skill.level || 'Intermediate';
      
      return skill.isFeatured || 
        normalizedCategory === 'Technical' || 
        normalizedCategory === 'Programming Languages' || 
        normalizedCategory === 'Frameworks' ||
        normalizedLevel === 'Advanced' || 
        normalizedLevel === 'Expert';
    }).map(skill => ({
      name: skill.name || 'Unknown Skill',
      level: getLevelPercentage(skill.level),
      icon: skill.icon || getDefaultIcon(skill.name),
      color: getSkillColor(skill.category, skill.name),
      category: skill.category || 'Technical'
    }));

    const toolSkills = skillsArray.filter(skill => {
      const normalizedCategory = skill.category || 'Technical';
      const normalizedLevel = skill.level || 'Intermediate';
      
      return !skill.isFeatured && (
        normalizedCategory === 'Tools' || 
        normalizedCategory === 'Certifications' ||
        normalizedLevel === 'Beginner' || 
        normalizedLevel === 'Intermediate'
      );
    }).map(skill => ({
      name: skill.name || 'Unknown Skill',
      icon: skill.icon || getDefaultIcon(skill.name),
      color: getSkillColor(skill.category, skill.name)
    }));

    // Group skills by category for the categories section
    const categoryMap = {};
    skillsArray.forEach(skill => {
      const category = skill.category || 'Technical';
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(skill.name || 'Unknown Skill');
    });

    const categories = Object.entries(categoryMap).map(([category, skillNames]) => ({
      name: category,
      skills: skillNames.slice(0, 3), // Limit to 3 skills per category
      color: getCategoryColor(category)
    }));

    console.log('Processed skills:', { core: coreSkills, tools: toolSkills, categories });

    return {
      core: coreSkills.length > 0 ? coreSkills : defaultCore,
      tools: toolSkills.length > 0 ? toolSkills : defaultTools,
      categories: categories.length > 0 ? categories : defaultCategories
    };
  };

  // Helper functions
  const getLevelPercentage = (level) => {
    // Handle both string and numeric levels
    if (typeof level === 'number') {
      return Math.min(Math.max(level, 0), 100);
    }
    
    switch (level) {
      case 'Beginner': return 25;
      case 'Intermediate': return 50;
      case 'Advanced': return 75;
      case 'Expert': return 90;
      default: return 50;
    }
  };

  const getDefaultIcon = (name) => {
    const iconMap = {
      'React': '⚛️',
      'JavaScript': '🟨',
      'Python': '🐍',
      'HTML': '🎨',
      'CSS': '🎨',
      'Bootstrap': '💜',
      'Node.js': '🟢',
      'Express': '🚀',
      'Git': '📦',
      'SQLite': '🗄️',
      'API': '🔗',
      'Storage': '💾',
      'AI': '🤖',
      'Machine Learning': '🤖'
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return '💻'; // Default icon
  };

  const getSkillColor = (category, name) => {
    const colorMap = {
      'Technical': 'from-blue-500 to-cyan-500',
      'Programming Languages': 'from-yellow-400 to-orange-500',
      'Frameworks': 'from-purple-500 to-violet-500',
      'Tools': 'from-gray-600 to-gray-800',
      'Certifications': 'from-green-600 to-teal-600',
      'Soft Skills': 'from-pink-500 to-rose-500',
      'Languages': 'from-indigo-600 to-purple-600'
    };
    
    return colorMap[category] || 'from-blue-500 to-indigo-500';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Technical': 'from-blue-500 to-cyan-500',
      'Programming Languages': 'from-yellow-400 to-orange-500',
      'Frameworks': 'from-purple-500 to-violet-500',
      'Tools': 'from-gray-600 to-gray-800',
      'Certifications': 'from-green-600 to-teal-600',
      'Soft Skills': 'from-pink-500 to-rose-500',
      'Languages': 'from-indigo-600 to-purple-600'
    };
    
    return colorMap[category] || 'from-blue-500 to-indigo-500';
  };

  const { core, tools, categories } = processSkillsData();

  if (loading) {
    return (
      <section id="skills" className="relative min-h-screen py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl mb-4">
              Skills & Expertise
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Loading skills...
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="relative min-h-screen py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Decorative Background Accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-300/30 to-purple-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-tr from-blue-300/25 to-cyan-300/25 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl mb-4">
            Skills & Expertise
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Technologies and tools I use to build amazing digital experiences
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          
          {/* Data Source Indicator */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${Array.isArray(skills) && skills.length > 0 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <span>{Array.isArray(skills) && skills.length > 0 ? 'Live Data' : 'Default Data'}</span>
            </div>
            <button
              onClick={fetchSkills}
              disabled={loading}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              title="Refresh skills data"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm text-yellow-700">{error}</span>
                </div>
                <button
                  onClick={fetchSkills}
                  className="text-sm text-yellow-700 hover:text-yellow-800 font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Skills Grid */}
        <div className="grid gap-8 lg:grid-cols-3 mb-16">
          {/* Core Skills */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold mr-3">💻</span>
                Core Skills
              </h3>
            </div>
            
            {/* Two-column cards for better scanability */}
            <div className="grid gap-6 md:grid-cols-2">
              {core.map((skill, index) => (
                <div 
                  key={skill.name} 
                  className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{skill.icon}</span>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{skill.name}</h4>
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{skill.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-inner opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-sm font-bold">{skill.level}%</span>
                        </div>
                      </div>
                    </div>
                    {/* Show progress bar only on hover, without header to avoid duplicate % */}
                    <div className="hidden group-hover:block transition-all duration-300">
                      <SkillBar level={skill.level} color={skill.color} name={skill.name} showHeader={false} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tools & Technologies */}
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold mr-3">⚡</span>
                Tools & Technologies
              </h3>
            </div>
            
            <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/40 shadow-sm p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tools.map((tool, index) => (
                  <div 
                    key={tool.name}
                    className="group flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-100 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{tool.icon}</span>
                    <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-300">{tool.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm">
                <p className="text-sm text-gray-600 text-center">
                  <span className="font-semibold text-blue-700">Expertise includes:</span> Component-driven design, 
                  responsive layouts, API integration, database management, and modern development practices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Categories - Full Width */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Skill Categories</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.name} className="p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm">📚</span>
                    <h5 className="font-semibold text-gray-800">{category.name}</h5>
                  </div>
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${category.color}`}></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">3+</div>
            <div className="text-sm text-gray-600">Years Experience</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {Array.isArray(skills) && skills.length > 0 ? `${skills.length}+` : '15+'}
            </div>
            <div className="text-sm text-gray-600">Technologies</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 shadow">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {Array.isArray(skills) && skills.filter(skill => skill.isFeatured).length > 0 ? `${skills.filter(skill => skill.isFeatured).length}+` : '10+'}
            </div>
            <div className="text-sm text-gray-600">Featured Skills</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 shadow">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
              {Array.isArray(skills) && skills.filter(skill => skill.level === 'Expert' || skill.level === 'Advanced').length > 0 ? 
                `${Math.round((skills.filter(skill => skill.level === 'Expert' || skill.level === 'Advanced').length / skills.length) * 100)}%` : 
                '100%'
              }
            </div>
            <div className="text-sm text-gray-600">Expert Level</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills


