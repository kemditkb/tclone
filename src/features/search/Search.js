import React from 'react'
import PostsList from 'comps/PostsList'
import UsersList from 'comps/UsersList'
import { Redirect, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
    changeQuery,
    trySearch,
    selectSearchPosts,
    selectSearchUsers,
} from './searchSlice'
import { followUser, unFollowUser } from 'features/users/usersSlice'
import { useEffect } from 'react'

export default () => {
    let location = useLocation()
    let dispatch = useDispatch()
    let { search } = location
    let { status, query } = useSelector(state => state.search)
    let posts = useSelector(selectSearchPosts)
    let users = useSelector(selectSearchUsers)
    let urlq = new URLSearchParams(search).get('q')
    if (!urlq || !urlq.trim()) {
        return <Redirect to="/explore" />
    }
    useEffect(() => {
        if (query !== urlq)
            dispatch(changeQuery(urlq))
    })
    return (<>
        {users && <UsersList
            users={users}
            followUser={username => { dispatch(followUser(username)) }}
            unFollowUser={username => { dispatch(unFollowUser(username)) }}
        />}
        {posts && posts.length && <PostsList
            posts={posts}
            status={status}
            getPosts={() => { dispatch(trySearch()) }}
        />}
    </>)
}