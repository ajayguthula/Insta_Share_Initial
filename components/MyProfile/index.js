/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import Profile from '../Profile'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MyProfile extends Component {
  state = {myProfileData: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount = () => {
    this.getMyProfile()
  }

  getMyProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const url = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
    }

    const getFormattedData = data => ({
      posts: data.posts,
      stories: data.stories,
      followersCount: data.followers_count,
      followingCount: data.following_count,
      id: data.id,
      postsCount: data.posts_count,
      profilePic:
        'https://scontent.frja3-1.fna.fbcdn.net/v/t39.30808-6/294562444_3146457745575668_7874851531142164511_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=x7J7usLoe58AX8suJj1&_nc_ht=scontent.frja3-1.fna&oh=00_AfDEIp5znMfUiWL-msVldEMHVud1xly_rrCv2hcFmOGI_Q&oe=643BF7D0',
      userBio: 'Software Developer',
      userId: 'ajayguthula72',
      userName: 'Ajay Guthula',
    })

    const response = await fetch(url, options)
    const fetchedData = await response.json()

    if (response.ok) {
      const myProfile = fetchedData.profile
      const updatedMyProfile = getFormattedData(myProfile)
      this.setState({
        myProfileData: updatedMyProfile,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderMyProfileView = () => {
    const {myProfileData} = this.state
    return <Profile profileDetails={myProfileData} owner="my" />
  }

  renderLoadingView = () => (
    <>
      <Header />
      <div className="user-profile-loader-container" data-testid="loader">
        <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
      </div>
    </>
  )

  renderFailureView = () => (
    <>
      <Header />
      <div className="user-profile-loader-container">
        <img
          className="user-profile-error-image"
          alt="failure view"
          src="https://res.cloudinary.com/aneesmon/image/upload/v1648988134/Insta_Share/failure-image_hzoet8.png"
        />
        <p className="user-profile-error-message">
          Something went wrong. Please try again
        </p>
        <button
          className="user-profile-error-button"
          type="button"
          onClick={this.getMyProfile}
        >
          Try again
        </button>
      </div>
    </>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderMyProfileView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default MyProfile
