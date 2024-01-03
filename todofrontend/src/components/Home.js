import React, { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import EditIcon from "../assets/icons/EditIcon";
import { format, startOfToday } from "date-fns";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  let today = startOfToday();
  const [date, setDate] = useState(today);

  useEffect(() => {
    setErrMsg("");
  }, [taskInput]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/tasks/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTasks(response.data);
      } catch (err) {
        if (err.response.data.message === "User is not authorised") {
          localStorage.removeItem("accessToken");
        }
        setErrMsg("Error fetching tasks");
      }
    };

    fetchTasks();
  }, [accessToken]);

  const handleTaskInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/tasks/",
        {
          name: taskInput,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Update tasks using the previous state
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (err) {
      setErrMsg(err.response.data.mesage);
    }
    setTaskInput("");
  };

  const handleEdit = async (taskID) => {
    console.log("Edit task with ID: ", taskID);
  };

  const handleDelete = async (taskID) => {
    try {
      await axios.delete(`/tasks/${taskID}`, {
        headers: {
          Authorization: `Bearer: ${accessToken}`,
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskID));
    } catch (err) {
      console.error("Error deleting task:", err);
      setErrMsg("Error deleting task");
    }
  };

  const handleDateSelection = (selectedDate) => {
    setDate(selectedDate);
  };

  return (
    <div className="home">
      {/* Daily Task left side section */}
      <div className="dailyTasks-container">
        <div className="dailyTasks-container-inner">
          <div className="dateLabel">
            <h2>
              {format(date, "dd MMM yy") === format(today, "dd MMM yy")
                ? format(date, "'Today''s Tasks'")
                : format(date, "dd MMM yy - EEEE")}
            </h2>
          </div>
          <div className="group">
            <form onSubmit={handleTaskSubmit}>
              <input
                id="task"
                type="text"
                value={taskInput}
                onChange={handleTaskInputChange}
                required="required"
              />
              <label htmlFor="task">Enter</label>
              <div className="bar"></div>
            </form>
          </div>
          <div className="dailyList">
            <ul>
              {tasks.map((task, index) => (
                <div key={index} className="task-item">
                  <li className="task-list-item">
                    <span
                      className="task-name"
                      onClick={() => handleDelete(task._id)}
                    >
                      {task.name}
                    </span>
                    <div className="button-group">
                      <button
                        className="icon-button"
                        onClick={() => handleEdit(task._id)}
                      >
                        <EditIcon />
                      </button>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Calendar and Calendar Tasks right side */}
      <div className="calendar">
        <Calendar onSelectDate={handleDateSelection} />
      </div>
    </div>
  );
};

export default Home;
