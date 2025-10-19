import React, { useEffect } from 'react';

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const Trigger: React.FC<Props> = ({ setLoading }) => {
  useEffect(() => {
    setLoading(true);
    return () => {
      setLoading(false);
    };
  }, [setLoading]);

  return <></>;
};

export default Trigger;