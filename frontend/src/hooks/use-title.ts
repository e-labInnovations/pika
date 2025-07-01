import { useEffect } from 'react';

export const useTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | Pika App`;
  }, [title]);
};
