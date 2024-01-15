import React, { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import faker from 'faker'
import { nanoid } from 'nanoid'

import Paginator from 'Components/Paginator'

import postsQuery from 'GraphQL/Queries/posts.graphql'

import { POST } from 'Router/routes'

import { Column, Container, Post, PostAuthor, PostBody } from './styles'

import ExpensiveTree from '../ExpensiveTree'

function Root() {
  const itemsPerPage = 10
  const [count, setCount] = useState(0)
  const [fields, setFields] = useState([
    {
      name: faker.name.findName(),
      id: nanoid(),
    },
  ])
  const [currentPage, setCurrentPage] = useState(1)

  const inputRef = useRef()
  const { data, loading } = useQuery(postsQuery, {
    variables: {
      page: currentPage,
      perPage: itemsPerPage,
    },
  })

  const totalCount = data?.posts.meta?.totalCount

  function handlePush() {
    setFields([{ name: faker.name.findName(), id: nanoid() }, ...fields])
  }

  function handleAlertClick() {
    setTimeout(() => {
      alert(`You clicked ${count} times`)
    }, 2500)
  }

  const handleOnPageNumberClick = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const posts = data?.posts.data || []
  return (
    <Container>
      <Column>
        <h4>Need to add pagination</h4>
        {loading
          ? 'Loading...'
          : posts.map(post => (
              <Post key={post.id} mx={4}>
                <NavLink href={POST(post.id)} to={POST(post.id)}>
                  {post.title}
                </NavLink>
                <PostAuthor>by {post.user.name}</PostAuthor>
                <PostBody>{post.body}</PostBody>
              </Post>
            ))}
        <div>
          <Paginator
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalCount={totalCount}
            onPageNumberClick={handleOnPageNumberClick}
          />
        </div>
        <div>Pagination here</div>
      </Column>
      <Column>
        <h4>Slow rendering</h4>
        <label>
          Enter something here:
          <br />
          <input ref={inputRef} />
        </label>
        <p>So slow...</p>
        <ExpensiveTree />

        <h4>Closures?</h4>
        <p>You clicked {count} times</p>
        <button type="button" onClick={() => setCount(count + 1)}>
          Click me
        </button>
        <button type="button" onClick={handleAlertClick}>
          Show alert
        </button>
      </Column>

      <Column>
        <h4>Incorrect form field behavior</h4>
        <button type="button" onClick={handlePush}>
          Add more
        </button>
        <ol>
          {fields.map((field, index) => (
            <li key={field.id}>
              {field.name}:<br />
              <input type="text" />
            </li>
          ))}
        </ol>
      </Column>
    </Container>
  )
}

export default Root
