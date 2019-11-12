const express = require('express');
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

const db = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      body: 'something here...'
    },
    {
      id: 2,
      title: 'Post 2',
      body: 'something else here...'
    }
  ],
  comments: []
};

app.get('/api/posts', (request, response) => {
  response.json(db.posts);
});

app.get("/api/db", (request,response) => {
  response.json(db);
});

app.post('/api/posts', (request, response) => {
  const post = request.body;
  post.id = db.posts.length + 1;
  db.posts.push(post);
  response.json(post);
});

app.post("/api/comments", (request,response) => {
  const comment = request.body;
  if(comment.post == false){
    response.status(400).send({
      errors: {
        post: "Post is required for comments"
      }
    });
  } else {
    const post = db.posts.find(post => {
      return post.id === comment.post;
    });
  if(post){
    comment.id = db.comments.length+1;
    db.comments.push(comment);
    response.json(comment);
  } if (!post){
    response.status(404).send({
      errors: {
        post: "Post doesn't exist"
      }
    });
    }
  }
});

app.get('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.get("/api/posts/:id/comments", (request, response) => {
  const postid = Number(request.params.id);
  const comments = [];
  db.comments.find(comment => {
    if (comment.post === postid) {
      comments.push(comment);
    }
    else {
      response.status.(404).send();
    }
  });
  response.send(comments);
});


app.delete('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    db.posts = db.posts.filter((post) => {
      return post.id !== id;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.delete("/api/comments/:id", (request, response) => {
  const commentid = Number(request.params.id);
  const comment = db.comments.find(comment => {
    return comment.id === commentid;
  });

  if (comment) {
    db.comments = db.comments.filter(comment => {
      return comment.id !== commentid;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.put('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    Object.assign(post, request.body)
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.put("/api/comments/:id", (request, response) => {
  const commentid = Number(request.params.id);
  const comment = db.comments.find(comment => {
    return comment.id === commentid;
  });
  if (comment) {
    Object.assign(comment, request.body);
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});


app.listen(process.env.PORT || 8000);
