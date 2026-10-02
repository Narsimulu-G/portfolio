import { useEffect, useRef, useState } from 'react'
import OrbitScene from './OrbitScene'
import { apiFetch, fixImageUrl } from '../../lib/api'
import './portfolio.css'

const filters = ['All work', 'Data analytics', 'AI & development']
const selectedProjects = [
  { title: 'E-commerce intelligence', category: 'Data analytics', description: 'From 392K+ transactions to a clearer picture of revenue, customer value, and retention.', technologies: ['Python', 'PostgreSQL', 'Power BI'], metric: '392K+', metricLabel: 'transactions explored', art: 'commerce', detail: 'Cleaned transaction data, analyzed revenue and order patterns in PostgreSQL, and built a three-page Power BI dashboard. RFM segmentation identified 947 Champion customers contributing approximately £5.73M in the project dataset.' },
  { title: 'SkillMap AI', category: 'AI & development', description: 'An AI career assistant connecting skills to relevant opportunities and learning paths.', technologies: ['LangChain', 'FastAPI', 'Gemini'], metric: 'AI', metricLabel: 'career & skill discovery', art: 'skillmap', detail: 'Built an agent workflow using LangChain and Gemini, with a FastAPI backend and job discovery through Tavily Search and JSearch. The interface presents job titles, companies, salary information where available, and application links.' },
  { title: 'Customer behavior, decoded', category: 'Data analytics', description: 'Exploring what people buy, how they shop, and the patterns behind their decisions.', technologies: ['Pandas', 'MySQL', 'Power BI'], metric: '3,900', metricLabel: 'customer transactions', art: 'customer', detail: 'Prepared and explored 3,900 transactions using Python, Pandas, and NumPy. SQL analysis and an interactive Power BI dashboard cover purchasing patterns, subscriptions, discounts, product performance, and demographics.' },
  { title: 'Job market analytics', category: 'AI & development', description: 'A repeatable pipeline that turns messy job listings into searchable market insights.', technologies: ['Python', 'ETL', 'Streamlit'], metric: 'ETL', metricLabel: 'from raw data to insight', art: 'pipeline', detail: 'Developed an ETL and analytics pipeline for job postings with deduplication, normalization, and data-quality checks, and surfaced the results through a Streamlit dashboard.' },
]
const skills = [
  ['01', 'Data & analytics', 'Python / SQL / Pandas / NumPy / Power BI / ETL'],
  ['02', 'AI & machine learning', 'scikit-learn / TensorFlow / PyTorch / LangChain'],
  ['03', 'Web & engineering', 'React / JavaScript / FastAPI / Flask / Git'],
]
function safeUrl(value) { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null } catch { return null } }
function Arrow() { return <span aria-hidden="true">↗</span> }

function ProjectArt({ project }) {
  const [broken, setBroken] = useState(false)
  const image = safeUrl(project.imageUrl || project.image)
  return <div className={`project-art art-${project.art || 'pipeline'}`} aria-hidden="true">
    {image && !broken ? <img src={image} alt="" loading="lazy" onError={() => setBroken(true)} /> : <>
      <div className="art-grid" />
      {project.art === 'skillmap' ? <div className="ai-orbit"><i /><i /><i /><b>AI</b><span className="ai-label label-one">DISCOVER</span><span className="ai-label label-two">CONNECT</span></div>
        : project.art === 'pipeline' ? <div className="pipeline-art"><i>RAW</i><span>→</span><i>SQL</i><span>→</span><i>INSIGHT</i></div>
        : <div className="chart-art">{[34, 57, 43, 76, 65, 93, 81].map((height, i) => <i key={i} style={{ '--bar-height': `${height}%` }} />)}</div>}
      <div className="art-caption"><span>{project.metric || 'BUILD'}</span><small>{project.metricLabel || 'Selected project'}</small></div>
    </>}
  </div>
}

