import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./App.css";

const App = () => {
  const api = "https://614359e2c5b553001717cf2d.mockapi.io/api/fake";
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const getCall = async () => {
      try {
        const response = await fetch(api, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-type": "application/json",
          },
        });
        // console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! status:${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setData(data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    getCall();

    return () => {};
  }, []);

  const handleEdit = (id) => {
    // console.log(id);
    navigate(`/form/${id}`);
  };

  const handleDelete = (id) => {
    const deleteCall = async () => {
      const response = await fetch(`${api}/${id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const status = await response.status;
      if (status === 200) {
        clearUp(id);
        alert("Delete success");
      }
      console.log(response.status);
    };
    deleteCall();
  };

  const clearUp = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <>
      <NavLink to="/form">add</NavLink>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>avatar</th>
              <th>phone</th>
              <th>status</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    <img
                      src={item.avatar}
                      className="round"
                      alt="avatar"
                      width="50"
                      height="50"
                    />
                  </td>
                  <td>{item.phone}</td>
                  <td>
                    {item.status ? (
                      <span className="on">online</span>
                    ) : (
                      <span className="off">offline</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(item.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {/* <Outlet></Outlet> */}
    </>
  );
};

export default App;
