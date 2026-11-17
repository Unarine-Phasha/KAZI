
import { useState, useEffect } from 'react'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'

function Home() {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [searchMessage, setSearchMessage] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)

  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [jobsError, setJobsError] = useState('')
  const [searchSubmitted, setSearchSubmitted] = useState(false)

const filteredJobs = jobs.filter((job) => {
  const keywordMatch =
    !keyword.trim() ||
    job.title.toLowerCase().includes(keyword.toLowerCase()) ||
    job.company.toLowerCase().includes(keyword.toLowerCase())

  const locationMatch =
    !location.trim() ||
    job.location.toLowerCase().includes(location.toLowerCase())

  return keywordMatch && locationMatch
})

  // Check backend connection
  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Backend connection failed')
        }
        return response.json()
      })
      .then((data) => {
        console.log(data.message)
      })
      .catch(() => {
        console.error('Unable to connect to KAZI backend.')
      })
  }, [])

  // Fetch jobs from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/jobs')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to fetch jobs')
        }
        return response.json()
      })
      .then((data) => {
        setJobs(data.jobs)
        setJobsLoading(false)
      })
      .catch(() => {
        setJobsError('Unable to load vacancies. Please try again later.')
        setJobsLoading(false)
      })
  }, [])

  // Handle job search
  const handleSearch = (e) => {
  e.preventDefault()

  if (!keyword.trim() && !location.trim()) {
    setSearchMessage('Please enter a job title or location.')
    setSearchSubmitted(false)
    return
  }

  setSearchSubmitted(true)
  setSearchMessage(
    `Showing results for "${keyword || 'all jobs'}" in ${location || 'South Africa'}.`
  )
}

  const categories = [
    {
      title: 'Full-time Jobs',
      description: 'Explore permanent employment opportunities.'
    },
    {
      title: 'Graduate Programmes',
      description: 'Take the first step towards your career.'
    },
    {
      title: 'Remote Jobs',
      description: 'Discover opportunities to work remotely.'
    },
    {
      title: 'Internships',
      description: 'Build experience and develop your skills.'
    }
  ]
if (selectedJob) {
  return (
    <div className="app">
      <nav className="navbar">
        <a href="#" className="logo" onClick={() => setSelectedJob(null)}>
          K A Z I
        </a>

        <button
          className="login-btn"
          onClick={() => setSelectedJob(null)}
        >
          Back to jobs
        </button>
      </nav>

      <main className="job-details-page">
        <button
          className="back-link"
          onClick={() => setSelectedJob(null)}
        >
          Back to opportunities
        </button>

        <div className="job-details-card">
          <span className="section-label">JOB OPPORTUNITY</span>

          <h1>{selectedJob.title}</h1>

          <h3>{selectedJob.company}</h3>

          <div className="job-information">
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Employment type:</strong> {selectedJob.type}</p>
            <p><strong>Category:</strong> {selectedJob.category}</p>
            <p><strong>Experience:</strong> {selectedJob.experience}</p>
          </div>

          <div className="job-description">
            <h2>About this opportunity</h2>
            <p>{selectedJob.description}</p>
          </div>

          <div className="job-application">
            <h2>How to apply</h2>

            {selectedJob.applyUrl ? (
              <a
                href={selectedJob.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="register-btn"
              >
                Apply for this position
              </a>
            ) : (
              <p>
                Application information will be available when this
                vacancy is published by its employer.
              </p>
            )}
          </div>
        </div>
      </main>

      <footer>
        <a href="#" className="logo">K A Z I</a>
        <p>Connecting people to work.</p>
        <p>© 2026 KAZI. All rights reserved.</p>
      </footer>
    </div>
  )
}
  return (
    <div className="app">
      <nav className="navbar">
        <a href="#" className="logo">K A Z I</a>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#opportunities">Find Jobs</a>
          <a href="#about">About Us</a>
        </div>

        <div className="nav-actions">
          <a href="/login" className="login-btn">Log in</a>
          <a href="/register" className="register-btn">Create Account</a>
        </div>

        <button className="mobile-menu">Menu</button>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="hero-label">
              OPPORTUNITIES ACROSS SOUTH AFRICA
            </div>

            <h1>
              Your next opportunity
              <br />
              starts <span>here.</span>
            </h1>

            <p className="hero-description">
              Discover jobs, internships and graduate programmes.
              Find opportunities that match your skills, qualifications
              and ambitions.
            </p>

            <form className="search-box" onSubmit={handleSearch}>
              <div className="search-field">
                <input
                  type="text"
                  placeholder="Job title, keyword or company"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="search-divider"></div>

              <div className="search-field">
                <input
                  type="text"
                  placeholder="City or province"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <button type="submit" className="search-btn">
                Search Jobs
              </button>
            </form>

            {searchMessage && (
              <p className="search-message">{searchMessage}</p>
            )}

            <p className="popular-searches">
              Popular searches:
              <a href="#latest-jobs"> Internships</a>
              <a href="#latest-jobs"> Graduate jobs</a>
              <a href="#latest-jobs"> Remote work</a>
            </p>
          </div>
        </section>

        <section className="categories-section" id="latest-jobs">
          <div className="section-heading">
            <div>
              <span className="section-label">LATEST OPPORTUNITIES</span>
              <h2>Explore available jobs.</h2>
              <p>Discover opportunities from different industries.</p>
            </div>
          </div>

          {jobsLoading && <p>Loading vacancies...</p>}

          {jobsError && <p>{jobsError}</p>}

          {!jobsLoading && !jobsError && (
            <div className="category-grid">
              {(searchSubmitted ? filteredJobs : jobs).map((job) => (
                <div className="category-card" key={job.id}>
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                  <p>{job.location}</p>
                  <p>{job.type}</p>
                  <p>{job.experience}</p>
                  <button
  className="view-job-btn"
  onClick={() => setSelectedJob(job)}
>
  View opportunity
</button>
                </div>
              ))}
            </div>
          )}

          {!jobsLoading && !jobsError && searchSubmitted && filteredJobs.length === 0 && (
            <p>No vacancies match your search. Try another keyword or location.</p>
          )}
        </section>

        <section className="categories-section" id="opportunities">
          <div className="section-heading">
            <div>
              <span className="section-label">EXPLORE OPPORTUNITIES</span>
              <h2>Find the right path for you.</h2>
              <p>Whatever stage you're at, there's an opportunity waiting.</p>
            </div>

            <a href="#latest-jobs" className="view-all">
              Explore all
            </a>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <div className="category-card" key={category.title}>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <a href="#latest-jobs">Explore opportunities</a>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section" id="about">
          <div>
            <span className="section-label">ABOUT KAZI</span>
            <h2>Connecting people to work.</h2>
          </div>

          <p>
            KAZI makes discovering employment opportunities simpler.
            From your first internship to your next career move,
            we're here to help you find your way.
          </p>
        </section>
      </main>

      <footer>
        <a href="#" className="logo">K A Z I</a>
        <p>Connecting people to work.</p>
        <p>© 2026 KAZI. All rights reserved.</p>
      </footer>
    </div>
  )
}

function App() {
  const currentPath = window.location.pathname

  if (currentPath === '/register') {
    return <Register />
  }

  if (currentPath === '/login') {
    return <Login />
  }

  if (currentPath === '/profile') {
    return <Profile />
  }

  return <Home />
}

export default App