export default function Portfolio() {
  const [filter, setFilter] = useState('All work')
  const [menuOpen, setMenuOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const [projects, setProjects] = useState(selectedProjects)
  const [remote, setRemote] = useState({})
  const [activeProject, setActiveProject] = useState(null)
  const [copied, setCopied] = useState(false)
  const hero = useRef(null)
  const modal = useRef(null)
  const previousFocus = useRef(null)
  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    // Public CMS content is optional: the portfolio stays useful while Render wakes up.
    Promise.allSettled(['profile', 'resume', 'contact', 'projects', 'skills', 'certificates', 'about'].map(path => apiFetch(`/api/${path}`, { signal: controller.signal }))).then(results => {
      if (controller.signal.aborted) return
      const data = {}
      results.forEach((result, i) => { if (result.status === 'fulfilled') data[['profile', 'resume', 'contact', 'projects', 'skills', 'certificates', 'about'][i]] = result.value })
      setRemote(data)
      if (Array.isArray(data.projects) && data.projects.length) setProjects(data.projects.map(project => ({ ...project, category: /data|analytic|dashboard/i.test(project.category || '') ? 'Data analytics' : 'AI & development', imageUrl: fixImageUrl(project.imageUrl || project.image) })))
    }).finally(() => clearTimeout(timer))
    return () => { clearTimeout(timer); controller.abort() }
  }, [])
  useEffect(() => {
    if (activeProject) { previousFocus.current = document.activeElement; modal.current?.showModal() }
    else { modal.current?.close(); previousFocus.current?.focus() }
  }, [activeProject])
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(timer)
  }, [copied])
  const email = remote.contact?.email || remote.profile?.social?.email || 'narasimha.2003g@gmail.com'
  const github = safeUrl(remote.contact?.socialLinks?.github || remote.profile?.social?.github) || 'https://github.com/Narsimulu-G'
  const linkedin = safeUrl(remote.contact?.socialLinks?.linkedin || remote.profile?.social?.linkedin) || 'https://www.linkedin.com/in/g-narsimulu'
  const resume = safeUrl(remote.resume?.fileUrl && fixImageUrl(remote.resume.fileUrl))
  const visibleProjects = projects.filter(project => filter === 'All work' || project.category === filter)
  const reveal = event => {
    if (paused || event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = hero.current.getBoundingClientRect()
    hero.current.style.setProperty('--reveal-x', `${event.clientX - bounds.left}px`)
    hero.current.style.setProperty('--reveal-y', `${event.clientY - bounds.top}px`)
    hero.current.dataset.revealing = 'true'
  }
  const hideReveal = () => { if (hero.current) hero.current.dataset.revealing = 'false' }
  const tiltCard = event => {
    if (paused || event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--tilt-x', `${(event.clientY - bounds.top - bounds.height / 2) / bounds.height * -7}deg`)
    event.currentTarget.style.setProperty('--tilt-y', `${(event.clientX - bounds.left - bounds.width / 2) / bounds.width * 7}deg`)
  }
  const resetTilt = event => { event.currentTarget.style.setProperty('--tilt-x', '0deg'); event.currentTarget.style.setProperty('--tilt-y', '0deg') }
  const closeMenu = () => setMenuOpen(false)
  const openProject = project => setActiveProject(project)
  return <div className={`portfolio-v2 ${paused ? 'motion-paused' : ''}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a href="#home" className="wordmark" aria-label="Narsimulu home" onClick={closeMenu}>narsimulu<span>®</span></a>
      <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close −' : 'Menu +'}</button>
      <nav id="primary-nav" className={menuOpen ? 'is-open' : ''} aria-label="Main navigation">
        <a href="#work" onClick={closeMenu}>Work <sup>{String(projects.length).padStart(2, '0')}</sup></a><a href="#about" onClick={closeMenu}>About</a><a href="#expertise" onClick={closeMenu}>Expertise</a>
        <a className="nav-contact" href="#contact" onClick={closeMenu}>Let’s talk <Arrow /></a>
      </nav>
    </header>
    <main id="main">
      <section id="home" className="hero-section">
        <div className="hero-topline"><span><i className="status-dot" /> OPEN TO OPPORTUNITIES</span><span>HYDERABAD, INDIA ↗</span></div>
        <div className="hero-content" ref={hero} onPointerMove={reveal} onPointerLeave={hideReveal}>
          <div className="cursor-reveal" aria-hidden="true"><span>EXPLORE.<br />EXPERIMENT.<br />CREATE.</span><code>ideas.map(build) → possibility</code></div>
          <div className="hero-copy"><p className="eyebrow">GATHPA NARSIMULU · DATA & DEVELOPMENT</p>
            <h1>Turning data<br />into <em>possibility.</em></h1>
            <p className="hero-description">I connect analytical thinking with thoughtful engineering to build useful insights, intelligent tools, and digital experiences.</p>
            <div className="hero-actions"><a className="button-primary" href="#work">Explore my work <Arrow /></a><a className="text-link" href="#about">A little about me <span>↓</span></a></div>
          </div>
          <div className="hero-visual"><span className="scene-corner">FIG. 01 / CONNECTED THINKING</span><OrbitScene paused={paused} /><div className="scene-bottom"><span>DATA × CODE × CURIOSITY</span><button onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'Resume animation' : 'Pause animation'}>{paused ? '▶' : 'Ⅱ'}</button></div></div>
        </div>
        <div className="hero-foot"><p>Data analyst. Python developer.<br /><span>Always curious about what comes next.</span></p><a href="#work">SCROLL TO EXPLORE <span>↓</span></a></div>
      </section>
      <div className="tool-strip" aria-label="Core technologies"><span>BUILT WITH CURIOSITY. BACKED BY</span><b>Python</b><b>SQL</b><b>Power BI</b><b>React</b><b>FastAPI</b></div>
      <section id="work" className="section work-section">
        <div className="section-top"><p className="eyebrow">01 / SELECTED WORK</p><span className="subtle">A few things I’ve put my mind to.</span></div>
        <div className="section-heading"><h2>Ideas, made <em>real.</em></h2><div className="filter-list" aria-label="Filter projects">{filters.map(item => <button key={item} onClick={() => setFilter(item)} aria-pressed={item === filter}>{item}</button>)}</div></div>
        <p className="sr-only" aria-live="polite">{visibleProjects.length} projects shown</p>
        <div className="project-grid">{visibleProjects.map((project, index) => <article className="project-card" key={project._id || project.title} onPointerMove={tiltCard} onPointerLeave={resetTilt}>
          <button className="project-open" onClick={() => openProject(project)} aria-label={`View ${project.title}`}><ProjectArt project={project} /><span className="project-arrow"><Arrow /></span></button>
          <div className="project-meta"><span>{String(index + 1).padStart(2, '0')} / {project.category}</span><span>CASE STUDY</span></div>
          <button className="project-title" onClick={() => openProject(project)}><h3>{project.title}</h3></button><p>{project.description}</p>
          <div className="tags">{(project.technologies || project.tags || []).map(tag => <span key={tag}>{tag}</span>)}</div>
        </article>)}</div>
        {!visibleProjects.length && <p className="empty-state">More projects are on the way. Explore another category.</p>}
        <a className="text-link all-work" href={github} target="_blank" rel="noreferrer">Explore my GitHub <Arrow /></a>
      </section>
      <section id="about" className="section about-section"><div><p className="eyebrow">02 / THE PERSON BEHIND THE WORK</p><h2>Analytical mind.<br /><em>Builder at heart.</em></h2><div className="identity-card" aria-label="Gathpa Narsimulu, Hyderabad"><div className="identity-monogram" aria-hidden="true">GN<span>✳</span></div><div><span>GATHPA NARSIMULU</span><small>HYDERABAD · INDIA</small></div><b aria-hidden="true">↗</b></div></div><div className="about-copy"><p>I’m Gathpa Narsimulu, a Hyderabad-based developer and data enthusiast with an MCA in Artificial Intelligence and Machine Learning.</p><p>{remote.about?.description || 'I enjoy the entire journey: untangling a messy dataset, finding the story inside it, and building something people can actually use. My work brings together Python, SQL, analytics, and practical AI.'}</p><div className="timeline"><div><span>2026</span><div><h3>Artificial Intelligence Intern</h3><p>Krutanic · Jun – Aug 2026</p><small>Data preprocessing, ML model testing, and Python / FastAPI development in a mentored project environment.</small></div></div><div><span>2024–26</span><div><h3>MCA · Artificial Intelligence & ML</h3><p>Guru Nanak University, Hyderabad</p></div></div><div><span>2021–24</span><div><h3>B.Com · Computer Applications</h3><p>Osmania University, Hyderabad</p></div></div></div>{resume && <a className="text-link" href={resume} target="_blank" rel="noreferrer">View my résumé <Arrow /></a>}</div></section>
      <section id="expertise" className="section expertise-section"><p className="eyebrow">03 / MY TOOLKIT</p><div className="section-heading"><h2>Different tools.<br /><em>One curious mind.</em></h2><p className="subtle">From the first query<br />to the final experience.</p></div><div className="skill-rows">{skills.map(([number, title, tools]) => <div className="skill-row" key={number}><span>{number}</span><h3>{title}</h3><p>{tools}</p><Arrow /></div>)}</div>{Array.isArray(remote.skills) && remote.skills.length > 0 && <div className="tags cms-skills" aria-label="Additional skills">{remote.skills.map(skill => <span key={skill._id || skill.name}>{skill.name}</span>)}</div>}</section>
      {Array.isArray(remote.certificates) && remote.certificates.length > 0 && <section className="section credentials-section"><p className="eyebrow">CONTINUOUS LEARNING</p><h2>Learning never <em>stops.</em></h2><div className="credential-grid">{remote.certificates.map(c => <article key={c._id || c.title}><h3>{c.title}</h3><p>{c.issuer || c.organization}</p>{safeUrl(c.credentialUrl || c.imageUrl || c.image) && <a className="text-link" href={safeUrl(c.credentialUrl || c.imageUrl || c.image)} target="_blank" rel="noreferrer">View certificate <Arrow /></a>}</article>)}</div></section>}
      <section id="contact" className="section contact-section"><div className="contact-top"><p className="eyebrow">04 / YOUR NEXT IDEA STARTS HERE</p><span><i className="status-dot" /> LET’S CONNECT</span></div><h2>Have something<br />in <em>mind?</em><a href={`mailto:${email}`} aria-label="Start an email"><Arrow /></a></h2><div className="contact-bottom"><p>I’m open to data analytics, Python development,<br />and opportunities to build something meaningful.</p><div><a className="email-link" href={`mailto:${email}`}>{email}</a><button className="copy-button" onClick={async () => { try { await navigator.clipboard.writeText(email); setCopied(true) } catch { setCopied(false) } }} aria-label="Copy email address">{copied ? 'Copied ✓' : 'Copy ↗'}</button><span className="sr-only" role="status">{copied ? 'Email address copied' : ''}</span></div></div></section>
    </main>
    <footer className="site-footer"><a href="#home" className="wordmark">narsimulu<span>®</span></a><p>© {new Date().getFullYear()} Gathpa Narsimulu</p><div><a href={github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="#home">Back to top ↑</a></div></footer>
    <dialog ref={modal} className="project-dialog" onCancel={() => setActiveProject(null)} onClick={event => { if (event.target === modal.current) setActiveProject(null) }} aria-labelledby="project-dialog-title">
      {activeProject && <><button autoFocus className="dialog-close" onClick={() => setActiveProject(null)} aria-label="Close project details">Close ×</button><p className="eyebrow">{activeProject.category}</p><h2 id="project-dialog-title">{activeProject.title}</h2><p>{activeProject.detail || activeProject.description}</p><div className="tags">{(activeProject.technologies || activeProject.tags || []).map(tag => <span key={tag}>{tag}</span>)}</div><div className="dialog-links">{safeUrl(activeProject.githubUrl) && <a className="button-primary" href={safeUrl(activeProject.githubUrl)} target="_blank" rel="noreferrer">Source code ↗</a>}{safeUrl(activeProject.liveUrl || activeProject.demoUrl) && <a className="text-link" href={safeUrl(activeProject.liveUrl || activeProject.demoUrl)} target="_blank" rel="noreferrer">Live project ↗</a>}</div></>}
    </dialog>
  </div>
}
