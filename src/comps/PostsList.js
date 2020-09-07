import React from 'react'
import { useEffect, useCallback } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-router-dom'
import { Media, Row, ListGroup, Figure } from 'react-bootstrap'
import MultiMedia from 'comps/MultiMedia'
import Spinner from 'comps/Spinner'
import ReactionsBar from 'features/posts/ReactionsBar'
import PostText from 'comps/PostText'
import QuotedPost from 'comps/quoted-post'
import UserLink from 'comps/user-link'

import { useBottomScrollListener } from 'react-bottom-scroll-listener';

export default function PostsList(props) {
    let { posts = [], status, getPosts } = props;
    let bottomRef = React.createRef();
    useEffect(useCallback(() => {
        if (status === 'idle' && !posts.length) {
            getPosts()
            console.log('fetching on first, status:', status)
        }
    }, [status, posts, getPosts]), [getPosts])
    useBottomScrollListener(useCallback(() => {
        if (status === "idle" && posts.length) {
            getPosts()
            console.log('loading more posts, status:', status)
        }
    }, [status, posts, getPosts]), 500)
    return (
        <ListGroup variant="flush" className="border-bottom">
            {(posts && posts.length > 0) ? posts.map(post => {
                let retweeted = false;
                let retweeted_by = null
                if (post.retweeted_status) {
                    retweeted = true
                    retweeted_by = post.user
                    post = post.retweeted_status
                }
                return (
                    <ListGroup.Item
                        className="px-3"
                        action
                        as={"div"}
                        // to={`/post/${post.id_str}`}
                        key={post.id_str + (retweeted_by && retweeted_by.id_str)}
                    >
                        <Row className="d-flex px-3 pb-1 mt-n2">
                            {retweeted && (
                                <UserLink
                                    user={retweeted_by}
                                    className="text-muted"
                                    to={`/user/${retweeted_by.screen_name}`}
                                ><small>{retweeted_by.name} retweeted</small>
                                </UserLink>
                            )}
                        </Row>
                        <Link className="stretched-link" to={`/post/${post.id_str}`}></Link>
                        <Media className="mb-n2 overflow-auto w-100">
                            <UserLink
                                user={post.user}
                                className="rounded-circle"
                                to={`/user/${post.user.screen_name}`}
                            >
                                <Figure
                                    className="bg-border-color rounded-circle mr-2 overflow-hidden"
                                    style={{ height: "50px", width: "50px" }}
                                >
                                    <Figure.Image
                                        src={(post.user.default_profile_image) ? '/img/default-profile-vector.svg' : post.user.profile_image_url_https}
                                        className="w-100 h-100"
                                    />
                                </Figure>
                            </UserLink>
                            <Media.Body className="w-50">
                                <Row className="d-flex align-items-center">
                                    <UserLink
                                        user={post.user}
                                        to={`/user/${post.user.screen_name}`}
                                        className="text-dark font-weight-bold mr-1">
                                        {post.user.name}
                                    </UserLink>
                                    {/* tick */}
                                    <span className="text-muted mr-1">@{post.user.screen_name}</span>
                                    <pre className="m-0 text-muted">{" - "}</pre>
                                    <span className="text-muted"><ReactTimeAgo date={Date.parse(post.created_at)} timeStyle="twitter" /></span>
                                </Row>
                                <Row className="mb-n1 mt-1"><blockquote className="mb-1 w-100">
                                    <PostText post={post} />
                                </blockquote></Row>
                                <Row>
                                    <MultiMedia
                                        className="mt-2"
                                        post={post} />
                                    <QuotedPost className="mt-2" post={post.quoted_status} />
                                </Row>
                                <Row className="d-flex justify-content-end align-items-center position-static">
                                    <ReactionsBar post={post} />
                                </Row>
                            </Media.Body>
                        </Media>
                    </ListGroup.Item>
                )
            }) : (
                    <div className="message">No posts for you right now</div>
                )}
            <div ref={bottomRef} >
                {status === 'loading' ? <Spinner /> : <br />}
            </div>
        </ListGroup>
    )
}