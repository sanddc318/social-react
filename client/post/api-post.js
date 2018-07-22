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

export { listNewsfeed, listByUser }
