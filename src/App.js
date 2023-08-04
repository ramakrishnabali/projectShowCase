import {useState, useEffect} from 'react'

import Loader from 'react-loader-spinner'

import './App.css'

//  This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const status = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

// Replace your code here
const App = () => {
  const [categorie, setCategorie] = useState({
    categorieData: [],
    categorieType: categoriesList[0].id,
    apiStatus: status.loading,
  })

  const getData = async () => {
    setCategorie(prevState => ({
      ...prevState,
      apiStatus: status.loading,
    }))

    const api = `https://apis.ccbp.in/ps/projects?category=${categorie.categorieType}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(api, options)

    if (response.ok) {
      const data = await response.json()

      const updatedData = data.projects.map(eachData => ({
        id: eachData.id,
        name: eachData.name,
        imageUrl: eachData.image_url,
      }))
      //   console.log(updatedData)
      setCategorie(prevState => ({
        ...prevState,
        categorieData: [...updatedData],
        apiStatus: status.success,
      }))
    } else {
      setCategorie(prevState => ({
        ...prevState,
        apiStatus: status.failure,
      }))
    }
  }

  useEffect(() => {
    getData()
  }, [categorie.categorieType])

  const changeCategorie = event => {
    setCategorie(prevState => ({
      ...prevState,
      categorieType: event.target.value,
    }))
  }

  const successPage = () => (
    <ul className="ul">
      {categorie.categorieData.map(each => {
        const {id, name, imageUrl} = each

        return (
          <li key={id} className="li">
            <img src={imageUrl} alt={name} className="image" />
            <p className="name">{name}</p>
          </li>
        )
      })}
    </ul>
  )

  const loadingPage = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#328af2" height="80" width="80" />
    </div>
  )

  const failurePage = () => (
    <div className="loader">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={() => getData()}>
        Retry
      </button>
    </div>
  )

  const pageStatus = () => {
    const {apiStatus} = categorie

    switch (apiStatus) {
      case status.success:
        return successPage()
      case status.loading:
        return loadingPage()
      case status.failure:
        return failurePage()
      default:
        return null
    }
  }

  return (
    <>
      <div className="header">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          alt="website logo"
          className="header-image"
        />
      </div>
      <div className="categorie-container">
        <select
          className="categorie"
          value={categorie.categorieType}
          onChange={changeCategorie}
        >
          {categoriesList.map(each => (
            <option className="option" value={each.id} key={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        {pageStatus()}
      </div>
    </>
  )
}

export default App
