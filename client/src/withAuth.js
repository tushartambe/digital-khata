import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';

const withAuth = (ComponentToProtect) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
      fetch('/checkToken')
        .then(res => {
          if (res.status === 200) {
            setLoading(false);
          } else {
            throw new Error(res.error);
          }
        })
        .catch(err => {
          setLoading(false);
          setRedirect(true);
        });
    });

    return loading ? null : redirect ? <Redirect to="/login"/> : <ComponentToProtect {...props} />;
  }
};

export default withAuth;