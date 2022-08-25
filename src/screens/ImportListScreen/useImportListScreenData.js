import {useEffect, useRef, useState} from 'react';
import {listService} from '../../services/ListService';

const useImportListScreenData = data => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const listsData = useRef(data);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    aData: listsData.current,
    nSelectedIndex: selectedIndex,
    fnUpdateSelectedIndex: setSelectedIndex,
  };
};

export default useImportListScreenData;
