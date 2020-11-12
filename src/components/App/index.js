import "./App.css";
import React, { useEffect, useState } from "react";
import Quotes from "../Quotes/index";
import BootCamperRecord from "../Input/index";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import HomePage from "../HomePage";
import Form from "../Form";
import RecentPost from "../Display/recent_post";
import Filter from "../Filter/index";

function App() {
  const [id, setId] = useState("");
  const [userHistory, setUserHistory] = useState([]);
  const [query, setQuery] = useState(null);
  const [postBody, setPostBody] = useState();
  const [formSubmit, setFormSubmit] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [userIdSubmit, setUserIdSubmit] = useState(true);
  const [name, setName] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [isDateFilter, setIsDateFilter] = useState(false);

  function signOut() {
    setUserIdSubmit(true);
    setQuery(null);
    setName("");
  }

  function removeDateFilter() {
    setIsDateFilter(false);
    setDateFilter("1970-01-01");
  }

  function filterHistoryDate(date) {
    setDateFilter(date);
    setIsDateFilter(true);
  }

  function getRandomId() {
    let randomId = Math.floor(Math.random() * 10) + 1;
    setId(randomId);
  }

  function welcomeMessage() {
    setUserIdSubmit(false);
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  useEffect(() => {
    async function deleteFromDB() {
      const requestOptions = {
        method: "DELETE",
      };
      console.log(requestOptions);
      fetch(`http://localhost:5000/notes/${deleteId}`, requestOptions);
      setDeleteId(null);
    }
    deleteId && deleteFromDB();
  }, [deleteId]);

  function addToPost(formData) {
    const newFormData = JSON.stringify(formData);
    setPostBody(newFormData);
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    Array.from(document.querySelectorAll("textarea")).forEach(
      (input) => (input.value = "")
    );
    Array.from(document.querySelectorAll("select")).forEach(
      (input) => (input.value = "default")
    );
    setFormSubmit(false);
  }

  useEffect(() => {
    async function addToDB() {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: postBody,
      };
      fetch(`http://localhost:5000/notes/`, requestOptions);
    }
    postBody && addToDB();
  }, [postBody]);

  return (
    <div className="App">
      {/* <Quotes id={id} />
      <button
        className="button"
        onClick={() => {
          getRandomId();
        }}
      >
        Inspire Me
      </button>
      <br></br> */}
      <Router className="link-header">
        <div style={{width:"100%"}} className="App nav-bar">
          <nav>

          <ul>
            <li><Link style={{color: "#333"}} to="/">Home </Link></li>
            <li><Link style={{color: "#333"}} to="/new-meeting"> New Meeting Log </Link></li>
            <li><Link style={{color: "#333"}} to="/history"> My History </Link></li>
            <li onClick={() => setUserIdSubmit(true)}><a href="#top" style={{color: "#333", align:"right"}}>Sign Out</a></li>
          </ul>

          </nav>
          </div>
          <div>
      <Quotes id={id} />
      <button
        className="button"
        onClick={() => {
          getRandomId();
        }}
      >
        Inspire Me
      </button>
      <br></br>
          <Switch>
            <Route path="/new-meeting">
              {formSubmit && (
                <Form onClickfn={addToPost} userId={query} name={name} />
              )}
              {formSubmit === false && (
                <div>
                  <h2>Congrats! Meeting notes submitted ✅</h2>
                  <button onClick={() => setFormSubmit(true)}>
                    Add another meeting log
                  </button>
                  <RecentPost postBody={postBody} />
                </div>
              )}
            </Route>
            <Route path="/history">
              <BootCamperRecord
                id={id}
                query={query}
                userHistory={userHistory}
                setQuery={setQuery}
                setUserHistory={setUserHistory}
                handleDelete={handleDelete}
                deleteId={deleteId}
                filterHistoryDate={filterHistoryDate}
                dateFilter={dateFilter}
                isDateFilter={isDateFilter}
                removeDateFilter={removeDateFilter}
              />
            </Route>
            <Route path="/">
              <HomePage />
              {userIdSubmit && (
                <Filter
                  setQuery={setQuery}
                  userIdSubmit={welcomeMessage}
                  name={name}
                  setName={setName}
                />
              )}
              {userIdSubmit === false && (
                <div>
                  <h2>Welcome to your meeting log</h2>
                  <h2>{name}</h2>
                  <button onClick={() => signOut()}>Sign out</button>
                </div>
              )}
            </Route>
          </Switch>
          {/* <nav className="nav-bar">
            <Link to="/">Home - </Link>
            <Link to="/new-meeting"> New Meeting Log - </Link>
            <Link to="/history"> My History </Link>
          </nav> */}
        </div>
      </Router>
      <br></br>
      <br></br>
    </div>
  );
}

export default App;
