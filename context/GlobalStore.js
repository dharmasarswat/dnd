import { createContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [defaultPceLibrary, setDefaultPceLibrary] = useState([
    {
      id: nanoid(),
      description: 'Lubricator',
      imageURL:
        'https://firebasestorage.googleapis.com/v0/b/wiremaster-free-plan.appspot.com/o/default-pce-images%2F5%20inch%20lubricator.svg?alt=media&token=836530b8-eb35-4195-8a83-ec9c8fefea56',
    },
    {
      id: nanoid(),
      description: 'Grease Injection Head',
      imageURL:
        'https://firebasestorage.googleapis.com/v0/b/wiremaster-free-plan.appspot.com/o/default-pce-images%2Fgrease%20injection%20head.svg?alt=media&token=d5f8ccba-ab72-4bb0-be81-2b247100a5cf',
    },
    {
      id: nanoid(),
      description: 'Dual Wireline Valve',
      imageURL:
        'https://firebasestorage.googleapis.com/v0/b/wiremaster-free-plan.appspot.com/o/default-pce-images%2Fdual%20wireline%20valve.svg?alt=media&token=700e08c6-e095-41f1-b1dd-44e0bf46d318',
    },
  ]);

  return (
    <GlobalContext.Provider value={{ defaultPceLibrary }}>
      {children}
    </GlobalContext.Provider>
  );
};
