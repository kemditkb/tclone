import React from 'react'
import { useCallback } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'

export default props => {
    let { isAuthenticated } = useSelector(state => state.auth)
    let { followUser, user, unFollowUser } = props
    let { following } = user;
    let [hoverText, setHoverText] = React.useState('')
    let [hoverVariant, setHoverVariant] = React.useState('')
    let handleFollow = async e => {
        e.preventDefault()
        followUser(user.screen_name)
    }
    let handleUnFollow = async e => {
        e.preventDefault()
        unFollowUser(user.screen_name)
        setHoverText("Unfollowed")
    }
    let handleMouseEnter = useCallback(async _ => {
        following && setHoverText("Unfollow")
        following && setHoverVariant('danger')
    }, [following])
    let handleMouseLeave = async _ => {
        setHoverText('')
        setHoverVariant('')
    }
    let text = !following ? "Follow" : "Following"
    let variant = following ? "primary" : "outline-primary"
    if (!isAuthenticated)
        return <></>
    return (<>
        <Button
            onClick={following ? handleUnFollow : handleFollow}
            variant={hoverVariant || variant}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="rounded-pill px-3 py-1 font-weight-bold">
            <span>{hoverText || text}</span>
        </Button>
    </>)
}