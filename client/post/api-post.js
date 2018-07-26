const create = (params, credentials, post) => {
  return fetch(`/api/posts/new/${params.userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${credentials.t}`
    },
    body: post
  })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

const remove = (params, credentials) => {
  return fetch(`/api/posts/${params.postId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${credentials.t}`
    }
  })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

const like = (params, credentials, postId) => {
  return fetch(`/api/posts/like/`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${credentials.t}`
    },
    body: JSON.stringify({ userId: params.userId, postId: postId })
  })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

const unlike = (params, credentials, postId) => {
  return fetch(`/api/posts/unlike/`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${credentials.t}`
    },
    body: JSON.stringify({ userId: params.userId, postId: postId })
  })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

const comment = (params, credentials, postId, comment) => {
  return fetch(`/api/posts/comment/`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${credentials.t}`
    },
    body: JSON.stringify({
      userId: params.userId,
      postId: postId,
      comment: comment
    })
  })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

const listNewsfeed = (params, credentials) => {
  return fetch(`/api/posts/feed/${params.userId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${credentials.t}`
    }
  })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

const listByUser = (params, credentials) => {
  return fetch(`/api/posts/by/${params.userId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${credentials.t}`
    }
  })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export { create, remove, like, unlike, comment, listNewsfeed, listByUser }
