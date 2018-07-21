const create = (user) => {
  return fetch('/api/users/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

const list = () => {
  return fetch('/api/users/')
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

const read = (params, credentials) => {
  return fetch(`/api/users/${params.userId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${credentials.t}`
    }
  })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

const update = (params, credentials, user) => {
  return fetch(`/api/users/${params.userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${credentials.t}`
    },
    body: user
  })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

const remove = (params, credentials) => {
  return fetch(`/api/users/${params.userId}`, {
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

const follow = (params, credentials, otherUserId) => {
  return fetch('/api/users/follow/', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${credentials.t}`
    },
    body: JSON.stringify({ userId: params.userId, otherUserId: otherUserId })
  })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

const unfollow = (params, credentials, otherUserId) => {
  return fetch('/api/users/unfollow/', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${credentials.t}`
    },
    body: JSON.stringify({ userId: params.userId, otherUserId: otherUserId })
  })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export { create, list, read, update, remove, follow, unfollow }
