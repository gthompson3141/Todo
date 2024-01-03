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

  // Start with today's date
  let today = startOfToday();
  const [date, setDate] = useState(today);

  // Clear error message when task input changes
  useEffect(() => {
    setErrMsg("");
  }, [taskInput]);

  // Fetch tasks when access token changes
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
        // Handle unauthorized access
        if (err.response.data.message === "User is not authorised") {
          localStorage.removeItem("accessToken");
        }
        setErrMsg("Error fetching tasks");
      }
    };

    fetchTasks();
  }, [accessToken]);

  // Handle task input change
  const handleTaskInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  // Handle task submission
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
      // Set error message for task submission
      setErrMsg(err.response.data.message);
    }
    setTaskInput("");
  };

  // Handle task edit
  const handleEdit = async (taskID) => {
    console.log("Edit task with ID: ", taskID);
  };

  // Handle task deletion
  const handleDelete = async (taskID) => {
    try {
      await axios.delete(`/tasks/${taskID}`, {
        headers: {
          Authorization: `Bearer: ${accessToken}`, // Fix typo: "Bearer: ${accessToken}"
        },
      });
      // Remove the deleted task from the tasks list
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskID));
    } catch (err) {
      // Log and set error message for task deletion
      console.error("Error deleting task:", err);
      setErrMsg("Error deleting task");
    }
  };

  // Handle date selection from the calendar
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
              {/* Display "Today's Tasks" if the date is today, else display formatted date */}
              {format(date, "dd MMM yy") === format(today, "dd MMM yy")
                ? format(date, "'Today''s Tasks'") // Correct typo: "Today''s Tasks'"
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
              {/* Map through tasks and display task information */}
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
                      {/* Button to edit task */}
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

      {/* Calendar and Calendar Tasks right


      {/* Calendar and Calendar Tasks right side */}
      <div className="calendar">
        <Calendar onSelectDate={handleDateSelection} />
      </div>
    </div>
  );
};

export default Home;
