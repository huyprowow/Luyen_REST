import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Form = () => {
  const api = "https://614359e2c5b553001717cf2d.mockapi.io/api/fake";
  let navigate = useNavigate(); //useNavigate thay cho useHistory trong react-router 6
  const [name, setName] = useState("");
  const [linkAvatar, setLinkAvatar] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userStatus, setUserStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  let { id } = useParams();

  useEffect(() => {
    if (id !== undefined) {
      // truong hop edit
      const getIdCall = async () => {
        try {
          const response = await fetch(`${api}/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status ${response.status}`);
          }
          const data = await response.json();

          setName(data.name);
          setLinkAvatar(data.avatar);
          setPhone(data.phone);
          setEmail(data.email);
          setUserStatus(data.status);
          console.log(name, linkAvatar, phone, email, userStatus);
          console.log(data);
          setLoading(false);
        } catch (err) {
          console.error(err);
        }
      };
      getIdCall();
    } else {
      setLoading(false); //them moi thi k can do dl ve => k can load
    }
  }, []);

  const handleChange = (e) => {
    // e.preventDefault();
    const { name, value } = e.target;
    // console.log(e.target);
    // console.log(name, value);

    switch (name) {
      case "name":
        setName(value);
        break;
      case "avatar":
        setLinkAvatar(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "status":
        setUserStatus(value === "true" ? true : false);
        break;
      default:
        break;
    }
  };
  // const handleClick = (e) => {
  //   const { value } = e.target;
  //   value === "true" ? setUserStatus(true) : setUserStatus(false);
  // };
  const postCall = async () => {
    try {
      const response = await fetch(api, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          avatar: linkAvatar,
          phone: phone,
          status: userStatus,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status ${response.status}`);
      }
      if (response.status === 201) {
        alert("Add success");
        navigate("/"); //qualai su khi submit xong
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const putCall = async () => {
    console.log(id);
    try {
      const response = await fetch(`${api}/${id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          avatar: linkAvatar,
          phone: phone,
          status: userStatus,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status ${response.status}`);
      }
      if (response.status === 200) {
        alert("edit success");
        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault(); //chan hanh dong mac dinh cua form

    //go back 1 page navigate(-1) goforward 1 page navigate(1)
    console.log(name, linkAvatar, phone, email, userStatus);

    id === undefined ? postCall() : putCall();
  };
  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <form>
          <label htmlFor="input-name">
            Name
            <input
              type="text"
              id="input-name"
              placeholder="name"
              onChange={handleChange}
              name="name"
              value={name}
            />
          </label>
          <label htmlFor="input-avatar">
            Avatar
            <input
              type="text"
              id="input-avatar"
              placeholder="avatar"
              onChange={handleChange}
              name="avatar"
              value={linkAvatar}
            />
          </label>
          <label htmlFor="input-phone">
            Phone
            <input
              type="tel"
              id="input-phone"
              placeholder="phone"
              onChange={handleChange}
              name="phone"
              value={phone}
            />
          </label>
          <label htmlFor="input-name">
            Email
            <input
              type="email"
              id="input-email"
              placeholder="email"
              onChange={handleChange}
              name="email"
              value={email}
            />
          </label>
          <fieldset>
            <legend>Status</legend>
            <label htmlFor="input-status-online">
              Online
              <input
                type="radio"
                id="input-status-online"
                name="status"
                defaultChecked={
                  loading === false ? userStatus === true : console.log(loading) //yeu cau log ra loading de xu li bat dong bo
                }
                value={true}
                // onClick={handleClick}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="input-status-offline">
              Offline(default)
              <input
                type="radio"
                id="input-status-offline"
                name="status"
                defaultChecked={
                  loading === false
                    ? userStatus === false
                    : console.log(loading) //yeu cau log ra loading de xu li bat dong bo
                }
                value={false}
                // onClick={handleClick}
                onChange={handleChange}
              ></input>
            </label>
          </fieldset>
          <input type="submit" onClick={handleSubmit}></input>
        </form>
      )}
    </>
  );
};

export default Form;
