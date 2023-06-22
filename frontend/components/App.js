import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";
import PrivateRoute from "./PrivateRoute";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    /* ✨ implement */ navigate("/");
  };
  const redirectToArticles = () => {
    /* ✨ implement */ navigate("/articles");
  };

 

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem("token");
    setMessage("Goodbye!");
    redirectToLogin();
    setSpinnerOn(false)
  };

  const login = ({ username, password }) => {
    console.log("login");
    setSpinnerOn(true);
    axios
      .post(`${loginUrl}`, { username, password })
      .then((res) => {
        console.log(res);
        localStorage.setItem("token", res.data.token);

        redirectToArticles();

        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  };

  const getArticles = () => {
    const token = localStorage.getItem("token");
    setSpinnerOn(true);
    axios.get(`${articlesUrl}`, { headers: {authorization: token, }})
        .then((res) => {
          console.log(res);
          setArticles(res.data.articles);
          setMessage(res.data.message);
          setSpinnerOn(false);
        })
        .catch((err) => {
          console.log(err);
          redirectToLogin();
        })
      
      };
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  

  const postArticle = (article) => {
    const token = localStorage.getItem("token");
    console.log(article)
    setSpinnerOn(true);
    axios
      .post(`${articlesUrl}`, article, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        console.log(res);
        setMessage(res.data.message);
        setArticles(articles => {
          return articles.concat(res.data.article)
        });
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  };

  const updateArticle = ({ article_id, article}) => {
    const token = localStorage.getItem("token");
    console.log(article_id);

    axios
      .put(
        `http://localhost:9000/api/articles/${article_id}`,
         article,
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((res) => {
        
        console.log(res.data)
        setArticles((prevArt) => {
          console.log('1', prevArt)
         return prevArt.map(art => {
            console.log('2', res.data.article)
            return art.article_id === article_id ? res.data.article : art
           })
        }
        );
        setCurrentArticleId(null)
        setMessage(res.data.message)
      })  
      .catch((err) => {
        console.log(err);
      });

    // ✨ implement
    // You got this!
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    const token = localStorage.getItem("token");
    console.log(article_id)
    

    axios.delete(`http://localhost:9000/api/articles/${article_id.article_id}`, {
      headers: {
        authorization: token,
      }
      
    })
    .then((res) => {
      console.log(articles)
      console.log(res.data)
      setMessage(res.data.message)
      setArticles(articles => {
        return articles.filter(art => {
          return art.article_id != article_id.article_id
        })
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  




  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} setSpinnerOn={setSpinnerOn}/>} />
          <Route
            path="articles"
            element={<PrivateRoute> 
              
                <ArticleForm
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                  currentArticle={articles.find(art => art.article_id === currentArticleId)}
                  
                />
                <Articles
                  updateArticle={updateArticle}
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                  setSpinnerOn={setSpinnerOn}
                  
                />
              
              </PrivateRoute>
            }
          />
          
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
