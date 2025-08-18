import { createContext, useEffect, useMemo, useReducer, type PropsWithChildren } from 'react';
import { type User, authService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  signIn: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

type AuthProviderProps = PropsWithChildren;
type ReducerAction =
  | {
      type: 'SIGN_IN';
      payload: { user: User };
    }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_LOADING'; payload: { loading: boolean } };

type StateType = {
  user: User | null;
  loading: boolean;
};

const initialState: StateType = {
  user: null,
  loading: true,
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        user: action.payload.user,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload.loading,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authService.getMe();
        dispatch({
          type: 'SIGN_IN',
          payload: { user: response.data as User },
        });
      } catch {
        dispatch({ type: 'SIGN_OUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { loading: false } });
      }
    };

    // Always try to fetch user data on mount (cookie will be sent automatically)
    fetchUserData();
  }, []);

  const signIn = async (user: User) => {
    dispatch({ type: 'SIGN_IN', payload: { user } });
  };

  const signOut = async (): Promise<void> => {
    try {
      // Call the logout endpoint to remove the cookie
      await authService.logout();
    } catch (error) {
      // Even if the logout API call fails, we still want to clear the local state
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear the local state
      dispatch({ type: 'SIGN_OUT' });
    }
  };

  const contextValue = useMemo(
    () => ({
      user: state.user,
      signIn,
      signOut,
      loading: state.loading,
    }),
    [state.user, state.loading],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
