import React from 'react';
export function FlashMessage({message}){
    return (
        <div>
    {message.type ==="success" ? (<div>{message.content}</div>) : null}
    {message.type ==="fail" ? (<div>{message.content}</div>) : null}
     
     
        </div>
    )
}
export function flashErrorMessage(dispatch, error) {
    const err = error.response ? error.response.data : error; // check if server or network error
    dispatch({
      type: 'FLASH_MESSAGE',
      payload: {
        type: 'fail',
        title: err.name,
        content: err.message,
      },
    });
}