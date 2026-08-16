'use client';

import React, {
  createContext,
  type PropsWithChildren,
  useEffect,
  useReducer,
} from 'react';
import { createContextReducer } from '@/lib/createContextReducer';

export type Track = {
  added: Date;
  album: string;
  artist: string | string[];
  duration: string; // Date?
  href: string; // spotify link
  id: string;
  name: string;
  popularity: number;
  releaseDate: Date;
};

export const DashboardContext = createContext<{
  loading: boolean;
  fetchFavorites: () => Promise<void>;
  loadingState?: string;
  tracks: Track[];
}>({
  loading: false,
  fetchFavorites: async () => {},
  tracks: [],
});

const DB_NAME = 'spotify-favorites';
const DB_VERSION = 1;
const DB_STORE_NAME = 'tracks';

const getDb = async (req?: IDBOpenDBRequest) => {
  console.log('@--> opening db');
  const request = req || indexedDB.open(DB_NAME, DB_VERSION);

  request.onsuccess = () => {
    console.log('@--> success');
  };

  request.onerror = () => {
    console.log('@--> error');
  };

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    const db = (event.target as IDBOpenDBRequest).result;
    const store = db.createObjectStore(DB_STORE_NAME, {
      keyPath: 'id',
      autoIncrement: false,
    });

    store.createIndex('id', 'id', { unique: true });
    store.createIndex('popularity', 'popularity', { unique: false });
    store.createIndex('name', 'name', { unique: false });
    store.createIndex('artists', 'artist', {
      unique: false,
      multiEntry: true,
    });
    store.createIndex('album', 'album', { unique: false });
    store.createIndex('duration', 'duration', { unique: false });
    store.createIndex('addedAt', 'added', { unique: false });
  };

  if (request.readyState === 'pending') {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getDb(request);
  }

  return request.result as IDBDatabase;
};

const getTransaction = ({
  db,
  mode,
}: {
  db: IDBDatabase;
  mode: IDBTransactionMode;
}) => {
  const trx = db.transaction(DB_STORE_NAME, mode);

  trx.oncomplete = () => console.log('@--> trx complete');
  trx.onerror = (e) => {
    if (e?.target?.error.name !== 'ConstraintError') {
      console.log('@--> trx error', e);
    }
  };
  return trx.objectStore(DB_STORE_NAME);
};

type InitialValue = {
  loading: boolean;
  loadingState?: string;
  db: IDBDatabase | undefined;
  data: [];
};

const initialValue: InitialValue = {
  loading: true,
  loadingState: undefined,
  db: undefined,
  data: [],
};

function msToTime(ms: number) {
  const date = new Date(ms);
  const val = date.toISOString().slice(14, 19);
  return val;
}

const [reducer, _context] = createContextReducer(
  {
    SET_LOADING: (state, { loading }) => ({ ...state, loading }),
    SET_LOADING_STATE: (state, { loadingState }) => ({
      ...state,
      loadingState,
    }),
    SET_DB: (state, { db }) => ({ ...state, db }),
    SET_DATA: (state, { data }) => ({ ...state, data, loading: false }),
  },
  initialValue,
);

const getAllData = async ({
  db,
  req,
}: {
  db: IDBDatabase;
  req?: IDBRequest;
}) => {
  const trx = getTransaction({ db, mode: 'readonly' });
  const result = req || trx.getAll();
  if (result.readyState !== 'done') {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getAllData({ db, req: result });
  }
  return result.result;
};

function DashboardProvider({
  children,
  cookies,
}: PropsWithChildren<{ cookies: { accessToken?: { value: string } } }>) {
  const [state, dispatch] = useReducer(reducer, initialValue);

  // biome-ignore lint/correctness/useExhaustiveDependencies: load page
  useEffect(() => {
    const returnDb = async () => {
      // load db
      if (!state.db) {
        const returnedDb = await getDb();
        dispatch({ type: 'SET_DB', payload: { db: returnedDb } });
        if (!state.data.length && returnedDb) {
          const data = await getAllData({ db: returnedDb });
          dispatch({ type: 'SET_DATA', payload: { data } });
        }
        dispatch({ type: 'SET_LOADING', payload: { loading: false } });
      }
    };
    returnDb();
  }, []);

  const fetchFavorites = async (nextUrl = undefined) => {
    if (!state.loading) {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
    }
    const url = nextUrl || 'https://api.spotify.com/v1/me/tracks?limit=50';
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${cookies.accessToken.value}`,
      },
    });

    if (resp.ok) {
      const json = await resp.json();
      const currentState = `${json.offset + json.limit} / ${json.total}`;
      dispatch({
        type: 'SET_LOADING_STATE',
        payload: { loadingState: currentState },
      });
      for (const item of json.items) {
        const data = {
          added: new Date(item.added_at),
          album: item.track.album.name,
          artist: item.track.artists.map(({ name }: { name: string }) => name),
          duration: msToTime(item.track.duration_ms),
          href: item.track.external_urls.spotify,
          id: item.track.id,
          name: item.track.name,
          popularity: item.track.popularity,
          releaseDate: new Date(item.track.album.release_date),
        };
        const trx = getTransaction({
          db: state.db as IDBDatabase,
          mode: 'readwrite',
        });
        trx.add(data);
      }
      if (json.next) {
        return fetchFavorites(json.next);
      }
    }

    const data = await getAllData({ db: state.db as IDBDatabase });
    dispatch({
      type: 'SET_LOADING_STATE',
      payload: { loadingState: undefined },
    });
    dispatch({ type: 'SET_DATA', payload: { data } });
  };

  return (
    <DashboardContext.Provider
      value={{
        fetchFavorites,
        loading: state.loading,
        tracks: state.data,
        loadingState: state.loadingState,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export default DashboardProvider;
