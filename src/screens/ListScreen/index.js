import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, SafeAreaView, ScrollView, View} from 'react-native';
import {BottomBarListIcon} from '../../assets/common';
import ListCard from '../../components/ListCard';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {listService} from '../../services/ListService';
import colors from '../../constants/colors';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import EmptyScreenComponent from '../../components/common/EmptyScreenComponent';

function ListScreen() {
  const localStyle = useStyleProcessor(styles, 'ListScreen');
  const [isLoading, setIsLoading] = useState(true);
  const listDataRef = useRef({});

  const fetchData = useCallback(() => {
    setIsLoading(true);
    const _listService = listService();
    _listService.getAllLists().then(list => {
      listDataRef.current = JSON.parse(list);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reloadList = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    LocalEvent.on(EventTypes.UpdateList, fetchData);
    return () => {
      LocalEvent.off(EventTypes.UpdateList, fetchData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onListAddSuccess = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const onAddListPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddListModal, {
      onListAddSuccess,
    });
  }, [onListAddSuccess]);

  return (
    <SafeAreaView style={localStyle.container}>
      {isLoading ? (
        <View style={localStyle.loaderStyle}>
          <ActivityIndicator animating={isLoading} />
        </View>
      ) : listDataRef.current == null ? (
        <EmptyScreenComponent
          emptyImage={BottomBarListIcon}
          buttonText={'Create a new List'}
          onButtonPress={onAddListPress}
          descriptionText={
            'Stay up-to-date on the favorite topics by tweeters you love'
          }
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyle.scrollViewContainer}
          style={localStyle.scrollViewStyle}>
          {Object.keys(listDataRef.current).map(key => {
            const list = listDataRef.current[key];
            const singleListData = {
              listId: list?.id,
              listName: list?.name,
              // TODO: change image url
              imageUrl: 'https://picsum.photos/200/300',
            };
            return (
              <ListCard
                key={singleListData.listId}
                data={singleListData}
                onListRemoved={reloadList}
              />
            );
          })}
          <View />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  headerView: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomWidth: 0.8,
    borderColor: colors.SherpaBlue,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: colors.DodgerBlue,
    fontSize: fontPtToPx(35),
  },
  scrollViewStyle: {
    paddingTop: layoutPtToPx(20),
  },
  add: {
    paddingVertical: layoutPtToPx(10),
    paddingHorizontal: layoutPtToPx(20),
    position: 'absolute',
    right: layoutPtToPx(20),
  },
  loaderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainer: {
    paddingBottom: layoutPtToPx(20),
  },
};

export default React.memo(ListScreen);
