// Global imports
import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Local imports
import { useAuth } from '../hooks';

// TODO: Replace this with a Cognito Custom UI.
const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | undefined>(user.current?.username);
  const [password, setPassword] = useState<string>('');

  const onUsernameChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setUsername(evt.target.value);
  };
  const onPasswordChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setPassword(evt.target.value);
  };
  const onLogin = () => {
    if (username) {
      // user.login(username);
      navigate('/');
    }
  };
  const onCancel = () => {
    user?.logout();
  };

  return (
    <div className="wrapper">
      <div className="container">
        <form className="section log-form login" onSubmit={onLogin}>
          <label htmlFor="username">
            Username
            <input type="text" value={username as string} onChange={onUsernameChange} />
          </label>
          <label htmlFor="password">
            Password
            <input type="password" value={password} onChange={onPasswordChange} />
          </label>
          <div className="log-form-buttons">
            <Link className="button cancel" onClick={onCancel} to="/login">Cancel</Link>
            <button className="button submit" type="submit" onClick={onLogin}>Log in</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
