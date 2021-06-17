import React, { useState, useEffect } from "react";
import "./App.css";
import {
  useHistory,
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import postPerson, { Nullable } from "./service/postPerson";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" component={PersonForm} exact />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

const PersonForm = (): JSX.Element => {
  const [inputNameValue, setinputNameValue] = useState("");
  const [inputDateValue, setinputDateValue] = useState("");

  const history = useHistory();

  const getQuery = (parameter: string): Nullable<string> =>
    // eslint-disable-next-line no-restricted-globals
    new URLSearchParams(location.search).get(parameter);

  const getName = (): Nullable<string> => getQuery("name");
  const getDate = (): Nullable<string> => getQuery("date");

  const handleChangeName = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    setinputNameValue(ev.target.value);
  };

  const handleChangeDate = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    setinputDateValue(ev.target.value);
  };

  useEffect(() => {
    const name = getName();
    const date = getDate();
    if (name) {
      setinputNameValue(name);
    }
    if (date) {
      setinputDateValue(date);
    }

    postPerson(getName(), getDate());

    // eslint-disable-next-line no-restricted-globals
  }, [location.search]);

  const onClickBtn = (): boolean => {
    if (inputNameValue && inputDateValue) {
      history.push(`/?name=${inputNameValue}&date=${inputDateValue}`);
    } else {
      if (inputNameValue) {
        history.push(`/?name=${inputNameValue}`);
      } else {
        if (inputDateValue) {
          history.push(`/?date=${inputDateValue}`);
        } else {
          history.push("/");
        }
      }
    }
    return false;
  };

  return (
    <Form>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          onChange={handleChangeName}
          type="text"
          placeholder="Enter name"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Birthday</Form.Label>
        <Form.Control
          onChange={handleChangeDate}
          type="text"
          placeholder="Birthday"
        />
      </Form.Group>
      <Button onClick={onClickBtn} variant="primary">
        Submit
      </Button>
    </Form>
  );
};
