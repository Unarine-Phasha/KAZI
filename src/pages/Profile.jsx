
import { useState, useEffect } from 'react'

function Profile() {
  const [formData, setFormData] = useState({
    phone: '',
    province: '',
    city: '',
    highest_qualification: '',
    field_of_study: '',
    skills: '',
    experience_level: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('kaziToken')

  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
      return
    }

    async function loadProfile() {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load profile.')
        }

        if (data.profile) {
          setFormData({
            phone: data.profile.phone || '',
            province: data.profile.province || '',
            city: data.profile.city || '',
            highest_qualification: data.profile.highest_qualification || '',
            field_of_study: data.profile.field_of_study || '',
            skills: data.profile.skills || '',
            experience_level: data.profile.experience_level || ''
          })
        }
      } catch (error) {
        setMessage(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [token])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setSaving(true)

    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save profile.')
      }

      setMessage('Your profile has been saved successfully.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <main className="auth-page">Loading your profile...</main>
  }

  return (
    <main className="auth-page">
      <section className="auth-card profile-card">
        <a href="/" className="auth-logo">K A Z I</a>

        <h1>Your profile</h1>

        <p className="auth-subtitle">
          Tell us more about yourself so we can help you
          discover relevant employment opportunities.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="phone">Phone number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 071 234 5678"
          />

          <label htmlFor="province">Province</label>
          <select id="province" name="province" value={formData.province} onChange={handleChange}>
            <option value="">Select your province</option>
            <option value="Eastern Cape">Eastern Cape</option>
            <option value="Free State">Free State</option>
            <option value="Gauteng">Gauteng</option>
            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
            <option value="Limpopo">Limpopo</option>
            <option value="Mpumalanga">Mpumalanga</option>
            <option value="Northern Cape">Northern Cape</option>
            <option value="North West">North West</option>
            <option value="Western Cape">Western Cape</option>
          </select>

          <label htmlFor="city">City or town</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city or town"
          />

          <label htmlFor="highest_qualification">Highest qualification</label>
          <select
            id="highest_qualification"
            name="highest_qualification"
            value={formData.highest_qualification}
            onChange={handleChange}
          >
            <option value="">Select your qualification</option>
            <option value="Below Matric">Below Matric</option>
            <option value="Matric">Matric</option>
            <option value="Certificate">Certificate</option>
            <option value="Higher Certificate">Higher Certificate</option>
            <option value="Diploma">Diploma</option>
            <option value="Advanced Diploma">Advanced Diploma</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Honours Degree">Honours Degree</option>
            <option value="Postgraduate Diploma">Postgraduate Diploma</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="Doctorate">Doctorate</option>
          </select>

          <label htmlFor="field_of_study">Field of study</label>
          <input
            type="text"
            id="field_of_study"
            name="field_of_study"
            value={formData.field_of_study}
            onChange={handleChange}
            placeholder="e.g. Information Technology"
          />

          <label htmlFor="skills">Skills</label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Enter your skills, separated by commas"
            rows="4"
          />

          <label htmlFor="experience_level">Experience level</label>
          <select
            id="experience_level"
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
          >
            <option value="">Select your experience level</option>
            <option value="No experience">No experience</option>
            <option value="Less than 1 year">Less than 1 year</option>
            <option value="1–2 years">1–2 years</option>
            <option value="3–5 years">3–5 years</option>
            <option value="More than 5 years">More than 5 years</option>
          </select>

          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>

        {message && (
          <p className="auth-message" role="status">{message}</p>
        )}
      </section>
    </main>
  )
}

export default Profile
