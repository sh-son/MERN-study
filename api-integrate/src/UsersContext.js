import React, { createContext, useReducer, useContext } from 'react';

// UsersContext 에서 사용 할 기본 상태
const initialState = {
  users: {
    loading: false,
    data: null,
    error: null
  },
  user: {
    loading: false,
    data: null,
    error: null
  }
};

// 로딩 중일 때 바뀔 상태 객체
const loadingState = {
  loading: false,
  data: null,
  error: null
};

// 성공했을 때의 상태 만들어주는 함수
const success = data => ({
  loading: false,
  data,
  error: null
});

// 실패했을 때의 상태 만들어주는 함수
const error = error => ({
  loading: false,
  data: null,
  error: error
});

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
const useReducer = (state, action) => {
  switch (action.type) {
    case 'GET_USERS':
      return {
        ...state,
        users: loadingState
      };
    case 'GET_USERS_SUCCESS':
      return {
        ...state,
        users: success(action.data)
      };
    case 'GET_USERS_ERROR':
      return {
        ...state,
        users: error(action.error)  
      };
    case 'GET_USER':
      return {
        ...state,
        users: loadingState
      }
    case 'GET_USER_SUCCESS':
      return {
        ...state,
        user: success(action.data)
      }
    case 'GET_USER_ERROR':
      return {
        ...state,
        user: error(action.error)  
      }
    default:
      throw new Error(`Unhanded action type: ${action.type}`);
  }
}

// State 용 Context 와 Dispatch 용 Context 따로 만들어주기
const UsersStateContext = createContext(null);
const UsersDispatcContext = createContext(null);

// 위에서 선언한 두가지 Context 들의 Provider 로 감싸주는 컴포넌트
const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UsersReducer, initialState);
  return (
    <UsersStateContext.Provider value={dispatch}>
      <UsersDispatcContext>
        {children}
      </UsersDispatcContext>
    </UsersStateContext.Provider>
  );
}

// State 를 쉽게 조회 할 수 있게 해주는 커스텀 Hook
const useUsersState = () => {
  const state = useContext(UsersStateContext);
  if (!state) {
    throw new Error('Cannot find UsersProvider');
  }

  return state;
}

// Dispatch 를 쉽게 사용 할 수 있게 해주는 커스텀 Hook
const useUserDispatch = () => {
  const dispatch = useContext(UsersDispatcContext);
  if (!dispatch) {
    throw new Error('Cannot find UsersProvider');
  }
  
  return dispatch;
}